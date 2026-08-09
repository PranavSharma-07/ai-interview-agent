const feedbackSummary = document.querySelector("#feedback-summary");


function readStoredJson(key) {
    try {
        return JSON.parse(sessionStorage.getItem(key));
    } catch {
        return null;
    }
}

function renderList(id, items) {
    const list = document.querySelector(id);
    list.replaceChildren(...(items || []).map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        return listItem;
    }));
}


function renderFeedback(feedback) {
    if (!feedback || typeof feedback !== "object") return;

    feedbackSummary.textContent = feedback.summary || "No summary was provided.";
    renderList("#strengths", feedback.strengths);
    renderList("#gaps", feedback.gaps);
    renderList("#next-steps", feedback.next);
   
}

document.querySelector("#back-button").addEventListener("click", () => {
window.location.href = "/";
});

const storedResult = readStoredJson("aiInterviewResult");
const storedFeedback = readStoredJson("aiInterviewFeedback") || storedResult?.feedback;
renderFeedback(storedFeedback);
