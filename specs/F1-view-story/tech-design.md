# F1 — View Story: Tech Design

## Overview

Server-side rendered page. On each request, Next.js fetches all sentences from PostgreSQL via Prisma and renders them directly — no client-side data fetching needed for this feature.

---

## Files Involved

| File | Role |
|------|------|
| `src/app/page.tsx` | Page component — fetches and renders sentence list |
| `src/components/SentenceList.tsx` | Renders the list of sentences |
| `src/components/SentenceItem.tsx` | Renders a single sentence row |
| `src/lib/prisma.ts` | Prisma client singleton |
| `prisma/schema.prisma` | `Sentence` model definition |

---

## Data Model

```prisma
model Sentence {
  id        Int      @id @default(autoincrement())
  content   String
  author    String
  isAI      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## Data Flow

```
Browser GET /
  → Next.js page.tsx (Server Component)
    → prisma.sentence.findMany({ orderBy: { createdAt: 'asc' } })
    → renders <SentenceList sentences={sentences} />
```

No API route is needed for F1. Data is fetched directly in the Server Component.

---

## Component Design

### `page.tsx` (Server Component)

```typescript
import { prisma } from '@/lib/prisma'
import SentenceList from '@/components/SentenceList'

export default async function Page() {
  const sentences = await prisma.sentence.findMany({
    orderBy: { createdAt: 'asc' },
  })
  return <SentenceList sentences={sentences} />
}
```

### `SentenceList.tsx`

Props: `sentences: Sentence[]`

- If empty → render empty state message
- Otherwise → render `<SentenceItem>` for each sentence

### `SentenceItem.tsx`

Props: `sentence: Sentence`

Displays per row:
- `content` — the sentence text
- `author` — name (or "AI")
- `isAI` — badge: `Human` | `AI`
- `createdAt` — formatted timestamp (e.g. `HH:mm`)

---

## Shared Type

```typescript
// src/types.ts
export type Sentence = {
  id: number
  content: string
  author: string
  isAI: boolean
  createdAt: Date
}
```

---

## Empty State

When `sentences.length === 0`, display:

> "No story yet. Be the first to add a sentence!"

---

## Rendering Strategy

- **SSR** (no `'use client'`) — page is rendered on the server on every request
- No loading spinner needed for F1 (data is ready before HTML is sent)
- No pagination — story is expected to stay short during the course demo
