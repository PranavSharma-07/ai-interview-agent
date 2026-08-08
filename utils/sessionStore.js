const sessions = new Map();

function hasSession(sessionId) {
    return sessions.has(sessionId);
}

function createSession(sessionId, candidate, profile, topics) {
    const session = {
        candidate,
        profile,
        topics,
        messages: [],
        questionsAsked: 0
    };

    sessions.set(sessionId, session);
    return session;
}

function getSession(sessionId) {
    return sessions.get(sessionId);
}

function addCandidateMessage(session, content) {
    session.messages.push({ role: "candidate", content });
}

function addInterviewerMessage(session, content) {
    session.messages.push({ role: "interviewer", content });
}

function recordQuestion(session) {
    session.questionsAsked += 1;
    return session.questionsAsked;
}

module.exports = {
    hasSession,
    createSession,
    getSession,
    addCandidateMessage,
    addInterviewerMessage,
    recordQuestion
};
