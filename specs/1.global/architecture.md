# 架构设计：AI 故事接龙

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端 | Next.js（App Router，SSR） | 15.3.2 |
| 语言 | TypeScript | 5.8.3 |
| 样式 | Tailwind CSS | 4.2.2 |
| ORM | Prisma | 6.8.2 |
| 数据库 | PostgreSQL（远程公网服务器） | — |
| AI | Qwen（兼容 OpenAI 的 API） | qwen-plus |
| 单元/集成测试 | Vitest + React Testing Library | 3.2.0 |
| E2E 测试 | Playwright | 1.52.0 |

---

## 目录结构

```
sdd-sample/
├── prisma/
│   └── schema.prisma          # 数据模型
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页（故事列表 + 输入表单）
│   │   └── api/
│   │       ├── sentences/
│   │       │   └── route.ts   # GET 获取句子列表，POST 添加句子
│   │       └── reset/
│   │           └── route.ts   # POST 重置故事
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 客户端单例
│   │   └── qwen.ts            # Qwen AI 调用封装
│   └── types.ts               # 共享类型定义
├── tests/
│   ├── unit/
│   │   └── qwen.test.ts       # Qwen 响应解析单元测试
│   ├── integration/
│   │   └── sentences.test.ts  # API 路由集成测试
│   └── e2e/
│       └── story.spec.ts      # 完整故事接龙 E2E 测试
├── .env                       # 本地环境变量（不提交）
├── .env.example               # 环境变量模板
└── package.json
```

---

## 数据模型

```prisma
model Sentence {
  id        Int      @id @default(autoincrement())
  content   String
  author    String   // 用户名；AI 句子使用 "AI"
  isAI      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/sentences` | 返回所有句子（按时间升序） |
| POST | `/api/sentences` | 保存用户句子，触发 AI 续写，返回两者 |
| POST | `/api/reset` | 删除所有句子 |

POST `/api/sentences` 请求体：
```json
{ "author": "Alice", "content": "从前在一个宁静的村庄" }
```

---

## AI 集成

使用 Qwen 兼容 OpenAI 的 API（原生 `fetch`）：

- Base URL：`https://dashscope.aliyuncs.com/compatible-mode/v1`
- 模型：`qwen-plus`
- 提示词策略：将已有句子拼接为上下文，指示 AI 续写**恰好一句话**

---

## 数据流

```
用户提交句子
    │
    ▼
POST /api/sentences
    │
    ├─→ 保存到数据库（用户句子）
    │
    ├─→ 获取最近 N 句作为上下文
    │
    ├─→ 调用 Qwen API → 获取 AI 续写
    │
    └─→ 保存到数据库（AI 句子）
            │
            ▼
        将两条新句子返回给前端
```

---

## 环境变量

```
DATABASE_URL=postgresql://...
QWEN_API_KEY=sk-...
QWEN_MODEL=qwen-plus
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

---

## 开发环境要求

- Node.js >= 20.x
- npm >= 10.x
- 操作系统：macOS 或 Windows
