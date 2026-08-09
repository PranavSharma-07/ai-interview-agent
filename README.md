# AI Interview Agent

An AI-powered technical interview system that conducts personalized interviews, asks contextual follow-up questions, and generates structured performance feedback.

## Overview

AI Interview Agent is a hackathon project designed to make technical interviews more adaptive.

Instead of asking every candidate the same fixed set of questions, the system uses an LLM to generate follow-up questions based on the candidate's previous answers and curriculum context.

The interviewer can explore:

- Technical understanding
- Trade-offs
- Implementation decisions
- Assumptions
- Testing strategies
- Failure modes
- Performance
- Reliability
- Observability

After the interview, the system generates structured feedback and presents it through an Interview Analytics Dashboard.

## Features

### Personalized Interview

The candidate starts the interview using a Candidate ID. The system maintains the interview context throughout the session.

### Dynamic AI Questions

Questions are generated using an LLM based on the candidate's curriculum and current interview context.

### Contextual Follow-up Questions

The interviewer uses the candidate's previous answer to determine what should be asked next.

Follow-up questions can explore:

- Trade-offs
- Implementation
- Testing
- Assumptions
- Failure modes
- Performance
- Reliability
- Observability

### Structured Interview Flow

The prototype conducts an 8-question technical interview while maintaining the session context.

### AI-Generated Feedback

After completing the interview, the system generates:

- Overall performance score
- Skill evaluation
- Summary
- Strengths
- Areas to improve
- Recommended next steps

### Interview Analytics Dashboard

A dedicated dashboard displays the generated feedback in a structured and readable format.

## Tech Stack

### Backend

- Node.js
- Express.js
- JavaScript

### AI

- Groq API
- OpenAI-compatible API
- LLM-based question generation
- Contextual follow-up generation
- LLM-based feedback generation

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### Tools

- Git
- GitHub
- VS Code
- Hoppscotch

## Architecture

```text
Candidate
    │
    ▼
Candidate ID
    │
    ▼
Interview Initialization
    │
    ▼
Curriculum / Interview Context
    │
    ▼
AI-Generated Question
    │
    ▼
Candidate Answer
    │
    ▼
LLM analyzes answer + context
    │
    ▼
Contextual Follow-up Question
    │
    ▼
       ... Interview Loop ...
    │
    ▼
Final Feedback Generation
    │
    ▼
Interview Analytics Dashboard