const express = require("express");
require("dotenv").config();

const interviewRoute = require("./routes/interview.js");
const app = express();

app.use(express.json());
app.use("/demo", express.static("public"));
app.use("/api/interview", interviewRoute);

app.get("/", (req, res) => {
    res.sendFile(require("path").join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});