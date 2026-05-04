# F3 — AI Auto-Continuation

## User Story

As a visitor,
I want the AI to automatically add a follow-up sentence after I submit mine,
So that the story keeps flowing without waiting for another human contributor.

---

## Acceptance Criteria

```gherkin
Scenario: AI generates a continuation after a human sentence is submitted
  Given the story has at least one sentence
  When a visitor submits a new sentence
  Then the AI automatically generates one follow-up sentence
  And that sentence is saved to the story
  And it appears in the story list immediately after the human sentence
  And it is labeled as "AI"

Scenario: AI continuation is contextually coherent
  Given the story contains several sentences establishing a narrative
  When a visitor submits a new sentence
  Then the AI continuation relates to the existing story context
  And it does not repeat the human sentence verbatim

Scenario: AI continuation fails gracefully
  Given the AI service is unavailable
  When a visitor submits a sentence
  Then the human sentence is still saved and visible
  And no AI sentence is added
  And the visitor sees no error caused by the AI failure

Scenario: Only one AI sentence is generated per human submission
  Given a visitor submits one sentence
  When the submission completes
  Then exactly one AI sentence is added to the story
```