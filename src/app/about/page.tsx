import type { Metadata } from "next";
import Link from "next/link";
import SteamWidget, { type SteamProfile } from "@/components/SteamWidget";
import {
  GITHUB_USERNAME,
  STEAM_INPUT,
  OWNER_NAME,
  OWNER_BIO,
  OWNER_AVATAR,
  OWNER_LINKS,
  TECH_STACK,
} from "@/config/site";
import PlatformIcon from "@/components/PlatformIcon";

export const metadata: Metadata = { title: "关于" };

// ISR: 每 12 小时重新拉取 GitHub / Steam 数据
export const revalidate = 43200;

// ─── GitHub ───────────────────────────────────────────────────────────────────

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  private: boolean;
}

async function fetchGitHubActivity(username: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Recent repos (public, non-fork)
  let repos: GitHubRepo[] = [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=12&type=owner`,
      { headers, next: { revalidate: 43200 } }
    );
    if (res.ok) {
      const all: GitHubRepo[] = await res.json();
      repos = all.filter((r) => !r.fork && !r.private).slice(0, 6);
    }
  } catch { /* ignore */ }

  // Yearly commit contributions (requires GITHUB_TOKEN)
  let yearCommits: number | null = null;
  if (process.env.GITHUB_TOKEN) {
    try {
      const now = new Date();
      const from = new Date(
        Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate())
      ).toISOString();
      const to = now.toISOString();
      const gql = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query($login:String!,$from:DateTime!,$to:DateTime!){
            user(login:$login){
              contributionsCollection(from:$from,to:$to){
                totalCommitContributions
                totalPullRequestContributions
                totalIssueContributions
              }
            }
          }`,
          variables: { login: username, from, to },
        }),
        next: { revalidate: 43200 },
      });
      if (gql.ok) {
        const body = await gql.json();
        const cc = body?.data?.user?.contributionsCollection;
        if (cc) {
          yearCommits =
            (cc.totalCommitContributions ?? 0) +
            (cc.totalPullRequestContributions ?? 0) +
            (cc.totalIssueContributions ?? 0);
        }
      }
    } catch { /* ignore */ }
  }

  return { repos, yearCommits };
}

// ─── Steam ─────────────────────────────────────────────────────────────────────

async function resolveSteamId(input: string, key: string): Promise<string | null> {
  const s = input.trim();
  // 17-digit SteamID64
  if (/^\d{17}$/.test(s)) return s;
  // Full profile URL with steamid64
  const idMatch = s.match(/\/profiles\/(\d{17})/);
  if (idMatch) return idMatch[1];
  // Full profile URL with vanity
  const vanityMatch = s.match(/\/id\/([^/?#]+)/);
  const vanity = vanityMatch ? vanityMatch[1] : s;
  // Resolve vanity → steamid64
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${key}&vanityurl=${encodeURIComponent(vanity)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.response?.success === 1 ? (data.response.steamid as string) : null;
  } catch {
    return null;
  }
}

async function fetchSteamProfile(input: string): Promise<SteamProfile | null> {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey || !input.trim()) return null;
  try {
    const steamid = await resolveSteamId(input, apiKey);
    if (!steamid) return null;

    // Player summary
    const summaryRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamid}`,
      { next: { revalidate: 43200 } }
    );
    if (!summaryRes.ok) return null;
    const summaryData = await summaryRes.json();
    const player = summaryData?.response?.players?.[0];
    if (!player) return null;

    // Game count
    let gameCount: number | undefined;
    try {
      const gamesRes = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamid}`,
        { next: { revalidate: 43200 } }
      );
      if (gamesRes.ok) {
        const gamesData = await gamesRes.json();
        gameCount = gamesData?.response?.game_count;
      }
    } catch { /* ignore */ }

    return {
      personaname: player.personaname,
      avatarfull: player.avatarfull,
      profileurl: player.profileurl,
      personastate: player.personastate,
      gameextrainfo: player.gameextrainfo,
      loccountrycode: player.loccountrycode,
      gameCount,
    };
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "今天";
  if (d < 30) return `${d} 天前`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} 个月前`;
  return `${Math.floor(m / 12)} 年前`;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", "C++": "#f34b7d", C: "#555555",
  Java: "#b07219", Kotlin: "#A97BFF", Swift: "#F05138",
  Vue: "#41B883", CSS: "#563d7c", HTML: "#e34c26",
  Shell: "#89e051", MDX: "#1B1F24",
};

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "var(--color-text-faint)") : null;
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 transition-all duration-300"
      style={{
        border: "1px solid var(--color-frame-idle)",
        background: "rgba(255,255,255,0.01)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="group-hover:text-white transition-colors duration-300"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "15px",
            color: "var(--color-text)",
            fontWeight: 600,
            letterSpacing: "0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {repo.name}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "13px",
            color: "var(--color-text-faint)",
            flexShrink: 0,
            letterSpacing: "0.03em",
          }}
        >
          ★ {repo.stargazers_count.toLocaleString("en")}
        </span>
      </div>

      {repo.description && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text-faint)",
            lineHeight: "1.7",
            marginBottom: "10px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {repo.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        {langColor && repo.language ? (
          <span className="flex items-center gap-1.5" style={{ fontSize: "12px", color: "var(--color-text-faint)", fontFamily: "var(--font-mono), monospace" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: langColor, display: "inline-block", flexShrink: 0 }} />
            {repo.language}
          </span>
        ) : <span />}
        <span style={{ fontSize: "11px", color: "var(--color-text-faint)", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.04em" }}>
          {timeAgo(repo.pushed_at)}
        </span>
      </div>
    </a>
  );
}

// Platform link list now comes from OWNER_LINKS in src/config/site.ts

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const [github, steam] = await Promise.all([
    fetchGitHubActivity(GITHUB_USERNAME),
    fetchSteamProfile(STEAM_INPUT),
  ]);

  const { repos, yearCommits } = github;
  const bioLines = OWNER_BIO.split("\n");

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-6 pt-36 pb-20">

      {/* Page title */}
      <h1
        className="text-center animate-fade-in-up"
        style={{
          fontFamily: "var(--font-display), var(--font-heading), sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
        }}
      >
        关于
      </h1>
      <div className="mt-4 mb-14 mx-auto" style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }} />

      <div className="max-w-[62ch] mx-auto space-y-10 animate-fade-in-up delay-200">

        {/* ── Avatar + bio ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative shrink-0">
            <div style={{ width: "96px", height: "96px", border: "1px solid var(--color-frame-idle)", position: "relative" }}>
              <img
                src={OWNER_AVATAR}
                alt="Avatar"
                width={96}
                height={96}
                style={{ width: "96px", height: "96px", objectFit: "cover", background: "#111" }}
              />
              <span className="absolute" style={{ top: "-1px", left: "-1px", width: "16px", height: "16px", borderTop: "1px solid var(--color-accent)", borderLeft: "1px solid var(--color-accent)" }} />
              <span className="absolute" style={{ bottom: "-1px", right: "-1px", width: "16px", height: "16px", borderBottom: "1px solid var(--color-accent)", borderRight: "1px solid var(--color-accent)" }} />
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "22px", letterSpacing: "0.06em", color: "var(--color-text)", marginBottom: "10px" }}>
              {OWNER_NAME}
            </h2>
            <p style={{ color: "var(--color-text)", fontSize: "17px", lineHeight: "1.9" }}>
              {bioLines.map((line, i) => (
                <span key={i}>{line}{i < bioLines.length - 1 && <br />}</span>
              ))}
            </p>
          </div>
        </div>

        <div style={{ height: "1px", background: "linear-gradient(to right, var(--color-accent), var(--color-frame-idle), transparent)" }} />

        {/* ── Platform links ── */}
        <section>
          <h2 className="mb-5" style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "13px", letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "var(--color-text-dim)", fontWeight: 500 }}>
            联系方式
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OWNER_LINKS.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-3 transition-all duration-300"
                style={{ border: "1px solid var(--color-frame-idle)", color: "var(--color-text-faint)" }}
              >
                <span className="group-hover:text-[var(--color-accent-bright)] transition-colors duration-300">
                  <PlatformIcon icon={p.icon} size={18} />
                </span>
                <span className="group-hover:text-white transition-colors duration-300" style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "15px", letterSpacing: "0.05em" }}>
                  {p.label}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </a>
            ))}
          </div>
        </section>

        <div style={{ height: "1px", background: "linear-gradient(to right, var(--color-accent), var(--color-frame-idle), transparent)" }} />

        {/* ── GitHub Activity ── */}
        <section>
          <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
            <h2 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "13px", letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "var(--color-text-dim)", fontWeight: 500 }}>
              GitHub
            </h2>
            {yearCommits !== null && (
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "13px",
                  color: "var(--color-text-faint)",
                  letterSpacing: "0.05em",
                }}
              >
                {yearCommits.toLocaleString("en")} 次贡献 / 近一年
              </span>
            )}
          </div>

          {repos.length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--color-text-faint)" }}>
              暂无仓库数据
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {repos.map((repo) => (
                <RepoCard key={repo.name} repo={repo} />
              ))}
            </div>
          )}

          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 transition-colors duration-300 hover:text-[var(--color-text)]"
            style={{ fontSize: "12px", color: "var(--color-text-faint)", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" as const, textDecoration: "none" }}
          >
            查看全部仓库 →
          </a>
        </section>

        <div style={{ height: "1px", background: "linear-gradient(to right, var(--color-accent), var(--color-frame-idle), transparent)" }} />

        {/* ── Tech stack ── */}
        <section>
          <h2 className="mb-5" style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "13px", letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "var(--color-text-dim)", fontWeight: 500 }}>
            技术栈
          </h2>
          <ul className="space-y-3" style={{ color: "var(--color-text-dim)", fontSize: "16px" }}>
            {TECH_STACK.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--color-accent)", display: "inline-block", flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Steam (client-side toggle, hidden by default) ── */}
        {steam && (
          <>
            <div style={{ height: "1px", background: "linear-gradient(to right, var(--color-accent), var(--color-frame-idle), transparent)" }} />
            <SteamWidget profile={steam} />
          </>
        )}

        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--color-frame-idle))" }} />

        <p style={{ fontSize: "12px", color: "var(--color-text-faint)", textAlign: "center" as const, letterSpacing: "0.1em" }}>
          <Link href="/friends" style={{ color: "var(--color-text-faint)", textDecoration: "underline", textUnderlineOffset: "3px" }}>友链</Link>
          {" · "}
          <Link href="/messages" style={{ color: "var(--color-text-faint)", textDecoration: "underline", textUnderlineOffset: "3px" }}>留言板</Link>
        </p>
      </div>
    </div>
  );
}
