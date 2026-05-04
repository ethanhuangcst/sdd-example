# F2 — 添加句子：技术设计

## 概述

F2 在首页添加一个客户端表单。表单收集作者姓名和句子内容，客户端验证两个字段后，POST 到 `/api/sentences`。提交成功后页面重新获取并渲染。

---

## 涉及文件

| 文件 | 职责 |
|------|------|
| `src/components/AddSentenceForm.tsx` | 客户端组件——表单 UI、验证、提交 |
| `src/lib/validation.ts` | 纯验证函数（可单元测试） |
| `src/app/api/sentences/route.ts` | 添加 `POST` 处理器——验证、保存到数据库 |
| `src/app/page.tsx` | 在句子列表下方引入 `<AddSentenceForm>` |

---

## 验证逻辑

提取到 `src/lib/validation.ts` 以便独立单元测试：

```typescript
export type FormInput = { author: string; content: string }
export type FormErrors = Partial<Record<keyof FormInput, string>>

export function validateSentenceInput(input: FormInput): FormErrors {
  const errors: FormErrors = {}
  if (!input.author.trim()) errors.author = '作者姓名为必填项'
  if (!input.content.trim()) errors.content = '句子为必填项'
  return errors
}
```

---

## API：POST /api/sentences

请求体：
```json
{ "author": "Alice", "content": "龙在黎明时苏醒。" }
```

行为：
1. 验证——若作者或内容为空则返回 `400`
2. 将用户句子保存到数据库（`isAI: false`）
3. 返回 `201` 及已保存的句子

注意：AI 续写（F3）将在下一个功能中添加。F2 仅保存人类句子。

响应（201）：
```json
{ "id": 5, "author": "Alice", "content": "龙在黎明时苏醒。", "isAI": false, "createdAt": "..." }
```

---

## 组件：AddSentenceForm

`'use client'` — 需要 `useState` 管理表单状态和提交。

状态：
- `author: string`
- `content: string`
- `errors: FormErrors`
- `submitting: boolean`

提交时：
1. 运行 `validateSentenceInput`——若无效则设置错误并中止
2. 设置 `submitting = true`，禁用提交按钮
3. `POST /api/sentences`
4. 成功时：清空字段和错误；通过 `router.refresh()` 触发页面刷新
5. 失败时：显示通用错误；重新启用按钮
6. 设置 `submitting = false`

页面刷新策略：使用 `next/navigation` 的 `router.refresh()`——重新运行服务端组件数据获取，无需完整导航。

---

## UI 布局

```
┌─────────────────────────────────────────┐
│  您的姓名                               │
│  ┌─────────────────────────────────┐    │
│  │ Alice                           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  您的句子                               │
│  ┌─────────────────────────────────┐    │
│  │ 龙在黎明时苏醒。                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [  添加到故事  ]                       │
└─────────────────────────────────────────┘
```

样式（内联，符合 UI 规范）：
- 输入框：奶油色背景 `#faf7f2`，边框 `#e0d5c5`，衬线字体，`padding: 8px 12px`
- 错误文字：暖红色 `#b94040`，`font-size: 12px`，显示在字段下方
- 提交按钮：琥珀色填充 `#c17f3e`，深墨色文字 `#2c2416`，`rounded-md`，禁用状态：`opacity: 0.5`
