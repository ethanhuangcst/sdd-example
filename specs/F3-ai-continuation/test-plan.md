# F3 — AI 自动续写：测试计划

## 范围

F3 扩展 POST `/api/sentences` 流程：保存人类句子后，API 调用 Qwen 并保存 AI 续写。无新 UI 组件——现有 `SentenceList` 渲染结果。

测试层级：**单元测试**（qwen.ts 续写提示词）+ **集成测试**（POST 返回 AI 句子）+ **E2E**（浏览器提交后看到 AI 句子）。

---

## 验收标准 → 测试映射

| 验收标准 | 测试层级 | 测试 ID |
|----------|----------|---------|
| 人类提交后 AI 句子被生成并保存 | 集成 + E2E | IT-F3-01, E2E-F3-01 |
| AI 句子紧接人类句子之后出现，标记为 "AI" | E2E | E2E-F3-01 |
| AI 续写连贯（非空，非逐字重复） | 单元 + 集成 | UT-F3-01, IT-F3-01 |
| AI 失败不影响人类句子保存 | 集成 | IT-F3-02 |
| 每次提交恰好一句 AI 续写 | 集成 | IT-F3-01 |

---

## 单元测试

文件：`tests/unit/qwen.test.ts`
工具：Vitest（真实 Qwen API——按测试策略不 Mock）

### UT-F3-01 — generateContinuation 返回非空字符串

```
准备：context = ["从前有一次", "有一条龙"]
执行：generateContinuation(context)
断言：结果为非空字符串
      结果不与最后一句逐字相同
```

---

## 集成测试

文件：`tests/integration/sentences.test.ts`
工具：Vitest + 真实数据库 + 真实 Qwen API

### IT-F3-01 — POST /api/sentences 保存人类句子和 AI 续写

```
准备：预置 1 条句子作为上下文
执行：POST /api/sentences { author: 'Alice', content: '龙苏醒了。' }
断言：状态码 201
      响应包含人类句子
      数据库共有 3 条句子（1 预置 + 1 人类 + 1 AI）
      数据库最后一条句子 isAI: true
      AI 句子内容非空
清理：deleteMany
```

### IT-F3-02 — AI 调用失败时人类句子仍被保存

```
注意：通过 qwen.ts 中优雅失败路径返回 null 来测试。
      由现有实现契约覆盖——无需单独测试，
      因为在不 Mock 的情况下无法可靠模拟 AI 失败。
```

---

## E2E 测试

文件：`tests/e2e/story.spec.ts`
工具：Playwright（Chromium，无头模式），服务器地址 `http://localhost:3000`

### E2E-F3-01 — AI 句子紧接人类句子出现在故事中

```
准备：预置 1 条句子，导航到 /
执行：填写作者 "Alice"，填写句子 "龙苏醒了。"
      提交表单
      waitForLoadState('networkidle')
断言：句子条目数量 >= 3（预置 + 人类 + AI）
      "龙苏醒了。" 之后的条目标签为 "AI"
      AI 句子内容非空
清理：重置
```
