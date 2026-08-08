const { getCandidateProfile, getInterviewTopics } = require("./curriculumService");
const { generateInterviewQuestion, generateFeedback } = require("./llmService");
const {
    hasSession,
    createSession,
    getSession,
    addCandidateMessage,
    addInterviewerMessage,
    recordQuestion
} = require("../utils/sessionStore");

function getCandidateId(candidate) {
    return candidate?.member?.id || candidate?.id;
}

function getProfile(candidate) {
    return candidate?.missions ? candidate : getCandidateProfile(getCandidateId(candidate));
}

function startInterview(sessionId, candidate) {
    const profile = getProfile(candidate);
    const topics = getInterviewTopics(profile);
    createSession(sessionId, candidate, profile, topics);

    return {
        reply: "Welcome. Let's begin your interview.",
        done: false
    };
}

async function continueInterview(sessionId, message) {
    const session = getSession(sessionId);
    addCandidateMessage(session, message);

    if (session.questionsAsked >= session.topics.length) {
        const feedback = await generateFeedback({
            candidate: session.candidate,
            profile: session.profile,
            topics: session.topics,
            messages: session.messages
        });

        return { reply: "Interview completed.", done: true, feedback };
    }

    const topic = session.topics[session.questionsAsked];
    const questionNumber = session.questionsAsked + 1;
    const reply = await generateInterviewQuestion({
        candidate: session.candidate,
        profile: session.profile,
        topic,
        messages: session.messages,
        questionNumber
    });
    addInterviewerMessage(session, reply);
    recordQuestion(session);

    return { reply, done: false };
}

async function handleInterviewMessage({ sessionId, candidate, message }) {
    if (!hasSession(sessionId)) {
        return startInterview(sessionId, candidate);
    }

    return continueInterview(sessionId, message);
}

module.exports = { handleInterviewMessage };
