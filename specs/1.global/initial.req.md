# Initial Requirements: AI Story Chain

## Background

A lightweight web app where multiple users collaboratively write a story. Each person contributes one sentence, and the AI automatically continues with the next — the story keeps growing.

---

## Core Features

### 1. View the Current Story

- Open the page and see all existing sentences in chronological order
- Each sentence shows: content, author (username), timestamp, source (Human / AI)

### 2. Add a Sentence

- Form: enter a username + one sentence to continue the story
- On submit:
  1. The user's sentence is saved to the database
  2. Qwen AI is called automatically to continue the story based on context
  3. The AI's sentence is also saved to the database
  4. The page refreshes to show the updated story

### 3. Reset the Story

- A "Start Over" button clears all sentences so the story can begin again

---

## Acceptance Criteria

- [ ] Existing sentences are visible when the page loads (from the database)
- [ ] After submitting, both the user's sentence and the AI's continuation appear in the list
- [ ] The AI's continuation is coherent with the story context
- [ ] After reset, the story is empty

---

## Out of Scope

- No login / account system
- No multiple parallel stories
- No editing or deleting individual sentences
