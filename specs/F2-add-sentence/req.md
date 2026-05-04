# F2 — Add a Sentence

## User Story

As a visitor,
I want to submit my name and a sentence to continue the story,
So that I can contribute to the collaborative narrative.

---

## Acceptance Criteria

```gherkin
Scenario: Successfully submit a sentence
  Given the story page is open
  When the visitor enters their name and a sentence and submits the form
  Then the sentence is saved
  And the sentence appears in the story list
  And the form fields are cleared after submission

Scenario: Reject submission with empty author name
  Given the story page is open
  When the visitor leaves the author name empty and submits the form
  Then the form is not submitted
  And an error message indicates the author name is required

Scenario: Reject submission with empty sentence
  Given the story page is open
  When the visitor leaves the sentence empty and submits the form
  Then the form is not submitted
  And an error message indicates the sentence is required

Scenario: Submitted sentence is attributed to the correct author
  Given the story page is open
  When the visitor enters the name "Alice" and submits a sentence
  Then the sentence appears in the story list with "Alice" as the author
  And it is labeled as "Human"

Scenario: Submit button is disabled while submission is in progress
  Given the visitor has filled in both fields
  When the visitor submits the form
  Then the submit button becomes disabled until the submission completes
```