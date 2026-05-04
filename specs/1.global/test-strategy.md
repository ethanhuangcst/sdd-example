# Testing Strategy: AI Story Chain

## Tools

| Layer | Tool | Version |
|-------|------|---------|
| Unit & Integration | Vitest + React Testing Library + jest-dom | 3.2.0 / 16.3.0 |
| E2E | Playwright (Chromium) | 1.52.0 |
| User interaction simulation | @testing-library/user-event | 14.6.1 |

Commands:
- `npm test` — run unit + integration tests (Vitest)
- `npm run test:e2e` — run E2E tests (Playwright)

---

## Test Pyramid

```
        [ E2E ]          ~10%   Playwright — full user flow in browser
      [ Integration ]    ~20%   Vitest — API routes + DB
    [   Unit Tests   ]   ~70%   Vitest — pure logic functions
```

---

## Layer Breakdown

### Unit Tests (`tests/unit/`)

Tool: **Vitest**

What to test:
- `qwen.ts` — prompt builder, response parser (extract one sentence from AI output)
- `types.ts` — type guards if any

Rules:
- No real DB, no real API calls
- Mock only: `Date.now()`, external fetch calls
- Each test covers one behavior

### Integration Tests (`tests/integration/`)

Tool: **Vitest + real DB + real Qwen API**

What to test:
- `GET /api/sentences` — returns sentences in ascending order
- `POST /api/sentences` — saves user sentence, calls Qwen, saves AI sentence, returns both
- `POST /api/reset` — deletes all sentences

Rules:
- Use the real `DATABASE_URL` from `.env`
- Use the real `QWEN_API_KEY` — no mocking AI
- Clean up test data before and after each test

### E2E Tests (`tests/e2e/`)

Tool: **Playwright (Chromium, headless)**

What to test:
- `story.spec.ts` — full flow: open page → see empty state → submit sentence → see user + AI sentence appear → reset → empty again

Rules:
- Run against `npm run dev` (localhost:3000)
- Use `page.waitForLoadState('networkidle')` before assertions
- No mocking — real DB, real AI

---

## Definition of Done (SMART)

A feature is **done** when all of the following are true:

| # | Criterion | Specific | Measurable |
|---|-----------|----------|------------|
| 1 | All unit tests pass | Tests in `tests/unit/` | `npm test` exits 0 |
| 2 | All integration tests pass | Tests in `tests/integration/` | `npm test` exits 0 |
| 3 | All E2E tests pass | Tests in `tests/e2e/` | `npm run test:e2e` exits 0 |
| 4 | No TypeScript errors | Entire `src/` | `npx tsc --noEmit` exits 0 |
| 5 | No ESLint errors | Entire `src/` | `npx eslint src/` exits 0 |
| 6 | All acceptance criteria in `req.md` are covered by at least one test | Feature's `req.md` | Each Gherkin scenario maps to a test case |
| 7 | No hardcoded UI text — all strings use i18n keys | `src/` | No string literals in JSX outside of i18n calls |

**Achievable**: All criteria are verifiable with existing tooling in this repo.
**Relevant**: Each criterion directly validates a functional or quality requirement.
**Time-bound**: Must be satisfied before the feature branch is merged.
