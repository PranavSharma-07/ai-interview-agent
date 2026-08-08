# AI Interview Prompts

The application keeps prompt construction in `utils/promptBuilder.js` so the
interview flow and API code stay small and easy to follow.

## Interview generation prompt

`buildInterviewPrompt` asks the model to act as a friendly technical
interviewer and return exactly one concise question. It uses the curriculum
objectives as background for a technically meaningful question about design,
implementation, trade-offs, metrics, or validation—not as wording to repeat.
It includes the candidate profile, completed missions, selected curriculum day,
and full conversation. This prompt is responsible for generating each of the
eight interview questions.

## Follow-up prompt behavior

The same `buildInterviewPrompt` includes the candidate's most recent answer
and tells the model to reference a specific claim from it when a follow-up is
appropriate. It should probe reasoning, trade-offs, implementation details, or
validation rather than merely say “building on your answer.” Full conversation
history is included so each question can refer back to earlier answers without
losing context.

## Feedback prompt

`buildFeedbackPrompt` supplies the candidate context, all covered topics, and
the full conversation. It requires valid JSON with `summary`, `strengths`,
`gaps`, and `next`; this prompt is responsible for the final structured
feedback.

## Credentials

`services/llmService.js` reads `OPENAI_API_KEY`, `OPENAI_MODEL`, and optional
`OPENAI_BASE_URL` from `.env`. No secrets are stored in source code. If no API
credential is configured, it uses a local deterministic fallback so the API
contract remains testable.
