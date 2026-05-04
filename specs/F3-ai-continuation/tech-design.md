# F3 — AI 自动续写：技术设计

## 概述

F3 扩展现有的 `POST /api/sentences` 处理器：保存人类句子后调用 Qwen，再保存 AI 续写。无需新的 UI 组件——`SentenceList` 已能渲染 AI 标记的句子。

---

## 修改文件

| 文件 | 变更 |
|------|------|
| `src/lib/qwen.ts` | 添加 `generateContinuation(context: string[])` 函数 |
| `src/app/api/sentences/route.ts` | 保存人类句子后，调用 `generateContinuation` 并保存结果 |

---

## 新函数：`generateContinuation`

```typescript
// src/lib/qwen.ts
export async function generateContinuation(context: string[]): Promise<string | null>
```

- 接收最近 N 句话作为上下文（纯字符串）
- 构建提示词："以下是目前的故事：[句子]。请续写恰好一句话。"
- 返回经过 trim 的 AI 响应，失败时返回 `null`
- 与 `generateOpener` 共用相同的 fetch/错误处理模式

上下文窗口：使用最近 **10** 句话，保持提示词简短。

---

## 更新后的 POST 流程

```
POST /api/sentences { author, content }
  │
  ├─ 验证 → 无效则返回 400
  ├─ 保存人类句子 → 数据库
  ├─ 从数据库获取最近 10 句（作为上下文）
  ├─ 调用 generateContinuation(context)
  │   ├─ 成功 → 保存 AI 句子 → 数据库
  │   └─ null（失败）→ 静默跳过
  └─ 返回 201 及人类句子
```

响应仍只返回人类句子（201）。AI 句子在响应发送前在后台保存——无流式传输，无异步队列。

---

## 提示词设计

```
请续写这个故事，恰好一句话。只输出那句话，不要其他内容。

目前的故事：
- 从前在一个宁静的村庄
- 黎明时分出现了一条龙
- 村民们惊慌逃跑
```

`max_tokens: 80`——足够一句话，防止输出过长。
