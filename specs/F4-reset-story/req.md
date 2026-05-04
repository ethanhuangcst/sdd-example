# F4 — Reset Story

## User Story

As a visitor,
I want to reset the story back to empty with a confirmation step,
So that I can start a brand new story without accidentally losing the current one.

---

## Acceptance Criteria

```gherkin
Scenario: Reset button is visible on the page
  Given the story has at least one sentence
  When the visitor views the page
  Then a "Start Over" button is visible

Scenario: Clicking reset shows a confirmation prompt
  Given the story has at least one sentence
  When the visitor clicks "Start Over"
  Then a confirmation prompt appears asking if they are sure

Scenario: Confirming reset clears all sentences
  Given the confirmation prompt is shown
  When the visitor confirms the reset
  Then all sentences are deleted
  And the page shows the AI-generated opener (or empty state if AI fails)

Scenario: Cancelling reset keeps the story intact
  Given the confirmation prompt is shown
  When the visitor cancels
  Then no sentences are deleted
  And the story remains unchanged
```