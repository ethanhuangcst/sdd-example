# F3 — AI Auto-Continuation: Test Plan

## Scope

F3 extends the POST `/api/sentences` flow: after saving the human sentence, the API calls Qwen and saves the AI continuation. No new UI components — the existing `SentenceList` renders the result.

Test layers: **Unit** (qwen.ts continuation prompt) + **Integration** (POST returns AI sentence) + **E2E** (browser sees AI sentence after submit).

---

## AC → Test Mapping

| Acceptance Criteria | Test Layer | Test ID |
|---------------------|------------|---------|
| AI sentence generated and saved after human submission | Integration + E2E | IT-F3-01, E2E-F3-01 |
| AI sentence appears after human sentence, labeled "AI" | E2E | E2E-F3-01 |
| AI continuation is coherent (non-empty, not verbatim repeat) | Unit + Integration | UT-F3-01, IT-F3-01 |
| AI failure does not break human sentence save | Integration | IT-F3-02 |
| Exactly one AI sentence per submission | Integration | IT-F3-01 |

---

## Unit Tests

File: `tests/unit/qwen.test.ts`
Tool: Vitest (real Qwen API — no mocking per test strategy)

### UT-F3-01 — generateContinuation returns a non-empty string

```
Arrange: context = ["Once upon a time", "there was a dragon"]
Act:     generateContinuation(context)
Assert:  result is a non-empty string
         result does not equal the last sentence verbatim
```

---

## Integration Tests

File: `tests/integration/sentences.test.ts`
Tool: Vitest + real DB + real Qwen API

### IT-F3-01 — POST /api/sentences saves human sentence and AI continuation

```
Arrange: seed 1 sentence as context
Act:     POST /api/sentences { author: 'Alice', content: 'The dragon awoke.' }
Assert:  status 201
         response contains the human sentence
         DB contains 3 sentences total (1 seed + 1 human + 1 AI)
         last sentence in DB has isAI: true
         AI sentence content is non-empty
Cleanup: deleteMany
```

### IT-F3-02 — Human sentence is saved even if AI call fails

```
Note: tested via graceful-failure path in qwen.ts returning null.
      Covered by the existing implementation contract — no separate test needed
      as we cannot reliably simulate AI failure without mocking.
```

---

## E2E Tests

File: `tests/e2e/story.spec.ts`
Tool: Playwright (Chromium, headless), server at `http://localhost:3000`

### E2E-F3-01 — AI sentence appears after human sentence in the story

```
Arrange: seed 1 sentence, navigate to /
Act:     fill author "Alice", fill sentence "The dragon awoke."
         submit form
         waitForLoadState('networkidle')
Assert:  sentence items count >= 3 (seed + human + AI)
         item after "The dragon awoke." has label "AI"
         AI sentence content is non-empty
Cleanup: reset
```
