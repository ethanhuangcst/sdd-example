# F3 — AI Auto-Continuation: Tech Design

## Overview

F3 extends the existing `POST /api/sentences` handler to call Qwen after saving the human sentence, then save the AI continuation. No new UI components needed — `SentenceList` already renders AI-labeled sentences.

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/qwen.ts` | Add `generateContinuation(context: string[])` function |
| `src/app/api/sentences/route.ts` | After saving human sentence, call `generateContinuation` and save result |

---

## New Function: `generateContinuation`

```typescript
// src/lib/qwen.ts
export async function generateContinuation(context: string[]): Promise<string | null>
```

- Takes the last N sentences as context (plain strings)
- Builds a prompt: "Here is a story so far: [sentences]. Continue with exactly one sentence."
- Returns the AI response trimmed, or `null` on failure
- Shares the same fetch/error-handling pattern as `generateOpener`

Context window: use last **10** sentences to keep the prompt short.

---

## Updated POST Flow

```
POST /api/sentences { author, content }
  │
  ├─ validate → 400 if invalid
  ├─ save human sentence → DB
  ├─ fetch last 10 sentences from DB (for context)
  ├─ call generateContinuation(context)
  │   ├─ success → save AI sentence → DB
  │   └─ null (failure) → skip silently
  └─ return 201 with human sentence
```

The response still returns only the human sentence (201). The AI sentence is saved in the background before the response is sent — no streaming, no async queue.

---

## Prompt Design

```
Continue this story with exactly one sentence. Output only that sentence, nothing else.

Story so far:
- Once upon a time in a quiet village
- A dragon appeared at dawn
- The villagers ran in fear
```

`max_tokens: 80` — enough for one sentence, prevents runaway output.
