# F2 — 添加句子：测试计划

## 范围

F2 涉及带验证的客户端表单和 POST API 端点。
测试层级：**单元测试**（验证逻辑）+ **集成测试**（API）+ **E2E**（浏览器表单交互）。

---

## 验收标准 → 测试映射

| 验收标准 | 测试层级 | 测试 ID |
|----------|----------|---------|
| 句子保存后出现在列表中 | 集成 + E2E | IT-F2-01, E2E-F2-01 |
| 提交后表单字段被清空 | E2E | E2E-F2-01 |
| 空作者姓名被拒绝 | 单元 + E2E | UT-F2-01, E2E-F2-02 |
| 空句子被拒绝 | 单元 + E2E | UT-F2-02, E2E-F2-03 |
| 句子归属正确作者，标记为人类 | 集成 + E2E | IT-F2-01, E2E-F2-04 |
| 提交期间提交按钮被禁用 | E2E | E2E-F2-05 |

---

## 单元测试

文件：`tests/unit/validation.test.ts`
工具：Vitest

### UT-F2-01 — 拒绝空作者姓名

```
准备：input = { author: '', content: '某句话' }
执行：validate(input)
断言：返回 author 字段的错误
```

### UT-F2-02 — 拒绝空句子

```
准备：input = { author: 'Alice', content: '' }
执行：validate(input)
断言：返回 content 字段的错误
```

---

## 集成测试

文件：`tests/integration/sentences.test.ts`
工具：Vitest + 真实 PostgreSQL

### IT-F2-01 — POST /api/sentences 保存句子并返回

```
准备：空表
执行：POST /api/sentences { author: 'Alice', content: 'Hello world' }
断言：状态码 201
      响应包含 { author: 'Alice', content: 'Hello world', isAI: false }
      句子存在于数据库中
清理：deleteMany
```

### IT-F2-02 — POST /api/sentences 拒绝缺少作者

```
执行：POST /api/sentences { author: '', content: 'Hello' }
断言：状态码 400
```

### IT-F2-03 — POST /api/sentences 拒绝缺少内容

```
执行：POST /api/sentences { author: 'Alice', content: '' }
断言：状态码 400
```

---

## E2E 测试

文件：`tests/e2e/story.spec.ts`
工具：Playwright（Chromium，无头模式），服务器地址 `http://localhost:3000`

### E2E-F2-01 — 成功提交保存句子并清空表单

```
准备：重置故事
执行：导航到 /
      填写作者 "Alice"，填写句子 "龙苏醒了。"
      提交表单
      waitForLoadState('networkidle')
断言：故事列表中可见 "龙苏醒了。"
      作者字段为空
      句子字段为空
清理：重置
```

### E2E-F2-02 — 空作者显示验证错误

```
执行：导航到 /
      不填作者，填写句子 "Hello"
      提交表单
断言：表单未提交（列表中无新句子）
      作者字段的错误消息可见
```

### E2E-F2-03 — 空句子显示验证错误

```
执行：导航到 /
      填写作者 "Alice"，不填句子
      提交表单
断言：表单未提交
      句子字段的错误消息可见
```

### E2E-F2-04 — 提交的句子显示正确作者和人类标签

```
准备：重置故事
执行：导航到 /
      填写作者 "Alice"，填写句子 "再一次。"
      提交表单
      waitForLoadState('networkidle')
断言：句子条目包含 "Alice"
      标签显示 "人类"
清理：重置
```

### E2E-F2-05 — 提交期间提交按钮被禁用

```
执行：导航到 /
      填写作者和句子
      点击提交
断言：点击后提交按钮立即被禁用
      提交完成后按钮重新启用
```
