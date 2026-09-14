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

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}

function getCandidateId(candidate) {
    return candidate?.member?.id || candidate?.id;
}

function getProfile(candidate) {
    if (candidate?.missions) {
        return candidate;
    }

    const candidateId = getCandidateId(candidate);
    const profile = getCandidateProfile(candidateId);

    if (!profile) {
        throw new ValidationError(`Candidate not found for id "${candidateId}".`);
    }

    return profile;
}

function startInterview(sessionId, candidate) {
    if (!candidate || !getCandidateId(candidate)) {
        throw new ValidationError("A candidate with an id is required to start an interview.");
    }

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

    if (!session) {
        throw new ValidationError("Interview session not found. Please start a new interview.");
    }

    addCandidateMessage(session, message ?? "");

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

module.exports = { handleInterviewMessage, ValidationError };
