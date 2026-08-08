const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "..", "data");

function readDataFile(filename) {
    const filePath = path.join(dataDirectory, filename);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getCandidateProfile(candidateId) {
    if (!candidateId) {
        return undefined;
    }

    const { candidates } = readDataFile("candidates.json");
    return candidates.find(({ member }) => member.id === candidateId);
}

function getCurriculum() {
    return readDataFile("curriculum.json");
}

function getInterviewTopics(profile, questionLimit = 8) {
    const { days } = getCurriculum();
    const completedDays = new Set(
        (profile?.missions || [])
            .filter((mission) => mission.passed)
            .map((mission) => mission.day)
    );

    const completedTopics = days.filter((topic) => completedDays.has(topic.day));
    const remainingTopics = days.filter((topic) => !completedDays.has(topic.day));

    return [...completedTopics, ...remainingTopics].slice(0, questionLimit);
}

module.exports = { getCandidateProfile, getCurriculum, getInterviewTopics };
