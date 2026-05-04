# Architecture: AI Story Chain

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Frontend | Next.js (App Router, SSR) | 15.3.2 |
| Language | TypeScript | 5.8.3 |
| Styling | Tailwind CSS | 4.2.2 |
| ORM | Prisma | 6.8.2 |
| Database | PostgreSQL (remote public server) | — |
| AI | Qwen (OpenAI-compatible API) | qwen-plus |
| Unit/Integration Tests | Vitest + React Testing Library | 3.2.0 |
| E2E Tests | Playwright | 1.52.0 |

---

## Directory Structure

```
sdd-sample/
├── prisma/
│   └── schema.prisma          # Data model
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (story list + input form)
│   │   └── api/
│   │       ├── sentences/
│   │       │   └── route.ts   # GET list sentences, POST add sentence
│   │       └── reset/
│   │           └── route.ts   # POST reset story
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── qwen.ts            # Qwen AI call wrapper
│   └── types.ts               # Shared type definitions
├── tests/
│   ├── unit/
│   │   └── qwen.test.ts       # Qwen response parsing unit tests
│   ├── integration/
│   │   └── sentences.test.ts  # API route integration tests
│   └── e2e/
│       └── story.spec.ts      # Full story chain E2E test
├── .env                       # Local env vars (not committed)
├── .env.example               # Env var template
└── package.json
```

---

## Data Model

```prisma
model Sentence {
  id        Int      @id @default(autoincrement())
  content   String
  author    String   // username; AI sentences use "AI"
  isAI      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## API Design

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/sentences` | Return all sentences (ascending by time) |
| POST | `/api/sentences` | Save user sentence, trigger AI continuation, return both |
| POST | `/api/reset` | Delete all sentences |

POST `/api/sentences` request body:
```json
{ "author": "Alice", "content": "Once upon a time in a quiet village" }
```

---

## AI Integration

Uses Qwen's OpenAI-compatible API (native `fetch`):

- Base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- Model: `qwen-plus`
- Prompt strategy: concatenate existing sentences as context, instruct AI to continue with **exactly one sentence**

---

## Data Flow

```
User submits sentence
    │
    ▼
POST /api/sentences
    │
    ├─→ Save to database (user sentence)
    │
    ├─→ Fetch recent N sentences as context
    │
    ├─→ Call Qwen API → get AI continuation
    │
    └─→ Save to database (AI sentence)
            │
            ▼
        Return both new sentences to frontend
```

---

## Environment Variables

```
DATABASE_URL=postgresql://...
QWEN_API_KEY=sk-...
QWEN_MODEL=qwen-plus
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

---

## Dev Requirements

- Node.js >= 20.x
- npm >= 10.x
- OS: macOS or Windows
