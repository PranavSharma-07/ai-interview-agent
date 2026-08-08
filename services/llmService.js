const { buildInterviewPrompt, buildFeedbackPrompt } = require("../utils/promptBuilder");

async function requestCompletion(prompt) {
    if (!process.env.OPENAI_API_KEY || typeof fetch !== "function") {
        return null;
    }

    try {
        const response = await fetch(
            process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch {
        return null;
    }
}

function fallbackQuestion({ topic, messages }) {
    const previousAnswer = messages.filter((message) => message.role === "candidate").at(-1)?.content;
    const objective = topic.objectives[0];
    const followUp = previousAnswer ? " Building on your previous answer," : "";

    return `${followUp} how would you apply ${objective.toLowerCase()} when working with ${topic.title}?`;
}

function fallbackFeedback({ topics, messages }) {
    const answers = messages.filter((message) => message.role === "candidate");
    const coveredDays = topics.map((topic) => topic.day).join(", ");
    const detailedAnswers = answers.filter((answer) => answer.content?.trim().length >= 40).length;

    return {
        summary: `Completed an eight-question interview covering curriculum days ${coveredDays}.`,
        strengths: [
            "Completed the curriculum missions selected for this interview.",
            detailedAnswers ? "Provided detail in several interview responses." : "Engaged with each interview topic."
        ],
        gaps: ["Add more concrete technical reasoning and examples to each answer."],
        next: [
            `Review Day ${topics[0].day}: ${topics[0].title}.`,
            "Practice explaining design decisions, trade-offs, and validation steps."
        ]
    };
}

async function generateInterviewQuestion(context) {
    const question = await requestCompletion(buildInterviewPrompt(context));
    return question || fallbackQuestion(context);
}

function parseFeedback(content) {
    try {
        const feedback = JSON.parse(content);
        const hasExpectedShape = typeof feedback.summary === "string" &&
            ["strengths", "gaps", "next"].every((field) =>
                Array.isArray(feedback[field]) && feedback[field].every((item) => typeof item === "string")
            );

        return hasExpectedShape ? feedback : null;
    } catch {
        return null;
    }
}

async function generateFeedback(context) {
    const content = await requestCompletion(buildFeedbackPrompt(context));
    return (content && parseFeedback(content)) || fallbackFeedback(context);
}

module.exports = { generateInterviewQuestion, generateFeedback };
