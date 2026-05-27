---
title: "繁琐小事与留言板的实现教程"
date: 2026-01-27
description: "基于 Astro + Svelte + Vercel KV 构建的轻量级无后端留言板实现记录"
tags: ["Astro", "Svelte", "Vercel", "Redis"]
category: "技术分享"

---

# 前言

最近把博客的评论系统从 Giscus 迁移到了自建的留言板。主要原因是想要一个更轻量、无需 GitHub 登录、且能深度集成到博客主题中的评论系统。同时，为了配合“繁琐小事”（Thoughts）页面的需求，开发了一套基于 Vercel KV (Redis) 的留言板方案。

# 技术选型

- **框架**: Astro (主框架，使用 `static` 输出模式配合 Serverless API)
- **UI 组件**: Svelte (处理前端交互，如表单提交、即时渲染)
- **数据存储**: Vercel KV (基于 Redis)，同时通过 `ioredis` 兼容标准 Redis 协议
- **样式**: TailwindCSS
- **Markdown 渲染**: markdown-it + sanitize-html (支持部分 Markdown 语法并防止 XSS)

# 核心实现

## 1. 混合渲染架构 (Hybrid Rendering)

博客整体依然保持 **静态生成 (Static Site Generation)** 以确保最佳的访问速度和 SEO。但是留言板需要动态交互，因此我们利用 Astro 的 Server Endpoints 功能，实现了一个运行在 Vercel Serverless Function 上的 API。

在 `astro.config.mjs` 中，我们配置了 Vercel 适配器：

```javascript
import vercel from "@astrojs/vercel";

export default defineConfig({
    // ...
    output: "static", // 默认为静态
    adapter: vercel(),
    // ...
});
```

而在 API 文件 `src/pages/api/messages.ts` 中，我们强制开启服务端渲染：

```typescript
export const prerender = false; // 声明此文件为动态路由

export const GET: APIRoute = async ({ request }) => {
    // ...
}
```

## 2. 数据存储层设计

为了兼容 Vercel 的 Serverless 环境以及本地开发，封装了一个统一的数据库工具 `src/utils/local-db.ts`。它会自动根据环境变量切换存储策略：

- **生产环境 (Vercel)**: 优先检测 `KV_REST_API_URL` (Vercel KV)，如果不存在则检测 `REDIS_URL` (使用 `ioredis` 连接)。
- **本地开发**: 如果没有配置 Redis 环境变量，则自动降级为本地 JSON 文件存储 (`data/messages.json`)。

```typescript
// src/utils/local-db.ts
import { createClient } from "@vercel/kv";
import Redis from "ioredis";

// 自动检测客户端
const USE_VERCEL_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const USE_REDIS_URL = !USE_VERCEL_KV && !!process.env.REDIS_URL;

export async function getMessages(slug?: string) {
    // ... 从 Redis 或 JSON 读取 ...
    // 目前采用简单的单 Key 存储所有留言，通过 slug 过滤
    if (slug) {
        return messages.filter((m) => m.slug === slug);
    }
    return messages;
}
```

## 3. 前端组件与交互 (Svelte)

前端主要由三个组件构成：
1. `MessageBoard.svelte`: 容器组件，负责获取数据。
2. `MessageList.svelte` / `MessageItem.svelte`: 负责递归渲染留言及回复。
3. `MessageEditor.svelte`: 负责表单提交及头像预览。

### 性能优化：Markdown 渲染单例化

在 `MessageItem.svelte` 中，每条留言都需要渲染 Markdown。如果直接在组件内 `import` 并初始化 `markdown-it`，会导致每条留言都创建新的解析器实例，极大地消耗内存并阻塞主线程。

我们利用 Svelte 的 `<script context="module">` 特性，确保整个页面只初始化一次解析器：

```svelte
<!-- src/components/MessageItem.svelte -->
<script context="module" lang="ts">
    import MarkdownIt from "markdown-it";
    import sanitizeHtml from "sanitize-html";

    // 全局单例，复用配置
    const md = new MarkdownIt({ html: true, breaks: true, linkify: true });
    
    // 严格的 XSS 过滤配置
    const sanitizeOptions = {
        allowedTags: ["p", "b", "i", "em", "strong", "a", "code", "pre", "span", "img", "details", "summary"],
        allowedAttributes: {
            img: ["src", "alt", "title"],
            a: ["href", "title", "target"],
            span: ["class"],
        },
        allowedClasses: {
            span: ["spoiler"], // 允许自定义的防剧透样式
        }
    };

    function renderContent(text: string) {
        // 自定义语法支持：||黑幕||
        const withSpoilers = text.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
        return sanitizeHtml(md.render(withSpoilers), sanitizeOptions);
    }
</script>

<script lang="ts">
    export let message;
    // 直接调用模块级函数
    $: htmlContent = renderContent(message.content);
</script>
```

### 交互优化：延迟加载与防抖

为了不影响页面的 **LCP (Largest Contentful Paint)**，留言数据的请求被特意延迟了 100ms：

```typescript
// src/components/MessageBoard.svelte
onMount(() => {
    // 避免阻塞首屏 Hydration
    const timer = setTimeout(() => {
        fetchMessages();
    }, 100);
    return () => clearTimeout(timer);
});
```

此外，`MessageEditor` 会将用户的昵称、邮箱、网址缓存在 `localStorage` 中，提升用户体验。

## 4. 路由与复用

为了让“繁琐小事”页面也能使用留言板，我们将 `MessageBoard` 封装进了 `Comment.astro` 组件。它会自动获取当前页面的 URL 路径作为 `slug`：

```astro
---
// src/components/Comment.astro
interface Props {
    slug?: string;
}
const { slug: propSlug } = Astro.props;
// 默认使用 pathname，去除末尾斜杠
let slug = propSlug || Astro.url.pathname.replace(/\/$/, "");
---

<div class="mt-8 mb-8">
    <MessageBoard client:visible {slug} />
</div>
```

在 `src/pages/thoughts/[...page].astro` 中，我们进一步使用 `<details>` 标签包裹留言板，默认折叠，保持页面清爽：

```html
<details class="group">
    <summary class="...">
        <span>展开评论区</span>
    </summary>
    <div class="mt-6 animate-fade-in-down">
        <Comment slug="thoughts" />
    </div>
</details>
```

## 5. 获取设备信息 (Device Info)

为了让留言板更有趣，我们增加了一个小功能：显示发送者的设备信息（操作系统、浏览器、设备型号）。

首先安装 `ua-parser-js`：

```bash
pnpm add ua-parser-js
pnpm add -D @types/ua-parser-js
```

然后在后端 API (`src/pages/api/messages.ts`) 中解析 `User-Agent`：

```typescript
import { UAParser } from "ua-parser-js";

export const POST: APIRoute = async ({ request }) => {
    // ...
    const uaString = request.headers.get("user-agent") || "";
    const parser = new UAParser(uaString);
    
    // 解析结果
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    // ... 保存到数据库
}
```

最后在前端 (`src/components/MessageItem.svelte`) 展示即可。

# 部署配置

在 Vercel 面板中，需要配置以下环境变量之一：

1. **KV_REST_API_URL** & **KV_REST_API_TOKEN**: 如果使用 Vercel Storage KV。
2. **REDIS_URL**: 如果使用 Upstash 或其他标准 Redis 服务。

# 结语

这就完成了一个麻雀虽小五脏俱全的留言板系统。相比于 Giscus，它完全由我们自己掌控数据，并且可以根据需求随意定制样式和功能（比如未来可以加入邮件通知、后台管理等）。

# 附录：完整源代码

以下是本系统实现的核心文件源码。

<details>
<summary>src/types/message.ts (类型定义)</summary>

```typescript
export interface Message {
	id: string;
	slug?: string;
	parentId?: string;
	nickname: string;
	content: string;
	email?: string;
	website?: string;
	avatar: string;
	createdAt: number;
	replies?: Message[];
	os?: string;
	browser?: string;
	device?: string;
}
```

</details>

<details>
<summary>src/utils/local-db.ts (数据库工具)</summary>

```typescript
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@vercel/kv";
import Redis from "ioredis";
import type { Message } from "../types/message";

const DB_PATH = path.join(process.cwd(), "data", "messages.json");

// Determine which client to use
const USE_VERCEL_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const USE_REDIS_URL = !USE_VERCEL_KV && !!process.env.REDIS_URL;
const IS_REMOTE = USE_VERCEL_KV || USE_REDIS_URL;

// Initialize clients
let kvClient: ReturnType<typeof createClient> | null = null;
let redisClient: Redis | null = null;

if (USE_VERCEL_KV) {
	kvClient = createClient({
		url: process.env.KV_REST_API_URL!,
		token: process.env.KV_REST_API_TOKEN!,
	});
} else if (USE_REDIS_URL) {
	// Use ioredis for standard connection strings (e.g. redis://...)
	// This works for Vercel Redis integrations that only provide REDIS_URL
	try {
		redisClient = new Redis(process.env.REDIS_URL!);
		redisClient.on("error", (err) => {
			console.error("Redis connection error:", err);
		});
	} catch (e) {
		console.error("Failed to initialize Redis client:", e);
	}
}

// Ensure data directory exists for local dev (fallback)
if (!IS_REMOTE && !fs.existsSync(path.dirname(DB_PATH))) {
	fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Initialize DB file if not exists for local dev (fallback)
if (!IS_REMOTE && !fs.existsSync(DB_PATH)) {
	fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

export async function getMessages(slug?: string): Promise<Message[]> {
	try {
		let messages: Message[] = [];
		if (USE_VERCEL_KV && kvClient) {
			messages = (await kvClient.get<Message[]>("messages")) || [];
		} else if (USE_REDIS_URL && redisClient) {
			const raw = await redisClient.get("messages");
			messages = raw ? JSON.parse(raw) : [];
		} else if (fs.existsSync(DB_PATH)) {
			const data = fs.readFileSync(DB_PATH, "utf-8");
			messages = JSON.parse(data);
		}

		if (slug) {
			return messages.filter((m) => m.slug === slug);
		}
		return messages;
	} catch (error) {
		console.error("Failed to get messages:", error);
		return [];
	}
}

export async function addMessage(
	message: Omit<Message, "id" | "createdAt">,
): Promise<Message> {
	// Always get ALL messages when adding
	const messages = await getMessages();
	const newMessage: Message = {
		...message,
		id: Math.random().toString(36).substring(2, 9),
		createdAt: Date.now(),
	};
	messages.unshift(newMessage); // Add to top

	// Limit to 2000 messages total for now to prevent infinite growth
	if (messages.length > 2000) {
		messages.pop();
	}

	if (USE_VERCEL_KV && kvClient) {
		await kvClient.set("messages", messages);
	} else if (USE_REDIS_URL && redisClient) {
		await redisClient.set("messages", JSON.stringify(messages));
	} else {
		fs.writeFileSync(DB_PATH, JSON.stringify(messages, null, 2));
	}
	return newMessage;
}
```

</details>

<details>
<summary>src/pages/api/messages.ts (后端 API)</summary>

```typescript
import type { APIRoute } from "astro";
import { UAParser } from "ua-parser-js";
import { addMessage, getMessages } from "../../utils/local-db";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const url = new URL(request.url);
	const slug = url.searchParams.get("slug") || undefined;
	const messages = await getMessages(slug);
	return new Response(JSON.stringify(messages), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const POST: APIRoute = async ({ request }) => {
	console.log("POST /api/messages called");
	try {
		const body = await request.json();
		console.log("Request body:", body);
		const { nickname, content, email, website, parentId, slug } = body;

		// Parse User Agent
		const uaString = request.headers.get("user-agent") || "";
		const parser = new UAParser(uaString);
		const browser = parser.getBrowser();
		const os = parser.getOS();
		const device = parser.getDevice();

		const browserName = browser.name
			? `${browser.name} ${browser.major || browser.version || ""}`.trim()
			: undefined;
		const osName = os.name
			? `${os.name} ${os.version || ""}`.trim()
			: undefined;
		const deviceName = device.model
			? `${device.vendor || ""} ${device.model}`.trim()
			: undefined;

		if (!nickname || !content) {
			return new Response(JSON.stringify({ error: "昵称和内容不能为空" }), {
				status: 400,
			});
		}

		// Determine avatar
		let avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${nickname}`;
		if (email) {
			// Check if email is a QQ number or QQ email
			const qqMatch = email.match(/^(\d{5,11})(@qq\.com)?$/);
			if (qqMatch) {
				const qq = qqMatch[1];
				avatar = `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=100`;
			}
		}

		let finalWebsite = website ? website.slice(0, 100) : undefined;
		if (
			finalWebsite &&
			!finalWebsite.startsWith("http://") &&
			!finalWebsite.startsWith("https://")
		) {
			finalWebsite = `https://${finalWebsite}`;
		}

		const newMessage = await addMessage({
			nickname: nickname.slice(0, 20), // Limit nickname length
			content: content.slice(0, 500), // Limit content length
			email: email ? email.slice(0, 50) : undefined,
			website: finalWebsite,
			avatar,
			parentId,
			slug,
			os: osName,
			browser: browserName,
			device: deviceName,
		});

		return new Response(JSON.stringify(newMessage), {
			status: 201,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error in POST /api/messages:", error);
		return new Response(JSON.stringify({ error: "服务器内部错误" }), {
			status: 500,
		});
	}
};
```

</details>

<details>
<summary>src/components/Comment.astro (Astro 包装组件)</summary>

```astro
---
import MessageBoard from "./MessageBoard.svelte";

interface Props {
    slug?: string;
}

const { slug: propSlug } = Astro.props;

// Use Astro.url.pathname as the default slug
// Remove trailing slash for consistency, unless it's root
let slug = propSlug || Astro.url.pathname;
if (slug.length > 1 && slug.endsWith('/')) {
    slug = slug.slice(0, -1);
}
---

<div class="mt-8 mb-8">
    <MessageBoard client:visible {slug} />
</div>
```

</details>

<details>
<summary>src/components/MessageBoard.svelte (主组件)</summary>

```svelte
<script lang="ts">
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import MessageEditor from "./MessageEditor.svelte";
import MessageItem from "./MessageItem.svelte";
import type { Message } from "../types/message";

export let slug = "message-board";

let messages: Message[] = [];
let loading = true;
let showSuccess = false;

async function fetchMessages() {
    loading = true;
    try {
        const res = await fetch(`/api/messages/?slug=${slug}`);
        if (res.ok) {
            const rawMessages: Message[] = await res.json();
            
            // Build tree
            const messageMap = new Map<string, Message>();
            rawMessages.forEach(m => {
                m.replies = [];
                messageMap.set(m.id, m);
            });
            
            const rootMessages: Message[] = [];
            rawMessages.forEach(m => {
                if (m.parentId && messageMap.has(m.parentId)) {
                    messageMap.get(m.parentId)!.replies!.push(m);
                } else {
                    rootMessages.push(m);
                }
            });
            
            // Sort root messages by newest first
            rootMessages.sort((a, b) => b.createdAt - a.createdAt);
            
            // Sort replies by oldest first (chronological conversation)
            rawMessages.forEach(m => {
                if (m.replies) {
                    m.replies.sort((a, b) => a.createdAt - b.createdAt);
                }
            });
            
            messages = rootMessages;
        }
    } catch (e) {
        console.error("Failed to fetch messages", e);
    } finally {
        loading = false;
    }
}

function handleSuccess(e: CustomEvent) {
    // Add the new message to the list or refresh
    // If it's a root message (no parentId), we can prepend it.
    // If it's a reply, it's complicated to update locally without re-fetching or traversing.
    // Re-fetching is safer and easier.
    
    // Show success toast
    showSuccess = true;
    setTimeout(() => {
        showSuccess = false;
    }, 3000);
    
    fetchMessages();
}

onMount(() => {
        // Delay fetch to avoid blocking initial render and interactions
        const timer = setTimeout(() => {
            fetchMessages();
        }, 100);
        return () => clearTimeout(timer);
    });
</script>

<div class="flex flex-col gap-8">
    <!-- Success Notification -->
    {#if showSuccess}
        <div class="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce-in">
            <Icon icon="fa6-solid:check" />
            <span>发送成功！</span>
        </div>
    {/if}

    <!-- Input Area -->
    <div class="card-base p-6 border border-neutral-100 dark:border-neutral-800">
        <div class="flex items-center gap-2 mb-4 font-bold text-lg text-neutral-900 dark:text-neutral-100">
            <Icon icon="fa6-solid:pen-to-square" class="text-[var(--primary)]" />
            留下你的足迹
        </div>
        
        <MessageEditor on:success={handleSuccess} {slug} />
    </div>

    <!-- Message List -->
    <div class="flex flex-col gap-4">
        {#if loading}
            <div class="flex justify-center py-10">
                <Icon icon="eos-icons:loading" class="text-3xl text-neutral-400" />
            </div>
        {:else if messages.length === 0}
            <div class="flex flex-col items-center justify-center py-10 text-neutral-400 gap-2">
                <Icon icon="fa6-solid:comment-slash" class="text-3xl" />
                <span>还没有留言，快来抢沙发吧！</span>
            </div>
        {:else}
            {#each messages as msg (msg.id)}
                <MessageItem message={msg} on:replySuccess={handleSuccess} {slug} />
            {/each}
        {/if}
    </div>
</div>

<style>
    .card-base {
        border-radius: var(--radius-large);
        background-color: var(--card-bg);
    }
    @keyframes bounce-in {
        0% { transform: translateY(-20px); opacity: 0; }
        50% { transform: translateY(5px); }
        100% { transform: translateY(0); opacity: 1; }
    }
    .animate-bounce-in {
        animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    /* Markdown Styles */
    :global(.markdown-content p) {
        margin-bottom: 0.5em;
    }
    :global(.markdown-content p:last-child) {
        margin-bottom: 0;
    }
    :global(.markdown-content a) {
        color: var(--primary);
        text-decoration: underline;
    }
    :global(.markdown-content ul), :global(.markdown-content ol) {
        margin-left: 1.5em;
        margin-bottom: 0.5em;
    }
    :global(.markdown-content ul) {
        list-style-type: disc;
    }
    :global(.markdown-content ol) {
        list-style-type: decimal;
    }
    :global(.markdown-content blockquote) {
        border-left: 3px solid var(--primary);
        padding-left: 1em;
        margin-left: 0;
        margin-bottom: 0.5em;
        color: #666;
    }
    :global(.dark .markdown-content blockquote) {
        color: #aaa;
    }
    :global(.markdown-content code) {
        background-color: rgba(0, 0, 0, 0.1);
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
    }
    :global(.dark .markdown-content code) {
        background-color: rgba(255, 255, 255, 0.1);
    }
    :global(.markdown-content pre) {
        background-color: #f5f5f5;
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: 0.5em;
    }
    :global(.dark .markdown-content pre) {
        background-color: #1a1a1a;
    }
    :global(.markdown-content pre code) {
        background-color: transparent;
        padding: 0;
    }
    :global(.markdown-content .spoiler) {
        background-color: #000;
        color: #000;
        padding: 0 4px;
        border-radius: 4px;
        cursor: pointer;
        transition: color 0.3s;
    }
    :global(.dark .markdown-content .spoiler) {
        background-color: #fff;
        color: #fff;
    }
    :global(.markdown-content .spoiler:hover) {
        color: #fff;
    }
    :global(.dark .markdown-content .spoiler:hover) {
        color: #000;
    }
</style>
```

</details>

<details>
<summary>src/components/MessageItem.svelte (留言项组件)</summary>

```svelte
<script context="module" lang="ts">
    import MarkdownIt from "markdown-it";
    import sanitizeHtml from "sanitize-html";

    const md = new MarkdownIt({
        html: true,
        breaks: true,
        linkify: true,
    });

    const sanitizeOptions = {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "details", "summary", "span", "h1", "h2"]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "title"],
            span: ["class"],
        },
        allowedClasses: {
            span: ["spoiler"],
        },
    };

    function renderContent(text: string) {
        // Process spoilers: ||text|| -> <span class="spoiler">text</span>
        const withSpoilers = text.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
        
        const rawHtml = md.render(withSpoilers);
        
        return sanitizeHtml(rawHtml, sanitizeOptions);
    }
</script>

<script lang="ts">
import Icon from "@iconify/svelte";
import type { Message } from "../types/message";
import MessageEditor from "./MessageEditor.svelte";
import { createEventDispatcher } from "svelte";

export let message: Message;
export let depth = 0;
export let slug = "message-board";

const dispatch = createEventDispatcher();
let showReply = false;

function timeAgo(timestamp: number) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "刚刚";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
}

function handleReplySuccess(e: CustomEvent) {
    showReply = false;
    dispatch("replySuccess", e.detail);
}
</script>

<div class="flex flex-col gap-4">
    <div class="card-base p-4 border border-neutral-100 dark:border-neutral-800 transition-all hover:shadow-md">
        <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0 mt-1">
                <img src={message.avatar} alt={message.nickname} class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                    <div class="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        {#if message.website}
                            <a href={message.website} target="_blank" rel="noopener noreferrer" class="hover:text-[var(--primary)] transition-colors flex items-center gap-1 group">
                                {message.nickname}
                                <Icon icon="fa6-solid:link" class="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" />
                            </a>
                        {:else}
                            {message.nickname}
                        {/if}
                        <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-200/50 dark:bg-neutral-700/50 text-neutral-500">
                            Lv.1
                        </span>
                    </div>
                    <div class="flex items-center gap-3">
                        {#if message.os || message.browser}
                            <div class="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400/80 bg-neutral-100 dark:bg-neutral-800/50 px-2 py-0.5 rounded-md mr-1">
                                {#if message.device}
                                    <span class="flex items-center gap-1">
                                        <Icon icon="fa6-solid:mobile" class="text-[10px]" />
                                        {message.device}
                                    </span>
                                {/if}
                                {#if message.os}
                                    <span class="flex items-center gap-1">
                                        {#if !message.device}
                                            <Icon icon="fa6-solid:laptop" class="text-[10px]" />
                                        {/if}
                                        {message.os}
                                    </span>
                                {/if}
                                {#if message.browser}
                                    <span class="flex items-center gap-1">
                                        <Icon icon="fa6-solid:globe" class="text-[10px]" />
                                        {message.browser}
                                    </span>
                                {/if}
                            </div>
                        {/if}
                        <div class="text-xs text-neutral-400">
                            {timeAgo(message.createdAt)}
                        </div>
                        <button 
                            class="text-xs text-neutral-400 hover:text-[var(--primary)] transition-colors flex items-center gap-1"
                            on:click={() => showReply = !showReply}
                        >
                            <Icon icon="fa6-solid:reply" />
                            {showReply ? '取消回复' : '回复'}
                        </button>
                    </div>
                </div>
                <div class="mt-2 text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed custom-md">
                    {@html renderContent(message.content)}
                </div>
                
                <!-- Reply Editor -->
                {#if showReply}
                    <div class="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 animate-fade-in">
                        <MessageEditor 
                            parentId={message.id} 
                            placeholder={`回复 @${message.nickname}...`}
                            autofocus={true}
                            on:success={handleReplySuccess}
                            {slug}
                        />
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Nested Replies -->
    {#if message.replies && message.replies.length > 0}
        <div class="flex flex-col gap-4 pl-8 border-l-2 border-neutral-100 dark:border-neutral-800 ml-4">
            {#each message.replies as reply (reply.id)}
                <svelte:self message={reply} depth={depth + 1} on:replySuccess {slug} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .card-base {
        border-radius: var(--radius-large);
        background-color: var(--card-bg);
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>
```

</details>

<details>
<summary>src/components/MessageEditor.svelte (编辑器组件)</summary>

```svelte
<script lang="ts">
import { onMount, createEventDispatcher } from "svelte";
import Icon from "@iconify/svelte";

export let parentId: string | undefined = undefined;
export let placeholder = "说点什么吧... (支持 Markdown 和 ||隐藏内容||)";
export let autofocus = false;
export let slug = "message-board";

const dispatch = createEventDispatcher();

let nickname = "";
let email = "";
let website = "";
let content = "";
let submitting = false;
let contentTextarea: HTMLTextAreaElement;

// Reactive avatar preview
$: avatarPreview = email && (email.match(/^\d{5,11}$/) || email.match(/^\d{5,11}@qq\.com$/))
    ? `https://q1.qlogo.cn/g?b=qq&nk=${email.replace(/@qq\.com$/, '')}&s=100`
    : `https://api.dicebear.com/7.x/identicon/svg?seed=${nickname || 'anonymous'}`;

onMount(() => {
    nickname = localStorage.getItem("message_nickname") || "";
    email = localStorage.getItem("message_email") || "";
    website = localStorage.getItem("message_website") || "";
    
    if (autofocus && contentTextarea) {
        contentTextarea.focus();
    }
});

$: if (typeof localStorage !== 'undefined') {
    if (nickname) localStorage.setItem("message_nickname", nickname);
    if (email) localStorage.setItem("message_email", email);
    if (website) localStorage.setItem("message_website", website);
}

async function handleSubmit() {
    if (!nickname.trim() || !content.trim()) return;
    submitting = true;
    try {
        const res = await fetch("/api/messages/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nickname,
                content,
                email,
                website,
                parentId,
                slug
            }),
        });

        const data = await res.json();
        if (res.ok) {
            content = ""; // Clear content
            dispatch("success", data);
        } else {
            alert(data.error || "发送失败，请重试");
        }
    } catch (e) {
        console.error("Failed to post message", e);
        alert("发送失败，请检查网络连接");
    } finally {
        submitting = false;
    }
}
</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
        <div class="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-sm self-start">
            <img 
                src={avatarPreview} 
                alt="Avatar" 
                class="w-full h-full object-cover transition-all duration-500"
            />
        </div>
        <div class="flex-1 flex flex-col gap-3">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input 
                    type="text" 
                    bind:value={nickname}
                    placeholder="昵称 (必填)"
                    class="w-full px-4 py-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white dark:focus:bg-black transition-all text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                    maxlength="20"
                />
                <input 
                    type="text" 
                    bind:value={email}
                    placeholder="QQ号 / 邮箱 (可选)"
                    class="w-full px-4 py-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white dark:focus:bg-black transition-all text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                    maxlength="50"
                />
                <input 
                    type="text" 
                    bind:value={website}
                    placeholder="个人网站 (可选)"
                    class="w-full px-4 py-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white dark:focus:bg-black transition-all text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                    maxlength="100"
                />
            </div>
            <textarea 
                bind:this={contentTextarea}
                bind:value={content}
                {placeholder}
                rows="3"
                class="w-full px-4 py-2 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-white dark:focus:bg-black transition-all resize-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                maxlength="500"
            ></textarea>
        </div>
    </div>
    
    <div class="flex justify-end">
        <button 
            on:click={handleSubmit}
            disabled={submitting || !nickname || !content}
            class="btn-primary px-6 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {#if submitting}
                <Icon icon="eos-icons:loading" />
                <span>发送中...</span>
            {:else}
                <Icon icon="fa6-solid:paper-plane" />
                <span>发送</span>
            {/if}
        </button>
    </div>
</div>

<style>
    .btn-primary {
        background-color: var(--primary);
        color: white;
    }
    .btn-primary:hover {
        background-color: var(--primary-hover);
    }
</style>
```

</details>

