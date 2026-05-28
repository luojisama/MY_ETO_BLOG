import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  readingTime?: number; // minutes
  /** Cover image — relative to /public or full URL. Shown on /posts list + post header. */
  cover?: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
  rawContent: string;
}

/** Estimate reading time (350 chars/min for mixed Chinese/English) */
export function estimateReadingTime(content: string): number {
  const chars = content.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 350));
}

// ─── GitHub Card ────────────────────────────────────────────────────────────

interface GitHubCardData {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  owner: { login: string; avatar_url: string };
}

/** Module-level cache so multiple posts in one build share fetched data */
const githubCache = new Map<string, GitHubCardData | null>();

async function fetchGitHubCard(repo: string): Promise<GitHubCardData | null> {
  if (githubCache.has(repo)) return githubCache.get(repo)!;
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    // Set GITHUB_TOKEN env var to raise the rate limit from 60 to 5000 req/hr
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[github-card] ${repo}: ${res.status} ${res.statusText}`);
      githubCache.set(repo, null);
      return null;
    }
    const data = (await res.json()) as GitHubCardData;
    githubCache.set(repo, data);
    return data;
  } catch (err) {
    console.warn(`[github-card] ${repo}:`, err instanceof Error ? err.message : err);
    githubCache.set(repo, null);
    return null;
  }
}

/** Card without API data — uses GitHub's URL-based avatar, no rate limit */
function renderGitHubCardOffline(repo: string): string {
  const [owner] = repo.split("/");
  return (
    `<div class="github-card github-card-offline">` +
    `<a href="https://github.com/${repo}" target="_blank" rel="noopener noreferrer" class="gh-link">` +
    `<div class="gh-header">` +
    `<img src="https://github.com/${owner}.png?size=40" alt="" class="gh-avatar" width="20" height="20" />` +
    `<span class="gh-name">${repo}</span>` +
    `<span class="gh-stars">github.com ↗</span>` +
    `</div></a></div>`
  );
}

function renderGitHubCard(data: GitHubCardData): string {
  const lang = data.language
    ? `<span class="gh-lang">${data.language}</span>`
    : "";
  const desc = data.description
    ? `<p class="gh-desc">${data.description}</p>`
    : "";
  const stars = data.stargazers_count.toLocaleString("en");
  return (
    `<div class="github-card">` +
    `<a href="${data.html_url}" target="_blank" rel="noopener noreferrer" class="gh-link">` +
    `<div class="gh-header">` +
    `<img src="${data.owner.avatar_url.includes("?") ? data.owner.avatar_url + "&s=40" : data.owner.avatar_url + "?s=40"}" alt="" class="gh-avatar" width="20" height="20" />` +
    `<span class="gh-name">${data.full_name}</span>` +
    `<span class="gh-stars">★ ${stars}</span>` +
    `</div>` +
    `${desc}` +
    `<div class="gh-meta">${lang}</div>` +
    `</a></div>`
  );
}

// ─── Video Embeds ────────────────────────────────────────────────────────────

function extractYouTubeId(input: string): string {
  const s = input.trim();
  // Bare video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : s;
}

function renderYouTubeEmbed(input: string): string {
  const id = extractYouTubeId(input);
  return (
    `<div class="video-embed">` +
    `<iframe src="https://www.youtube.com/embed/${id}?rel=0" title="YouTube video" ` +
    `frameborder="0" allowfullscreen loading="lazy"></iframe></div>`
  );
}

function extractBilibiliId(input: string): string {
  const m = input.match(/(BV[a-zA-Z0-9]+)/);
  return m ? m[1] : input.trim();
}

function renderBilibiliEmbed(input: string): string {
  const bvid = extractBilibiliId(input);
  return (
    `<div class="video-embed">` +
    `<iframe src="https://player.bilibili.com/player.html?bvid=${bvid}&page=1&as_wide=1&high_quality=1&danmaku=0" ` +
    `title="Bilibili video" frameborder="0" allowfullscreen loading="lazy" scrolling="no"></iframe></div>`
  );
}

// ─── Markdown Preprocessor ───────────────────────────────────────────────────
// Converts ```github / ```youtube / ```bilibili fenced blocks to raw HTML
// BEFORE the unified pipeline so rehype-raw can parse them into the HAST.

const CUSTOM_BLOCK_RE = /^```(github|youtube|bilibili)\r?\n([\s\S]*?)\r?\n```$/gm;
// Protect blocks inside 4+ backtick fences (e.g. syntax-showing code blocks in docs)
const LONG_FENCE_RE = /^(`{4,})[^\r\n]*\r?\n[\s\S]*?\r?\n\1$/gm;

async function preprocessMarkdown(content: string): Promise<string> {
  // Step 1: protect any 4+ backtick fenced blocks so their content is not matched
  const sheltered: string[] = [];
  const shielded = content.replace(LONG_FENCE_RE, (match) => {
    sheltered.push(match);
    return `\0FENCE${sheltered.length - 1}\0`;
  });

  // Collect GitHub repos so we can prefetch them all in parallel
  const repos: string[] = [];
  let m: RegExpExecArray | null;
  CUSTOM_BLOCK_RE.lastIndex = 0;
  while ((m = CUSTOM_BLOCK_RE.exec(shielded)) !== null) {
    if (m[1] === "github") repos.push(m[2].trim());
  }
  CUSTOM_BLOCK_RE.lastIndex = 0;

  if (repos.length) await Promise.all(repos.map(fetchGitHubCard));

  // Step 2: replace custom blocks
  const replaced = shielded.replace(CUSTOM_BLOCK_RE, (_, lang: string, body: string) => {
    const trimmed = body.trim();
    // Wrap with blank lines so remark treats the HTML as a block element
    switch (lang) {
      case "github": {
        const data = githubCache.get(trimmed);
        const html = data ? renderGitHubCard(data) : renderGitHubCardOffline(trimmed);
        return `\n\n${html}\n\n`;
      }
      case "youtube":
        return `\n\n${renderYouTubeEmbed(trimmed)}\n\n`;
      case "bilibili":
        return `\n\n${renderBilibiliEmbed(trimmed)}\n\n`;
      default:
        return `\`\`\`${lang}\n${body}\n\`\`\``;
    }
  });

  // Step 3: restore protected 4+ backtick blocks
  return replaced.replace(/\0FENCE(\d+)\0/g, (_, idx) => sheltered[Number(idx)]);
}

// ─── Rehype Figure Plugin ─────────────────────────────────────────────────────
// Wraps <img alt="caption"> in <figure class="article-figure"><figcaption>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any;

function rehypeFigure() {
  return function (tree: AnyNode) {
    function walk(node: AnyNode) {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i] as AnyNode;
        if (child.tagName === "img" && child.properties?.alt) {
          node.children[i] = {
            type: "element",
            tagName: "figure",
            properties: { className: ["article-figure"] },
            children: [
              child,
              {
                type: "element",
                tagName: "figcaption",
                properties: {},
                children: [{ type: "text", value: child.properties.alt as string }],
              },
            ],
          };
        } else {
          walk(child);
        }
      }
    }
    walk(tree);
  };
}

// ─── Unified Pipeline ────────────────────────────────────────────────────────

async function processMarkdown(content: string): Promise<string> {
  const preprocessed = await preprocessMarkdown(content);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (unified() as any)
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeFigure)
    .use(rehypeStringify)
    .process(preprocessed);
  return result.toString();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Normalize frontmatter date to "YYYY-MM-DD" string (gray-matter may parse bare dates as Date objects) */
function normalizeDate(raw: unknown): string {
  if (!raw) return "";
  if (raw instanceof Date) {
    // ISO date in local-ish format; use UTC parts to avoid timezone drift
    const y = raw.getUTCFullYear();
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0");
    const d = String(raw.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(raw);
}

/** Pick cover URL — accepts either `cover` or fuwari-style `image` frontmatter key, ignores empty strings. */
function pickCover(data: Record<string, unknown>): string | undefined {
  const raw = data.cover ?? data.image;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((n) => n.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(postsDirectory, fileName), "utf8")
      );
      return {
        slug,
        title: data.title || slug,
        date: normalizeDate(data.date),
        description: data.description || "",
        tags: data.tags || [],
        readingTime: estimateReadingTime(content),
        cover: pickCover(data),
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));
  return {
    slug,
    title: data.title || slug,
    date: normalizeDate(data.date),
    description: data.description || "",
    tags: data.tags || [],
    readingTime: estimateReadingTime(content),
    cover: pickCover(data),
    contentHtml: await processMarkdown(content),
    rawContent: content,
  };
}

export function getPostsByYear(): Record<string, PostMeta[]> {
  const byYear: Record<string, PostMeta[]> = {};
  for (const p of getAllPosts()) {
    const y = p.date ? p.date.slice(0, 4) : "未知";
    (byYear[y] ??= []).push(p);
  }
  return byYear;
}

export function searchPosts(query: string): PostMeta[] {
  if (!query.trim() || !fs.existsSync(postsDirectory)) return [];
  const q = query.toLowerCase();
  return fs
    .readdirSync(postsDirectory)
    .filter((n) => n.endsWith(".md"))
    .flatMap((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(postsDirectory, fileName), "utf8")
      );
      const hay = `${data.title ?? ""} ${data.description ?? ""} ${content}`.toLowerCase();
      return hay.includes(q)
        ? [
            {
              slug,
              title: data.title || slug,
              date: normalizeDate(data.date),
              description: data.description || "",
              tags: data.tags || [],
              readingTime: estimateReadingTime(content),
              cover: pickCover(data),
            },
          ]
        : [];
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllTags(): { tag: string; count: number }[] {
  const map: Record<string, number> = {};
  for (const p of getAllPosts()) {
    for (const t of p.tags ?? []) map[t] = (map[t] ?? 0) + 1;
  }
  return Object.entries(map)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
