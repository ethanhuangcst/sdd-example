# 依赖项版本（精确版本号）

> 供讲师打包使用，不对学员公开。所有版本号不使用 `^` 或 `~`。

## 生产依赖

```
next@15.3.2
react@19.1.0
react-dom@19.1.0
@prisma/client@6.8.2
```

## 开发依赖

```
typescript@5.8.3
tailwindcss@4.2.2
@tailwindcss/postcss@4.2.2
prisma@6.8.2
@playwright/test@1.52.0
vitest@3.2.0
@vitejs/plugin-react@4.5.2
@testing-library/react@16.3.0
@testing-library/user-event@14.6.1
@testing-library/jest-dom@6.6.3
eslint@9.27.0
eslint-config-next@15.3.2
```

## 可行性说明：为什么不把依赖打包进 npm 程序

| 方案 | 可行性 | 原因 |
|------|--------|------|
| 打包 node_modules 为压缩包 | 不推荐 | Prisma、Playwright 含平台特定二进制文件，macOS 包无法在 Windows 上使用 |
| 发布 meta-package 到 npm | 不推荐 | npm 依赖提升机制导致包安装到错误目录，不可靠 |
| 本地 Verdaccio 私有仓库 | 可行但复杂 | 需要服务器，维护成本高 |
| **配置 npmmirror 镜像** | **推荐** | npmmirror 已镜像所有所需包及 Playwright/Prisma 二进制文件，稳定可靠 |

**结论**：npmmirror 已完整镜像本项目所有依赖（包括 Playwright 浏览器二进制和 Prisma 引擎），配置镜像后一键安装即可，无需额外打包。
