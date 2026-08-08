const { buildInterviewPrompt, buildFeedbackPrompt } = require("../utils/promptBuilder");

async function requestCompletion(prompt) {
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    const baseUrl = process.env.DEEPSEEK_BASE_URL ||
        process.env.OPENAI_BASE_URL ||
        process.env.PENAI_BASE_URL ||
        "https://api.openai.com/v1/chat/completions";
    const model = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey || typeof fetch !== "function") {
        return null;
    }

    try {
        const response = await fetch(
            baseUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.5
                })
            }
        );

        if (!response.ok) {
            console.warn(`LLM request failed with status ${response.status}. Using fallback response.`);
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
        console.warn(`LLM request failed: ${error.message}. Using fallback response.`);
        return null;
    }
}

function getPreviousAnswer(messages) {
    return messages.filter((message) => message.role === "candidate").at(-1)?.content?.trim();
}

function getAnswerExcerpt(answer) {
    const compactAnswer = answer.replace(/\s+/g, " ");
    return compactAnswer.length > 140 ? `${compactAnswer.slice(0, 137)}...` : compactAnswer;
}

function fallbackTopicQuestion(topic, questionNumber) {
    const topicName = topic.title.toLowerCase();
    const templates = [
        `Walk me through how you would design ${topicName} for a production application. Which technical choices would you make and why?`,
        `What trade-offs would you evaluate when implementing ${topicName}, and how would you test your approach?`,
        `Imagine this feature is failing in production: how would you diagnose and improve ${topicName}?`,
        `What would a reliable implementation of ${topicName} look like, and which metrics would you use to validate it?`
    ];

    return templates[(questionNumber - 1) % templates.length];
}

function fallbackQuestion({ topic, messages, questionNumber }) {
    const previousAnswer = getPreviousAnswer(messages);

    if (previousAnswer) {
        const excerpt = getAnswerExcerpt(previousAnswer);
        const followUps = [
            `You mentioned "${excerpt}". For ${topic.title}, what trade-off did that approach introduce, and how would you validate the decision?`,
            `In your answer, you said "${excerpt}". How would you implement that approach for ${topic.title}, and what would you test first?`,
            `You described "${excerpt}". What assumption would you challenge before using that approach in ${topic.title}?`,
            `You proposed "${excerpt}". What failure mode would concern you most in ${topic.title}, and how would you mitigate it?`
        ];

        return followUps[(questionNumber - 1) % followUps.length];
    }

    return fallbackTopicQuestion(topic, questionNumber);
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
