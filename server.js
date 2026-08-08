const express = require("express");
const app = express();
require("dotenv").config();
const interviewRoute = require("./routes/interview.js")

app.use(express.json());
app.use("/api/interview", interviewRoute);

app.get("/", (req,res) => {
    res.json({
        message: "AI Interview Agent is running."
    })
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is listining on port ${PORT}`);
})