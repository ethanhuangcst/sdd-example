# F1 — 查看故事：测试计划

## 范围

F1 是纯 SSR 只读页面，无客户端逻辑，无表单提交。
测试层级：**集成测试**（API）+ **E2E**（浏览器）。
单元测试：不适用——此功能无独立逻辑函数。

---

## 验收标准 → 测试映射

| 验收标准（来自 req.md） | 测试层级 | 测试 ID |
|------------------------|----------|---------|
| 句子按从旧到新顺序显示 | 集成 + E2E | IT-F1-01, E2E-F1-01 |
| 每句话显示作者、时间、人类/AI 标签 | E2E | E2E-F1-02 |
| 无句子时显示空状态 | 集成 + E2E | IT-F1-02, E2E-F1-03 |
| 人类句子标记为"人类" | E2E | E2E-F1-02 |
| AI 句子标记为"AI" | E2E | E2E-F1-02 |

---

## 集成测试

文件：`tests/integration/sentences.test.ts`
工具：Vitest + 真实 PostgreSQL（`DATABASE_URL`）

### IT-F1-01 — GET /api/sentences 按升序返回句子

```
准备：插入 3 条已知 createdAt 值的句子
执行：GET /api/sentences
断言：响应为包含 3 条记录的数组，按从旧到新排序
      每条记录包含：id, content, author, isAI, createdAt
清理：删除插入的行
```

### IT-F1-02 — GET /api/sentences 在无句子时返回空数组

```
准备：确保表为空
执行：GET /api/sentences
断言：响应为 []
```

---

## E2E 测试

文件：`tests/e2e/story.spec.ts`
工具：Playwright（Chromium，无头模式），服务器地址 `http://localhost:3000`

### E2E-F1-01 — 页面按顺序显示已有句子

```
准备：通过 API 预置 2 条句子（人类 + AI）
执行：导航到 /
      waitForLoadState('networkidle')
断言：句子条目数量 === 2
      第一条文本与第一条预置句子匹配
      第二条文本与第二条预置句子匹配
清理：POST /api/reset
```

### E2E-F1-02 — 每句话显示作者、时间戳和人类/AI 标签

```
准备：预置 1 条人类句子（作者 "Alice"）+ 1 条 AI 句子
执行：导航到 /
      waitForLoadState('networkidle')
断言：第一条包含 "Alice" 和标签 "人类"
      第二条包含 "AI" 和标签 "AI"
      两条均显示可见时间戳
清理：POST /api/reset
```

### E2E-F1-03 — 故事无句子时显示空状态

```
准备：POST /api/reset 确保空状态
执行：导航到 /
      waitForLoadState('networkidle')
断言：空状态消息可见
      无句子条目渲染
```

---

## F1 范围外

- 提交句子（F2）
- AI 续写（F3）
- 重置按钮行为（F4）
