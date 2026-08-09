const startForm = document.querySelector("#start-form");
const candidateIdInput = document.querySelector("#candidate-id");
const startButton = document.querySelector("#start-button");
const status = document.querySelector("#status");

function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
}

startForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const candidateId = candidateIdInput.value.trim();

    if (!candidateId) {
        setStatus("Candidate ID is required.", true);
        candidateIdInput.focus();
        return;
    }

    const sessionId = crypto.randomUUID();
    startButton.disabled = true;
    setStatus("Starting your interview...");

    try {
        const response = await fetch("/api/interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, candidate: { id: candidateId } })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to start the interview.");
        }

        sessionStorage.setItem("aiInterviewSession", JSON.stringify({ sessionId, candidateId }));
        window.location.href = "interview.html";
    } catch (error) {
        setStatus(error.message, true);
    } finally {
        startButton.disabled = false;
    }
});
