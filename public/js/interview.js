const STORAGE_KEY = "aiInterviewSession";
const QUESTION_LIMIT = 8;

const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const submitButton = document.querySelector("#submit-answer");
const status = document.querySelector("#status");
const questionText = document.querySelector("#question-text");
const questionMeta = document.querySelector("#question-meta");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");
const candidateName = document.querySelector("#candidate-name");
const interviewView = document.querySelector("#interview-view");
const completionView = document.querySelector("#completion-view");

let interview = readInterviewSession();
let questionCount = 0;

function readInterviewSession() {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
}

function saveInterviewSession() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(interview));
}

function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
}

function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    answerInput.disabled = isLoading;
    if (isLoading) setStatus("Thinking...");
}

function updateProgress() {
    const displayedQuestion = Math.min(questionCount + 1, QUESTION_LIMIT);
    progressLabel.textContent = `Question ${displayedQuestion} of ${QUESTION_LIMIT}`;
    questionMeta.innerHTML = `Question ${displayedQuestion} of ${QUESTION_LIMIT} <span aria-hidden="true">·</span> Interview`;
    progressBar.style.width = `${(questionCount / QUESTION_LIMIT) * 100}%`;
    progressTrack.setAttribute("aria-valuenow", questionCount);
}

function populateCandidateDetails() {
    candidateName.textContent = interview?.candidateId || "Candidate profile";
}

async function postInterview(payload) {
    const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Unable to process the interview request.");
    return data;
}

async function beginInterview() {
    if (!interview?.candidateId) {
        questionText.textContent = "Start from the landing page to begin your personalized interview.";
        setStatus("Candidate information is unavailable.", true);
        answerInput.disabled = true;
        submitButton.disabled = true;
        return;
    }

    try {
        setLoading(true);

        if (!interview.sessionId) {
            interview.sessionId = crypto.randomUUID();
            await postInterview({ sessionId: interview.sessionId, candidate: { id: interview.candidateId } });
            saveInterviewSession();
        }

        const data = await postInterview({ sessionId: interview.sessionId, message: "" });
        renderQuestion(data.reply);
    } catch (error) {
        setStatus(error.message, true);
        questionText.textContent = "We couldn't load your interview question. Please try again.";
    } finally {
        setLoading(false);
    }
}

function renderQuestion(reply) {
    questionText.textContent = reply;
    updateProgress();
    setStatus("");
    answerInput.focus();
}

function renderList(id, items) {
    document.querySelector(id).replaceChildren(...items.map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        return listItem;
    }));
}

function renderFeedback(feedback) {
    sessionStorage.setItem("aiInterviewFeedback", JSON.stringify(feedback));
    sessionStorage.setItem(
        "aiInterviewResult",
        JSON.stringify({ feedback })
    );

    window.location.href = "./analytics.html";
}

answerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = answerInput.value.trim();

    if (!message) {
        setStatus("Please enter an answer before submitting.", true);
        answerInput.focus();
        return;
    }

    try {
        setLoading(true);
        const data = await postInterview({ sessionId: interview.sessionId, message });

        if (data.done) {
            renderFeedback(data.feedback);
            return;
        }

        questionCount += 1;
        answerInput.value = "";
        renderQuestion(data.reply);
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        setLoading(false);
    }
});

populateCandidateDetails();
updateProgress();
beginInterview();
