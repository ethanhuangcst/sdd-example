# F1 — 查看故事：技术设计

## 概述

服务端渲染页面。每次请求时，Next.js 通过 Prisma 从 PostgreSQL 获取所有句子并直接渲染——此功能无需客户端数据获取。

---

## 涉及文件

| 文件 | 职责 |
|------|------|
| `src/app/page.tsx` | 页面组件——获取并渲染句子列表 |
| `src/components/SentenceList.tsx` | 渲染句子列表 |
| `src/components/SentenceItem.tsx` | 渲染单条句子行 |
| `src/lib/prisma.ts` | Prisma 客户端单例 |
| `prisma/schema.prisma` | `Sentence` 模型定义 |

---

## 数据模型

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

## 数据流

```
浏览器 GET /
  → Next.js page.tsx（服务端组件）
    → prisma.sentence.findMany({ orderBy: { createdAt: 'asc' } })
    → 渲染 <SentenceList sentences={sentences} />
```

F1 不需要 API 路由。数据直接在服务端组件中获取。

---

## 组件设计

### `page.tsx`（服务端组件）

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

Props：`sentences: Sentence[]`

- 若为空 → 渲染空状态消息
- 否则 → 为每条句子渲染 `<SentenceItem>`

### `SentenceItem.tsx`

Props：`sentence: Sentence`

每行显示：
- `content` — 句子文本
- `author` — 姓名（或 "AI"）
- `isAI` — 徽章：`人类` | `AI`
- `createdAt` — 格式化时间戳（如 `HH:mm`）

---

## 共享类型

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

## 空状态

当 `sentences.length === 0` 时，显示：

> "还没有故事。成为第一个添加句子的人吧！"

---

## 渲染策略

- **SSR**（无 `'use client'`）——每次请求时在服务端渲染页面
- F1 无需加载动画（HTML 发送前数据已就绪）
- 无分页——课程演示期间故事预计保持简短
