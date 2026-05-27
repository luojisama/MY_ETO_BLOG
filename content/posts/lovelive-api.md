---
title: LoveLive 聚合 API 介绍
date: 2026-05-04
description: 一个跑在 Cloudflare Workers 上的 LoveLive 聚合 API，提供角色、生日、活动、音乐等查询接口
image: ""
tags: ["LoveLive", "Cloudflare Workers", "API", "TypeScript"]
category: 项目分享

---

> API 在线地址：<a href="http://llapi.shiro.team/" target="_blank"><http://llapi.shiro.team/></a>\
> 前端演示页（可视化测试所有接口）：[LoveLive 聚合 API · 演示](https://lad.shiro.team/)

# 这是个什么项目

最近写 bot 插件的时候，发现 LoveLive 系列的角色、生日、活动、音乐这些数据散落在很多个站点上。每次要用就得再写一遍爬虫，重复劳动。\
索性把它整合成一个统一的 API，部署到 Cloudflare Workers 上。这样以后不管是给 bot 用还是给前端用，都只需要打一个域名，拿到结构一致的 JSON 即可。

项目特点：

- **零服务器**：跑在 Cloudflare Workers，全球边缘节点，免费额度足够日常使用。
- **统一响应格式**：所有成功响应都是 `{ data, meta }`，错误是 `{ error: { code, message } }`。
- **聚合多个数据源**：角色用萌娘百科，活动用官方日程 + LL-CH，音乐用各企划官方 release 页。
- **KV 缓存**：上游接口不快，所以全部接口结果都落到 Cloudflare KV 缓存里。
- **本地 fixture 模式**：本地开发不依赖远程站点，跑测试很稳定。

# 技术栈

- **运行时**：Cloudflare Workers
- **框架**：[Hono](https://hono.dev/) （轻量、为 Workers/Edge 优化）
- **语言**：TypeScript
- **缓存**：Cloudflare KV
- **测试**：Vitest
- **包管理**：pnpm

整个 `dependencies` 只有一个 `hono`，devDependencies 也只有 wrangler、vitest、typescript 这几样，非常干净。

# 接口速览

| 接口                        | 用途                     |
| ------------------------- | ---------------------- |
| `GET /v1/characters`      | 查角色、生日、印象色、头像          |
| `GET /v1/characters/:id`  | 查单个角色详情                |
| `GET /v1/birthdays/today` | 查今天生日的角色               |
| `GET /v1/events`          | 查官方/补充源聚合活动            |
| `GET /v1/events/:id`      | 查单个活动详情                |
| `GET /v1/music`           | 查官方音乐、封面、发售日           |
| `GET /v1/music/:id`       | 查单首歌详情                 |
| `GET /v1/cards/random`    | 预留 SIF/SIFAS/SIF2 随机卡面 |

成功响应统一格式：

```json
{ "data": {}, "meta": {} }
```

错误响应统一格式：

```json
{ "error": { "code": "ERROR_CODE", "message": "错误说明" } }
```

# 角色相关

## 列表与筛选

`GET /v1/characters` 默认返回所有角色的规范化资料，包括中文名、日文名、英文名、所属团体、所属企划、生日、印象色、头像。\
常用查询参数：

- `group`：按团体或企划筛选，例如 `Liella!`、`μ's`、`莲之空女学院学园偶像俱乐部`。
- `q`：按名字模糊查询，中日英都行，例如 `香音`、`maki`。
- `birthdayMonth`：按生日月份筛选，取值 `1` 到 `12`。

例：

```text
http://llapi.shiro.team/v1/characters?q=香音
```

## 单个角色

`GET /v1/characters/:id` 用稳定 id 查单个角色，例如 `kanon-shibuya`、`maki-nishikino`。

返回里有三个图片字段：

- `avatarUrl`：萌娘百科角色页立绘或主要角色图。
- `avatarIconUrl`：萌娘百科 `Name_*_icon*.png` 系列头像小图，适合做列表、bot 消息卡片。
- `avatarIconFilename`：头像小图原始文件名，方便缓存或排查来源。

响应示例：

```json
{
  "data": {
    "id": "kanon-shibuya",
    "names": { "zhHans": "涩谷香音", "ja": "澁谷かのん" },
    "avatarUrl": "https://storage.moegirl.org.cn/moegirl/commons/3/34/...",
    "avatarIconUrl": "https://storage.moegirl.org.cn/moegirl/commons/2/2e/Name_kanon_icon.png!/fw/80?v=20200804045109",
    "avatarIconFilename": "Name_kanon_icon.png"
  },
  "meta": {}
}
```

## 今日生日

`GET /v1/birthdays/today` 用来查指定时区当天过生日的角色。\
查询参数 `tz` 是 IANA 时区名，默认 `Asia/Shanghai`。如果 `tz` 不是有效时区，返回 `400 INVALID_TIMEZONE`。

bot 里写一个每天 0 点的定时任务调用这个接口就能自动发生日提醒。

# 活动相关

`GET /v1/events` 是个聚合接口，会从多个来源拉数据，去重后按开始时间升序返回。\
支持的查询参数：

- `from` / `to`：起止时间，支持 `YYYY-MM-DD` 或完整 ISO 时间。
- `series`：按企划/团体筛选，例如 `Liella`、`蓮ノ空`、`虹ヶ咲`。
- `category`：活动类型，常用 `live`、`stream`、`event`。
- `source`：按来源筛选。

数据源说明：

- `official-schedule` / `official-news`：LoveLive 官方日程和新闻。
- `llch-timeline`：来自 `ll-ch.com/timeline.html`，覆盖近期线上直播、演唱会、FMT、生放送等。
- `llch-cvtochina`：来自 `ll-ch.com/main/cvtochina/`，覆盖声优近期访华活动。
- `rsshub`：结构化 fallback，建议生产环境接自建 RSSHub。

活动字段保留来源时区偏移，不会强行转成 UTC，方便前端按需展示。

# 音乐相关

`GET /v1/music` 返回的每条数据是 **一首歌**，不是一张 CD，字段保持简单：

- `title`：歌名。
- `artist`：演唱者，能解析到单曲演唱者时优先使用单曲演唱者。
- `series`：所属企划或团体。
- `albumTitle` / `albumType`：所属专辑、单曲或音乐商品名。
- `coverUrl`：官方封面图。
- `releaseDate`：发售日期，格式 `YYYY-MM-DD`。
- `sourceUrl`：官方音乐详情页。

`q` 参数支持按歌名、中文常用译名、专辑名、演唱者模糊查询，例如：

```text
http://llapi.shiro.team/v1/music?q=爱上你万岁
http://llapi.shiro.team/v1/music?q=愛してるばんざーい
http://llapi.shiro.team/v1/music?q=Aspire
http://llapi.shiro.team/v1/music?series=蓮ノ空&from=2025-01-01
```

目前已接入：μ's 音乃木坂、Aqours 浦之星、虹咲、Liella!、蓮ノ空 五个企划的官方音乐页。\
旧站页面没有单曲详情页时，`sourceUrl` 会指向官方 CD 列表页的锚点，例如 `release.php#cd89`。

# 卡面接口（预留）

`GET /v1/cards/random` 这个接口在 `0.1` 版本只预留了形状，没接稳定的卡面源。\
未接入的游戏返回 `501 NOT_IMPLEMENTED`，不会返回伪造数据。

查询参数：

- `game`：必填，取值 `sif`、`sifas`、`sif2`。
- `character`：预留，按角色筛选。
- `rarity`：预留，按稀有度筛选。

候选源：

- SIF：School Idol Tomodachi
- SIFAS / SIF2：Idol Story

# 本地开发

```bash
pnpm install
pnpm dev
pnpm smoke:local
```

本地默认走 `UPSTREAM_MODE=fixture`，意思是不打远程站点，只用仓库里的固定测试数据。这样写测试不会因为上游波动而 flaky。

如果需要验证真实上游解析，加 `:live`：

```bash
pnpm dev:live
```

Wrangler 会在本地模拟 Cloudflare KV 绑定。需要预填本地 KV 的话：

```bash
pnpm seed:local
```

# 部署到 Cloudflare

## 控制台 Git 集成

可以直接在 Workers 控制台里选这个 GitHub 仓库部署，建议这样填：

- Framework preset：`None`
- Build command：留空
- Deploy command：`pnpm deploy`
- Root directory：留空

注意 **不要用** 默认的 `npx wrangler deploy` 作为正式部署命令。它能部署 API，但不会自动创建生产 KV，会报 `KV namespace 'local_lovelive_api_cache' is not valid`。\
`pnpm deploy` 会自动创建或复用 `lovelive-api-production-cache`，并用 `production` 环境发布。

## 本机一键部署

```bash
pnpm deploy:cf
```

这一条命令会：

- 检查 Wrangler 登录状态，没登录就跑 `wrangler login`。
- 创建或复用生产环境 KV namespace。
- 把生产 KV namespace ID 写入 `wrangler.toml`。
- 跑 `typecheck` 和测试。
- 执行 `wrangler deploy --env production`。

如果只想快速部署，跳过本地检查：

```bash
pnpm deploy
```

如果希望部署前同时核对线上数据源和头像 URL：

```bash
pnpm deploy:cf -- --with-data-checks
```

# 常用请求

```text
http://llapi.shiro.team/v1/characters?q=香音
http://llapi.shiro.team/v1/characters/kanon-shibuya
http://llapi.shiro.team/v1/birthdays/today?tz=Asia/Shanghai
http://llapi.shiro.team/v1/events?from=2026-05-01&to=2026-05-31
http://llapi.shiro.team/v1/events?category=live
http://llapi.shiro.team/v1/events?source=llch-timeline&category=live
http://llapi.shiro.team/v1/music?q=Aspire
http://llapi.shiro.team/v1/music?series=蓮ノ空&from=2025-01-01
http://llapi.shiro.team/v1/cards/random?game=sif2
```

# 在线演示页

为了让接口效果一眼能看见，我顺手做了个演示前端，部署在 Vercel：[LoveLive 聚合 API · 演示](https://lad.shiro.team/)

- **源码目录**：`lovelive-api-demo`
- **技术栈**：Next.js 16 (App Router) + React 19 + Tailwind 4 + next-themes
- **特色**：左侧选接口，右侧填参数，所有参数都能自定义输入；响应支持「卡片视图」与「原始 JSON」切换；自带主题切换。

## 前端怎么解决跨域和 mixed content

API 跑在 Cloudflare Workers，没设 CORS 头，且暴露的是 HTTP 域名。前端如果直接 fetch 会有两个问题：

1. **Mixed content**：Vercel 站点是 HTTPS，HTTPS 页面不能 fetch HTTP 资源。
2. **CORS**：跨域请求会被浏览器拦截。

最稳的做法是在前端项目里加一个 Edge Function 做反向代理，把所有 `/api/v1/*` 请求转发到上游：

```ts
// app/api/v1/[...path]/route.ts
export const runtime = "edge";
const UPSTREAM = process.env.LOVELIVE_API_BASE ?? "http://llapi.shiro.team";

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const target = `${UPSTREAM}/v1/${path.join("/")}${req.nextUrl.search}`;
  const upstream = await fetch(target, { cache: "no-store" });
  const body = await upstream.text();
  return new Response(body, { status: upstream.status });
}
```

这样浏览器只需访问同源的 `/api/v1/characters`，由 Vercel 代理到 `http://llapi.shiro.team/v1/characters`，CORS 和 mixed content 一并解决。

## 表单是数据驱动的

8 个接口的参数表单写起来挺啰嗦的，所以我把所有接口元数据集中到一个 `endpoints.ts` 文件里：

```ts
{
  id: "music-list",
  label: "歌曲列表",
  pathTemplate: "/v1/music",
  description: "按歌名、专辑、演唱者、发售日筛选官方歌曲。",
  resultKind: "music",
  queryParams: [
    { name: "q", label: "歌名/译名/演唱者", placeholder: "例如：Aspire / 爱上你万岁" },
    { name: "series", label: "企划/团体", type: "select", options: SERIES_OPTIONS },
    { name: "from", label: "发售起始", type: "date" },
    { name: "to", label: "发售结束", type: "date" },
    // ...
  ],
}
```

`EndpointForm` 组件根据 `pathParams` 和 `queryParams` 自动渲染输入框，select / text / date 三种类型自动切换。新增接口时只需要加一条配置，不用动 UI。

## 部署

直接在 Vercel 控制台导入这个仓库，框架会自动识别为 Next.js，无需额外配置。可选环境变量：

```text
LOVELIVE_API_BASE=http://llapi.shiro.team   # 默认值，要换上游就改这个
```

# 数据源汇总

- **角色资料、生日、头像**：萌娘百科角色页。
- **头像小图**：萌娘百科 `Name_*_icon*.png` 文件，参考 `lovelive_schedule` 插件的 `avatar_filename` / `avatar_url` 做法。
- **活动**：LoveLive 官方日程和新闻、LL-CH 近期线上活动时间线、LL-CH 声优访华活动页，RSSHub 路由作为备用结构化源。
- **音乐**：μ's 音乃木坂官方 release 页、Aqours 浦之星官方 CD 页、虹咲官方 CD 页、Liella! 官方音乐页、蓮ノ空官方音乐页。
- **SIF 卡面候选源**：School Idol Tomodachi。
- **SIFAS / SIF2 卡面候选源**：Idol Story。

# 结语

这个项目本来是给自家 bot 用的，后来发现做成开放接口对其他 LoveLive 相关的小工具也挺有帮助。\
顺手做了个 Vercel 上的演示页面，想看接口效果直接打开即可，所有参数都能自定义输入。\
后续会继续完善卡面接口，并把活动数据源做得更稳定一些。如果你也在写 LoveLive 相关的小项目，欢迎直接调用，或者 fork 一份自己部署。

