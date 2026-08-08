const express = require("express");
const { handleInterviewMessage } = require("../services/interviewService");

const router = express.Router();

router.post("/", async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({
            error: "sessionId is required"
        });
    }

    try {
        const response = await handleInterviewMessage(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(500).json({
            error: "Unable to process interview message"
        });
    }
});

module.exports = router;
