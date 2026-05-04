# F4 — Reset Story: Test Plan

## Scope

F4 adds a client-side button with a confirm dialog and calls the existing `/api/reset` endpoint.
Test layers: **Integration** (POST /api/reset) + **E2E** (browser confirm flow).
Unit tests: not applicable — no isolated logic.

---

## AC → Test Mapping

| Acceptance Criteria | Test Layer | Test ID |
|---------------------|------------|---------|
| Reset button visible | E2E | E2E-F4-01 |
| Clicking shows confirmation | E2E | E2E-F4-02 |
| Confirming clears all sentences | Integration + E2E | IT-F4-01, E2E-F4-02 |
| Cancelling keeps story intact | E2E | E2E-F4-03 |

---

## Integration Tests

File: `tests/integration/sentences.test.ts`

### IT-F4-01 — POST /api/reset deletes all sentences

```
Arrange: insert 3 sentences
Act:     POST /api/reset
Assert:  status 200
         DB has 0 sentences
```

---

## E2E Tests

File: `tests/e2e/story.spec.ts`

### E2E-F4-01 — Reset button is visible

```
Arrange: seed 1 sentence
Act:     navigate to /
Assert:  "Start Over" button is visible
```

### E2E-F4-02 — Confirming reset clears the story

```
Arrange: seed 1 sentence, navigate to /
Act:     click "Start Over"
         accept the confirm dialog
         waitForLoadState('networkidle')
Assert:  sentence items count is 0 or 1 (AI opener may regenerate)
```

### E2E-F4-03 — Cancelling reset keeps the story

```
Arrange: seed 1 sentence, navigate to /
Act:     click "Start Over"
         dismiss the confirm dialog
Assert:  sentence items count is still 1
```
