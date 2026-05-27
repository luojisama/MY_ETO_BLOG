import { allFriendLinks, SELF_SITE_URL } from "@/config/friends";
import { getFriendCircleCache, setFriendCircleCache } from "@/lib/storage";
import type { FriendCircleItem, FriendLink } from "@/types/friend";

const TIMEOUT_MS = 8000;
const MAX_ITEMS = 20;

function normalizeUrl(u: string) {
  return u.replace(/\/+$/, "");
}

function stripHtml(s: string) {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(url: string): Promise<string> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: { "User-Agent": "ETO-Blog/1.0 RSS Reader" },
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function parseFriend(friend: FriendLink): Promise<FriendCircleItem[]> {
  if (!friend.rssurl) return [];
  try {
    const text = await fetchFeed(friend.rssurl);
    const Parser = (await import("rss-parser")).default;
    const parser = new Parser();
    const feed = await parser.parseString(text);

    return feed.items
      .map((item) => {
        const pubDate = item.isoDate || item.pubDate;
        if (!pubDate || !item.title || !item.link) return null;
        const date = new Date(pubDate);
        if (isNaN(date.getTime())) return null;

        const raw =
          item.contentSnippet ??
          item.summary ??
          item.content ??
          (item["content:encoded"] as string | undefined) ??
          "";
        const description = stripHtml(raw).slice(0, 180);

        return {
          title: stripHtml(item.title),
          link: item.link,
          published: date.toISOString(),
          description,
          siteTitle: friend.title,
          siteurl: friend.siteurl,
          avatar: friend.imgurl,
        } satisfies FriendCircleItem;
      })
      .filter((x): x is FriendCircleItem => x !== null);
  } catch (e) {
    console.warn(`[friend-circle] feed failed for ${friend.title}:`, e);
    return [];
  }
}

export async function GET() {
  // Try cache first
  const cached = await getFriendCircleCache();
  if (cached) {
    return Response.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  }

  const selfUrl = normalizeUrl(SELF_SITE_URL);
  const friends = allFriendLinks.filter(
    (f) => f.rssurl && !f.isSelf && normalizeUrl(f.siteurl) !== selfUrl
  );

  const all = (await Promise.all(friends.map(parseFriend))).flat();
  const items = all
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, MAX_ITEMS);

  const result = { generatedAt: new Date().toISOString(), items };
  await setFriendCircleCache(result);

  return Response.json(result, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
