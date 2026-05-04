# F4 — 重置故事：技术设计

## 概述

F4 添加一个带浏览器 `confirm()` 对话框的"重新开始"按钮。确认后调用 `POST /api/reset`，再触发 `router.refresh()`。无需新的 API 路由——`/api/reset` 已存在。

---

## 修改文件

| 文件 | 变更 |
|------|------|
| `src/components/ResetButton.tsx` | 新客户端组件——按钮 + 确认对话框 |
| `src/app/page.tsx` | 在表单下方添加 `<ResetButton />` |

---

## 组件：ResetButton

`'use client'` — 需要 `useState` 管理提交状态，`useRouter` 用于刷新。

```
点击时：
  1. window.confirm("重新开始？所有句子将被删除。")
  2. 若取消 → 不做任何操作
  3. 若确认 → POST /api/reset → router.refresh()
```

样式：幽灵按钮，柔和边框，悬停时变红（符合 UI 规范）。
