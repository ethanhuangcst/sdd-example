# 测试策略：AI 故事接龙

## 工具

| 层级 | 工具 | 版本 |
|------|------|------|
| 单元 & 集成 | Vitest + React Testing Library + jest-dom | 3.2.0 / 16.3.0 |
| E2E | Playwright（Chromium） | 1.52.0 |
| 用户交互模拟 | @testing-library/user-event | 14.6.1 |

命令：
- `npm test` — 运行单元 + 集成测试（Vitest）
- `npm run test:e2e` — 运行 E2E 测试（Playwright）

---

## 测试金字塔

```
        [ E2E ]          ~10%   Playwright — 浏览器中的完整用户流程
      [ 集成测试 ]        ~20%   Vitest — API 路由 + 数据库
    [   单元测试   ]      ~70%   Vitest — 纯逻辑函数
```

---

## 各层说明

### 单元测试（`tests/unit/`）

工具：**Vitest**

测试内容：
- `qwen.ts` — 提示词构建器、响应解析器（从 AI 输出中提取一句话）
- `types.ts` — 类型守卫（如有）

规则：
- 不使用真实数据库，不调用真实 API
- 仅 Mock：`Date.now()`、外部 fetch 调用
- 每个测试只覆盖一个行为

### 集成测试（`tests/integration/`）

工具：**Vitest + 真实数据库 + 真实 Qwen API**

测试内容：
- `GET /api/sentences` — 按升序返回句子
- `POST /api/sentences` — 保存用户句子，调用 Qwen，保存 AI 句子，返回两者
- `POST /api/reset` — 删除所有句子

规则：
- 使用 `.env` 中的真实 `DATABASE_URL`
- 使用真实 `QWEN_API_KEY`——不 Mock AI
- 每个测试前后清理测试数据

### E2E 测试（`tests/e2e/`）

工具：**Playwright（Chromium，无头模式）**

测试内容：
- `story.spec.ts` — 完整流程：打开页面 → 看到空状态 → 提交句子 → 看到用户 + AI 句子出现 → 重置 → 再次为空

规则：
- 针对 `npm run dev`（localhost:3000）运行
- 断言前使用 `page.waitForLoadState('networkidle')`
- 不 Mock——真实数据库，真实 AI

---

## 完成定义（SMART）

功能**完成**须满足以下所有条件：

| # | 标准 | 具体说明 | 可度量 |
|---|------|----------|--------|
| 1 | 所有单元测试通过 | `tests/unit/` 中的测试 | `npm test` 退出码为 0 |
| 2 | 所有集成测试通过 | `tests/integration/` 中的测试 | `npm test` 退出码为 0 |
| 3 | 所有 E2E 测试通过 | `tests/e2e/` 中的测试 | `npm run test:e2e` 退出码为 0 |
| 4 | 无 TypeScript 错误 | 整个 `src/` | `npx tsc --noEmit` 退出码为 0 |
| 5 | 无 ESLint 错误 | 整个 `src/` | `npx eslint src/` 退出码为 0 |
| 6 | `req.md` 中所有验收标准均有对应测试 | 功能的 `req.md` | 每个 Gherkin 场景映射到一个测试用例 |
| 7 | 无硬编码 UI 文字——所有字符串使用 i18n key | `src/` | JSX 中无 i18n 调用之外的字符串字面量 |

**可实现**：所有标准均可用本仓库现有工具验证。
**相关性**：每项标准直接验证功能或质量要求。
**时限性**：功能分支合并前必须全部满足。
