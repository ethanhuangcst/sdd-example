# SDD 课程示例项目

帮助学员验证开发环境（工具、依赖项、数据库、AI API Key）已准备就绪。

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 15 (React, SSR/SSG) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| ORM | Prisma |
| 数据库 | PostgreSQL（部署在公网服务器） |
| AI 大模型 | Qwen（通义千问，API Key 由讲师提供） |
| E2E 测试 | Playwright |
| 集成/单元测试 | Vitest + React Testing Library |

---

## 安装方式（针对中国网络环境）

### 方案：通过 npmmirror 安装（推荐）

所有依赖项均可通过阿里云 npmmirror 镜像安装，无需科学上网。

**第一步：配置 npm 镜像**

```bash
npm config set registry https://registry.npmmirror.com
```

**第二步：安装依赖**

```bash
npm install
```

**第三步：安装 Playwright 浏览器（使用国内镜像）**

```bash
# macOS / Linux
PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright/ npx playwright install chromium

# Windows (PowerShell)
$env:PLAYWRIGHT_DOWNLOAD_HOST="https://npmmirror.com/mirrors/playwright/"; npx playwright install chromium
```

**第四步：配置 Prisma 引擎镜像（如安装时卡住）**

```bash
# macOS / Linux
PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma/ npm install

# Windows (PowerShell)
$env:PRISMA_ENGINES_MIRROR="https://registry.npmmirror.com/-/binary/prisma/"; npm install
```

---

## 可行性说明：为什么不把依赖打包进 npm 程序

| 方案 | 可行性 | 原因 |
|------|--------|------|
| 打包 node_modules 为压缩包 | 不推荐 | Prisma、Playwright 含平台特定二进制文件，macOS 包无法在 Windows 上使用 |
| 发布 meta-package 到 npm | 不推荐 | npm 依赖提升机制导致包安装到错误目录，不可靠 |
| 本地 Verdaccio 私有仓库 | 可行但复杂 | 需要服务器，维护成本高 |
| **配置 npmmirror 镜像** | **推荐** | npmmirror 已镜像所有所需包及 Playwright/Prisma 二进制文件，稳定可靠 |

**结论**：npmmirror 已完整镜像本项目所有依赖（包括 Playwright 浏览器二进制和 Prisma 引擎），配置镜像后一键安装即可，无需额外打包。

---

## 环境变量

复制 `.env.example` 为 `.env`，填入以下内容：

```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
QWEN_API_KEY="your-api-key-here"
```

---

## 开发环境要求

- Node.js >= 20.x
- npm >= 10.x
- 操作系统：macOS 或 Windows
