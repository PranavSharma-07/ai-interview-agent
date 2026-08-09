const startForm = document.querySelector("#start-form");
const answerForm = document.querySelector("#answer-form");
const candidateIdInput = document.querySelector("#candidate-id");
const answerInput = document.querySelector("#answer");
const status = document.querySelector("#status");
const interview = document.querySelector("#interview");
const feedback = document.querySelector("#feedback");
const question = document.querySelector("#question");
const progress = document.querySelector("#progress");
const sessionLabel = document.querySelector("#session-label");
const submitAnswerButton = document.querySelector("#submit-answer");

let sessionId;
let questionCount = 0;

function setLoading(isLoading) {
    startForm.querySelector("button").disabled = isLoading;
    submitAnswerButton.disabled = isLoading;
}

function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
}

async function callInterviewApi(payload) {
    const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "The interview request failed.");
    }

    return data;
}

function renderList(id, items) {
    const list = document.querySelector(id);
    list.replaceChildren(...items.map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        return listItem;
    }));
}

function showFeedback(data) {
    interview.classList.add("hidden");
    feedback.classList.remove("hidden");
    document.querySelector("#feedback-summary").textContent = data.feedback.summary;
    renderList("#strengths", data.feedback.strengths);
    renderList("#gaps", data.feedback.gaps);
    renderList("#next", data.feedback.next);
}

startForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const candidateId = candidateIdInput.value.trim();

    if (!candidateId) {
        setStatus("Candidate ID is required.", true);
        return;
    }

    sessionId = crypto.randomUUID();
    questionCount = 0;
    feedback.classList.add("hidden");
    setLoading(true);
    setStatus("Starting interview...");

    try {
        const data = await callInterviewApi({ sessionId, candidate: { id: candidateId } });
        interview.classList.remove("hidden");
        question.textContent = data.reply;
        progress.textContent = "Ready for your first response";
        sessionLabel.textContent = `Session: ${sessionId}`;
        answerInput.value = "";
        answerInput.focus();
        setStatus("Interview started.");
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        setLoading(false);
    }
});

answerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = answerInput.value.trim();

    if (!message || !sessionId) {
        setStatus("Start an interview and enter an answer first.", true);
        return;
    }

    setLoading(true);
    setStatus("Getting the next question...");

    try {
        const data = await callInterviewApi({ sessionId, message });

        if (data.done) {
            showFeedback(data);
            setStatus("Interview completed.");
            return;
        }

        questionCount += 1;
        question.textContent = data.reply;
        progress.textContent = `Question ${questionCount} of 8`;
        answerInput.value = "";
        answerInput.focus();
        setStatus("Question ready.");
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        setLoading(false);
    }
});
