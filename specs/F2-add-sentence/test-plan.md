# F2 — Add a Sentence: Test Plan

## Scope

F2 involves a client-side form with validation and a POST API endpoint.
Test layers: **Unit** (validation logic) + **Integration** (API) + **E2E** (browser form interaction).

---

## AC → Test Mapping

| Acceptance Criteria | Test Layer | Test ID |
|---------------------|------------|---------|
| Sentence saved and appears in list after submit | Integration + E2E | IT-F2-01, E2E-F2-01 |
| Form fields cleared after submission | E2E | E2E-F2-01 |
| Empty author name rejected | Unit + E2E | UT-F2-01, E2E-F2-02 |
| Empty sentence rejected | Unit + E2E | UT-F2-02, E2E-F2-03 |
| Sentence attributed to correct author, labeled Human | Integration + E2E | IT-F2-01, E2E-F2-04 |
| Submit button disabled during submission | E2E | E2E-F2-05 |

---

## Unit Tests

File: `tests/unit/validation.test.ts`
Tool: Vitest

### UT-F2-01 — Reject empty author name

```
Arrange: input = { author: '', content: 'Some sentence' }
Act:     validate(input)
Assert:  returns error for author field
```

### UT-F2-02 — Reject empty sentence

```
Arrange: input = { author: 'Alice', content: '' }
Act:     validate(input)
Assert:  returns error for content field
```

---

## Integration Tests

File: `tests/integration/sentences.test.ts`
Tool: Vitest + real PostgreSQL

### IT-F2-01 — POST /api/sentences saves sentence and returns it

```
Arrange: empty table
Act:     POST /api/sentences { author: 'Alice', content: 'Hello world' }
Assert:  status 201
         response contains { author: 'Alice', content: 'Hello world', isAI: false }
         sentence exists in DB
Cleanup: deleteMany
```

### IT-F2-02 — POST /api/sentences rejects missing author

```
Act:     POST /api/sentences { author: '', content: 'Hello' }
Assert:  status 400
```

### IT-F2-03 — POST /api/sentences rejects missing content

```
Act:     POST /api/sentences { author: 'Alice', content: '' }
Assert:  status 400
```

---

## E2E Tests

File: `tests/e2e/story.spec.ts`
Tool: Playwright (Chromium, headless), server at `http://localhost:3000`

### E2E-F2-01 — Successful submission saves sentence and clears form

```
Arrange: reset story
Act:     navigate to /
         fill author "Alice", fill sentence "The dragon awoke."
         submit form
         waitForLoadState('networkidle')
Assert:  sentence "The dragon awoke." visible in story list
         author field is empty
         sentence field is empty
Cleanup: reset
```

### E2E-F2-02 — Empty author shows validation error

```
Act:     navigate to /
         leave author empty, fill sentence "Hello"
         submit form
Assert:  form not submitted (no new sentence in list)
         error message for author field is visible
```

### E2E-F2-03 — Empty sentence shows validation error

```
Act:     navigate to /
         fill author "Alice", leave sentence empty
         submit form
Assert:  form not submitted
         error message for sentence field is visible
```

### E2E-F2-04 — Submitted sentence shows correct author and Human label

```
Arrange: reset story
Act:     navigate to /
         fill author "Alice", fill sentence "Once more."
         submit form
         waitForLoadState('networkidle')
Assert:  sentence item contains "Alice"
         label shows "Human"
Cleanup: reset
```

### E2E-F2-05 — Submit button is disabled during submission

```
Act:     navigate to /
         fill author and sentence
         click submit
Assert:  submit button is disabled immediately after click
         button re-enables after submission completes
```
