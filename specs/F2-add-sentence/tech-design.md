# F2 — Add a Sentence: Tech Design

## Overview

F2 adds a client-side form to the home page. The form collects author name and sentence content, validates both fields client-side, then POSTs to `/api/sentences`. The page re-fetches and re-renders after a successful submission.

---

## Files Involved

| File | Role |
|------|------|
| `src/components/AddSentenceForm.tsx` | Client component — form UI, validation, submission |
| `src/lib/validation.ts` | Pure validation function (unit-testable) |
| `src/app/api/sentences/route.ts` | Add `POST` handler — validate, save to DB |
| `src/app/page.tsx` | Include `<AddSentenceForm>` below the sentence list |

---

## Validation Logic

Extracted into `src/lib/validation.ts` so it can be unit-tested independently:

```typescript
export type FormInput = { author: string; content: string }
export type FormErrors = Partial<Record<keyof FormInput, string>>

export function validateSentenceInput(input: FormInput): FormErrors {
  const errors: FormErrors = {}
  if (!input.author.trim()) errors.author = 'Author name is required'
  if (!input.content.trim()) errors.content = 'Sentence is required'
  return errors
}
```

---

## API: POST /api/sentences

Request body:
```json
{ "author": "Alice", "content": "The dragon awoke." }
```

Behavior:
1. Validate — return `400` if author or content is empty
2. Save user sentence to DB (`isAI: false`)
3. Return `201` with the saved sentence

Note: AI continuation (F3) will be added in the next feature. F2 only saves the human sentence.

Response (201):
```json
{ "id": 5, "author": "Alice", "content": "The dragon awoke.", "isAI": false, "createdAt": "..." }
```

---

## Component: AddSentenceForm

`'use client'` — needs `useState` for form state and submission.

State:
- `author: string`
- `content: string`
- `errors: FormErrors`
- `submitting: boolean`

On submit:
1. Run `validateSentenceInput` — set errors and abort if invalid
2. Set `submitting = true`, disable submit button
3. `POST /api/sentences`
4. On success: clear fields, errors; trigger page refresh via `router.refresh()`
5. On failure: show generic error; re-enable button
6. Set `submitting = false`

Page refresh strategy: `router.refresh()` from `next/navigation` — re-runs the Server Component data fetch without a full navigation.

---

## UI Layout

```
┌─────────────────────────────────────────┐
│  Your name                              │
│  ┌─────────────────────────────────┐    │
│  │ Alice                           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Your sentence                          │
│  ┌─────────────────────────────────┐    │
│  │ The dragon awoke.               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [  Add to story  ]                     │
└─────────────────────────────────────────┘
```

Styling (inline, matching UI guideline):
- Inputs: cream background `#faf7f2`, border `#e0d5c5`, serif font, `padding: 8px 12px`
- Error text: warm red `#b94040`, `font-size: 12px`, below the field
- Submit button: amber fill `#c17f3e`, ink-dark text `#2c2416`, `rounded-md`, disabled state: `opacity: 0.5`
