const express = require("express");
const router = express.Router();

const sessions = new Map();

router.post("/", async (req, res) => {
    const { sessionId, candidate, message } = req.body;

    if (!sessionId) {
        return res.status(400).json({
            error: "sessionId is required"
        });
    }

    // Start interview
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
            candidate,
            messages: [],
            questionCount: 0
        });

        return res.json({
            reply: `Welcome ${candidate.name}. Let's begin your interview.`,
            done: false
        });
    }

    // Existing interview
    const session = sessions.get(sessionId);

    session.messages.push({
        role: "candidate",
        content: message
    });

    session.questionCount++;

    res.json({
        reply: `I understand. This is question ${session.questionCount}.`,
        done: false
    });
});

module.exports = router;