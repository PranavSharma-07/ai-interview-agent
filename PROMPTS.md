# AI Usage Log — AI Interview Agent

## Project

**AI Interview Agent**

## Purpose

Build a personalized multi-turn technical interview agent based on a
candidate's learning progress and the 31-day AI cohort curriculum.

The main idea was to make the interview adaptive instead of using a fixed
list of questions. The candidate's profile, completed missions, current
curriculum topic, and previous answers should influence the next question.

---

## 1. Initial Project Prompt

The initial prompt focused on defining the problem before implementation.

I asked the AI to help me design an AI interview agent that could:

- Use a candidate's curriculum progress as context.
- Personalize the interview according to the candidate's background.
- Generate technical questions dynamically.
- Ask follow-up questions based on previous answers.
- Conduct a multi-turn interview.
- Generate structured feedback at the end.

The first priority was to understand the interview flow and decide what
context the AI would need before writing the implementation.

---

## 2. Project Structure and Backend

I used AI assistance to discuss the initial Node.js and Express structure,
including:

- Express server setup
- Interview API route
- LLM service
- Prompt-building logic
- Session handling
- Frontend/API communication

The goal was to keep the interview logic separate from the prompt
construction and LLM integration so that the system would remain easier to
understand and modify.

I reviewed the generated structure and tested the API flow manually while
building the project.

---

## 3. LLM Integration

One of the main implementation steps was connecting the application to an
LLM.

I used AI assistance to implement and debug the OpenAI-compatible API
integration and configure the application through environment variables.

The application uses:

```text
OPENAI_API_KEY
OPENAI_BASE_URL
OPENAI_MODEL
```

## 4. Interview Prompt Design

The main interview prompt was designed to make the model behave as a
technical interviewer rather than a general chatbot.

The prompt provides the model with:

* Candidate profile
* Candidate role
* Years of experience
* Completed missions
* Current curriculum topic
* Curriculum objectives
* Conversation history
* Previous candidate answers

The model is instructed to return one concise technical question.

Questions should focus on areas such as:

* Design
* Implementation
* Trade-offs
* Assumptions
* Testing
* Metrics
* Validation
* Failure modes
* Performance
* Reliability

The curriculum is used as background context rather than simply being
copied into the generated question.

---

## 5. Candidate Personalization

I added a separate personalization requirement for the first question.

The first question should consider the candidate's:

* Role
* Experience
* Completed missions
* Current curriculum topic

This was important because the same curriculum topic should not result in
exactly the same interview experience for every candidate.

I tested the generated questions with different candidate contexts and made
small prompt adjustments where the personalization was not strong enough.

---

## 6. Contextual Follow-up Questions

A major requirement of the project was that the interview should not behave
like a fixed questionnaire.

For every subsequent question, the model receives the previous answer and
the conversation history.

The prompt asks the model to identify a specific idea, claim, decision, or
assumption from the candidate's answer and use it to continue the interview.

For example:

```text
Candidate:
"We could use approximate nearest-neighbor search because it
would reduce retrieval latency."

Follow-up:
"What trade-off does approximate nearest-neighbor search introduce,
and how would you validate that decision?"
```

The purpose was to make the interview feel like an actual technical
conversation.

I tested the complete question-and-answer flow manually and checked whether
the generated follow-up actually connected to the previous answer.

---

## 7. Handling Weak Answers

I also considered what should happen when a candidate gives a very short or
non-substantive answer.

The interviewer should not invent technical claims that the candidate never
made.

Instead, the model should ask a foundational or clarification question about
the current topic.

This prevents the interview from producing unrealistic follow-ups when
there is not enough information in the candidate's answer.

---

## 8. Final Feedback Prompt

After the interview, the complete conversation is provided to the feedback
prompt.

The feedback generation considers:

* Candidate context
* Covered curriculum topics
* Complete interview conversation

The output is structured so that it can be displayed directly in the
analytics dashboard.

The feedback includes:

* Overall performance
* Skill evaluation
* Summary
* Strengths
* Areas to improve
* Recommended next steps

The structured response was important because the frontend needs predictable
data instead of an unstructured block of text.

---

## 9. Frontend and Interview Experience

I used AI assistance while building and refining the frontend for:

* Candidate ID entry
* Interview question screen
* Answer submission
* Progress tracking
* Loading/error states
* Interview completion
* Analytics dashboard

I reviewed the generated UI and made changes based on how the actual
interview felt during testing.

The goal was to keep the interface simple and focused on the interview rather
than adding unnecessary UI elements.

---

## 10. Analytics Dashboard

I added a separate Interview Analytics Dashboard to present the final AI
feedback.

The dashboard displays:

* Overall score
* Skill evaluation
* Summary
* Strengths
* Areas to improve
* Recommended next steps

I tested the complete flow from the final interview answer to the dashboard
to verify that the generated feedback was correctly displayed.

---

## 11. Testing and Debugging

AI assistance was also used during debugging and testing.

Some of the development work included:

* Testing API responses
* Debugging LLM configuration
* Checking interview session behavior
* Testing contextual questions
* Testing the final feedback response
* Fixing frontend issues
* Checking the complete end-to-end interview flow

I did not treat generated code as final without testing it. Changes were
tested locally and adjusted when the implementation did not behave as
expected.

---

## 12. Important Development Decisions

Throughout the build, I used AI mainly as a development and reasoning aid.

The important decisions were made around:

* What information should be passed to the LLM.
* How candidate personalization should work.
* How follow-up questions should use previous answers.
* How weak answers should be handled.
* What information should appear in final feedback.
* How the feedback should be structured for the dashboard.
* Which UI features were actually necessary for the prototype.

The implementation was iterated through testing rather than accepting the
first generated solution.

---

## AI-Assisted Development Summary

AI assistance was used for:

* Architecture discussion
* Backend implementation
* LLM integration
* Prompt engineering
* Frontend development
* UI refinement
* Debugging
* Testing
* Documentation

The most important part of the AI usage was the iterative prompt design for
the interviewer itself. The prompts were refined around personalization,
contextual follow-ups, weak-answer handling, and structured feedback.

The final project was manually tested throughout development to verify that
the generated implementation matched the intended interview experience.
