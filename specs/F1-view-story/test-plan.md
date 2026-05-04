# F1 — View Story: Test Plan

## Scope

F1 is a pure SSR read-only page. No client-side logic, no form submission.
Test layers: **Integration** (API) + **E2E** (browser).
Unit tests: not applicable — no isolated logic functions in this feature.

---

## AC → Test Mapping

| Acceptance Criteria (from req.md) | Test Layer | Test ID |
|-----------------------------------|------------|---------|
| Sentences displayed oldest to newest | Integration + E2E | IT-F1-01, E2E-F1-01 |
| Each sentence shows author, time, Human/AI label | E2E | E2E-F1-02 |
| Empty state shown when no sentences exist | Integration + E2E | IT-F1-02, E2E-F1-03 |
| Human sentence labeled "Human" | E2E | E2E-F1-02 |
| AI sentence labeled "AI" | E2E | E2E-F1-02 |

---

## Integration Tests

File: `tests/integration/sentences.test.ts`
Tool: Vitest + real PostgreSQL (`DATABASE_URL`)

### IT-F1-01 — GET /api/sentences returns sentences in ascending order

```
Arrange: insert 3 sentences with known createdAt values
Act:     GET /api/sentences
Assert:  response is array of 3, ordered oldest → newest
         each item has: id, content, author, isAI, createdAt
Cleanup: delete inserted rows
```

### IT-F1-02 — GET /api/sentences returns empty array when no sentences exist

```
Arrange: ensure table is empty
Act:     GET /api/sentences
Assert:  response is []
```

---

## E2E Tests

File: `tests/e2e/story.spec.ts`
Tool: Playwright (Chromium, headless), server at `http://localhost:3000`

### E2E-F1-01 — Page displays existing sentences in order

```
Arrange: seed 2 sentences via API (human + AI)
Act:     navigate to /
         waitForLoadState('networkidle')
Assert:  sentence items count === 2
         first item text matches first seeded sentence
         second item text matches second seeded sentence
Cleanup: POST /api/reset
```

### E2E-F1-02 — Each sentence shows author, timestamp, and Human/AI label

```
Arrange: seed 1 human sentence (author "Alice") + 1 AI sentence
Act:     navigate to /
         waitForLoadState('networkidle')
Assert:  first item contains "Alice" and label "Human"
         second item contains "AI" and label "AI"
         both items show a visible timestamp
Cleanup: POST /api/reset
```

### E2E-F1-03 — Empty state shown when story has no sentences

```
Arrange: POST /api/reset to ensure empty state
Act:     navigate to /
         waitForLoadState('networkidle')
Assert:  empty state message is visible
         no sentence items rendered
```

---

## Out of Scope for F1

- Submitting a sentence (F2)
- AI continuation (F3)
- Reset button behavior (F4)
