# ETO Blog

> 三体 ETO 风格的极简博客模板 · Next.js 16 · 内置评论 · 友圈 · 数学公式 · GitHub 卡片

黑色背景，红色光标，星点缓慢呼吸。克制、冷峻、留白。

## 特性

- **内容** — Markdown 文章 / 短碎片小事 / 自动归档 / 标签云 / 全文搜索（⌘K）
- **富媒体** — GitHub 仓库卡片 / YouTube / Bilibili / LaTeX 公式 / 图片注释 / 代码块复制
- **互动** — 嵌套楼层评论 / 邮件通知 / 文章点赞
- **友链** — 友链列表 + RSS 友圈动态聚合
- **About 页** — 自动拉取 GitHub 最近仓库 + 年贡献数 / 可选 Steam 展示
- **存储** — Vercel KV / 标准 Redis / 本地 JSON 三种自动选择
- **风格** — 自托管字体（Syne / Bebas / Inter / JetBrains Mono）/ 视差呼吸星空 / KaTeX 公式

## 快速开始

```bash
git clone https://github.com/luojisama/ETO_BLOG.git
cd ETO_BLOG
npm install
npm run dev
```

打开 <http://localhost:3906>。

## 配置

所有需要修改的「内容」都在 **`src/config/site.ts`**：

```typescript
export const SITE_TITLE = "ETO Blog";
export const SITE_DESCRIPTION = "克制、冷峻、留白的个人博客";
export const SITE_URL = "https://blog.example.com";
export const SITE_START = "2025-05-27";
export const OWNER_NAME = "你的名字";
export const GITHUB_USERNAME = "yourusername";
export const STEAM_INPUT = "";   // 留空 = 隐藏 Steam 区块
// ...
```

「凭证」（API Key、SMTP 密码）放在 **`.env.local`**，参考 `.env.example`。

详细教程在站内文章：

- `/posts/01-customize-about` — 配置项详解
- `/posts/02-writing-posts-and-thoughts` — 写文章和小事的格式
- `/posts/03-rich-media-and-features` — 富媒体、留言邮件、Vercel 部署

## 写文章

```
content/posts/my-post.md     →  /posts/my-post
content/thoughts/2026-05-27.md  →  /thoughts
```

frontmatter 字段：`title`（文章必填）/ `date` / `description` / `tags`。

## 部署

一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/luojisama/ETO_BLOG)

环境变量在 Project Settings → Environment Variables 配置，按需添加：

| 变量 | 作用 |
|---|---|
| `GITHUB_TOKEN` | About 页年贡献数 + 文章卡片高速率 |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV（推荐） |
| `REDIS_URL` | 外部 Redis（备选） |
| `SMTP_HOST` 等 | 留言邮件通知（见 `.env.example`） |
| `STEAM_API_KEY` | About 页 Steam 展示 |

## 技术栈

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- remark + rehype（rehype-katex / rehype-raw）
- gray-matter / rss-parser / nodemailer
- ioredis · @vercel/kv

## License

MIT
