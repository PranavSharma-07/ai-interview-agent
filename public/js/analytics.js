const feedbackSummary = document.querySelector("#feedback-summary");
const scoreValue = document.querySelector("#score-value");
const skillList = document.querySelector("#skill-list");


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


function renderSkills(skills) {
    skillList.replaceChildren();

    if (!Array.isArray(skills) || !skills.length) {
        const empty = document.createElement("p");
        empty.className = "card-copy";
        empty.textContent = "No skill evaluation is available for this session yet.";
        skillList.appendChild(empty);
        return;
    }

    skills.forEach((skill) => {
        const row = document.createElement("div");
        row.className = "skill-row";

        const name = document.createElement("span");
        name.textContent = skill.name;

        const ratingLabel = document.createElement("span");
        ratingLabel.textContent = `${skill.rating}%`;

        const bar = document.createElement("div");
        bar.className = "skill-bar";
        const fill = document.createElement("span");
        fill.style.width = `${Math.max(0, Math.min(100, skill.rating))}%`;
        bar.appendChild(fill);

        row.append(name, ratingLabel, bar);
        skillList.appendChild(row);
    });
}

function renderFeedback(feedback) {
    if (!feedback || typeof feedback !== "object") return;

    scoreValue.textContent = typeof feedback.score === "number" ? `${feedback.score}/100` : "--";
    feedbackSummary.textContent = feedback.summary || "No summary was provided.";
    renderSkills(feedback.skills);
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
