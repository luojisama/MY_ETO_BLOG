/**
 * ── 站点配置（唯一入口）───────────────────────────────────────────────────────
 *
 * 全站所有需要修改的「内容」都在这一个文件里。
 * 部署相关的「凭证」（API Key、SMTP 密码等）放在 `.env.local`。
 *
 * 修改本文件后保存即生效（dev 模式热更新；生产环境需重新构建）。
 */

// ── 站点基本信息 ──────────────────────────────────────────────────────────────

/** 站点标题 — 浏览器标签页 / Footer / 友链页 self 卡片 */
export const SITE_TITLE = "白咲のblog";

/** 站点描述 — <meta description> / 首页副标题 / 友链页 self 卡片 */
export const SITE_DESCRIPTION = "歇斯底里是崩溃，底里歇斯是美味";

/** 完整域名（含协议，结尾不带 /） — 友链页 self 卡片 / 邮件中的链接 */
export const SITE_URL = "https://blog.shiro.team";

/** 建站日期（YYYY-MM-DD）— Footer 运行时间从这里开始计时 */
export const SITE_START = "2025-05-27";

/** 导航栏左上角 logo 文字 */
export const NAV_BRAND = "白咲";

// ── 首页 Hero 标语 ────────────────────────────────────────────────────────────

/** 首页中央的标语全文 */
export const SLOGAN = "歇斯底里是崩溃，底里歇斯是美味";

/**
 * 红字候选池 — 标语中可被染红的字符集合。
 * 每次刷新页面，会从标语中找出所有「在候选池里出现过」的字符位置，
 * 然后随机抽 SLOGAN_RED_COUNT 个位置染红。
 *
 * 例：候选池 = "歇斯底里美味"，标语里的「歇/斯/底/里/美/味」字位都可能被染红。
 */
export const SLOGAN_RED_POOL = "歇斯底里美味";

/** 每次随机染红几个字 */
export const SLOGAN_RED_COUNT = 3;

// ── 博主信息 ──────────────────────────────────────────────────────────────────

/** About 页显示的姓名 */
export const OWNER_NAME = "白咲雫";

/** About 页简介（`\n` 渲染为换行） */
export const OWNER_BIO = `很高兴你能来了解我，我叫白咲雫，你也可以叫我罗稽，红毛。
2007年出生于中国的一个边境小城。

目前昆明某民办五年制非全日制大专在读，目前目标是自考本科与软考中级软件设计师。
文章中经常出现几个编程语言刚过基础的就断了，大专所教的就是这样，广而不精。

我感兴趣的东西：
- 偶尔观看电竞赛事
- 长假会出远门
- 喜欢看生物、医学、化学一类的视频
- 喜欢打游戏，尤其是 CS
- 喜欢折腾硬件，自己 DIY
- 隔一段时间会猛补番
- 会折腾一些有用没用的小玩意`;

/** 头像路径（相对 public/ 或完整 URL） */
export const OWNER_AVATAR = "/avatar.png";

// ── 平台链接（About 页 + 友链页） ──────────────────────────────────────────────

/** GitHub 用户名（同时用于 About 页 GitHub 动态拉取） */
export const GITHUB_USERNAME = "luojisama";

export const OWNER_GITHUB = `https://github.com/${GITHUB_USERNAME}`;
export const OWNER_TWITTER = "https://x.com/shizuku__191981";
export const OWNER_EMAIL = "mailto:your@email.com";

/** 平台链接图标类型 — 对应 PlatformIcon 组件可渲染的图标 */
export type OwnerLinkIcon =
  | "github"
  | "twitter"
  | "email"
  | "rss"
  | "steam"
  | "qq"
  | "bilibili";

export interface OwnerLink {
  label: string;
  href: string;
  icon: OwnerLinkIcon;
}

/**
 * About 页 / Footer 显示的平台链接列表（来自 fuwari 配置，已去掉「行程」）。
 */
export const OWNER_LINKS: OwnerLink[] = [
  { label: "GitHub", href: OWNER_GITHUB, icon: "github" },
  { label: "Twitter / X", href: OWNER_TWITTER, icon: "twitter" },
  { label: "Steam", href: "https://steamcommunity.com/id/shirosakishizuku/", icon: "steam" },
  { label: "QQ", href: "https://qm.qq.com/q/BdkE3VO22s", icon: "qq" },
  { label: "BiliBili", href: "https://space.bilibili.com/187685621", icon: "bilibili" },
  { label: "Email", href: OWNER_EMAIL, icon: "email" },
  { label: "RSS", href: "/rss.xml", icon: "rss" },
];

// ── GitHub 动态（About 页）────────────────────────────────────────────────────
// 只填上面 GITHUB_USERNAME 即可显示最近 6 个仓库。
// 要看到「年贡献数」需在 .env.local 里设置 GITHUB_TOKEN。

// ── Steam 展示（About 页，默认隐藏） ──────────────────────────────────────────
/**
 * Steam 标识符 — 留空则不显示 Steam 区块。四种格式都支持：
 *   · 17 位 SteamID64：              `76561198000000000`
 *   · 自定义 vanity URL 名：          `myusername`
 *   · 完整主页链接 (id)：             `https://steamcommunity.com/id/myusername`
 *   · 完整主页链接 (profiles)：       `https://steamcommunity.com/profiles/7656119...`
 * 同时需在 .env.local 设置 STEAM_API_KEY（https://steamcommunity.com/dev/apikey）。
 */
export const STEAM_INPUT = "https://steamcommunity.com/id/shirosakishizuku/";

// ── 技术栈列表（About 页底部） ────────────────────────────────────────────────

export const TECH_STACK = [
  "Next.js 16 (App Router)",
  "TypeScript",
  "Tailwind CSS v4",
  "Markdown / gray-matter",
  "Vercel KV / Redis",
];
