/**
 * Unified storage layer.
 * Local dev  → data/*.json
 * Vercel KV  → @vercel/kv  (KV_REST_API_URL + KV_REST_API_TOKEN)
 * Any Redis  → ioredis     (REDIS_URL, fallback when KV env absent)
 */
import fs from "node:fs";
import path from "node:path";
import type { Message } from "@/types/message";

const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_PATH = path.join(DATA_DIR, "messages.json");
const LIKES_PATH = path.join(DATA_DIR, "likes.json");
const FC_PATH = path.join(DATA_DIR, "friend-circle-cache.json");

const USE_KV =
  !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const USE_REDIS = !USE_KV && !!process.env.REDIS_URL;
const IS_REMOTE = USE_KV || USE_REDIS;

// ── lazy clients ──────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _kv: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _redis: any = null;

async function kv() {
  if (!USE_KV) return null;
  if (!_kv) {
    const { createClient } = await import("@vercel/kv");
    _kv = createClient({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return _kv;
}

async function redis() {
  if (!USE_REDIS) return null;
  if (!_redis) {
    const Redis = (await import("ioredis")).default;
    _redis = new Redis(process.env.REDIS_URL!);
    _redis.on("error", (e: Error) => console.error("[redis]", e.message));
  }
  return _redis;
}

// ── local JSON helpers ────────────────────────────────────────────────────────
function ensureDir() {
  if (!IS_REMOTE && !fs.existsSync(DATA_DIR))
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDir();
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Messages ──────────────────────────────────────────────────────────────────
export async function getMessages(slug?: string): Promise<Message[]> {
  let all: Message[] = [];
  const db = await kv();
  const r = await redis();

  if (db) {
    all = ((await db.get("messages")) as Message[]) ?? [];
  } else if (r) {
    const raw = await r.get("messages");
    all = raw ? (JSON.parse(raw) as Message[]) : [];
  } else {
    all = readJson<Message[]>(MESSAGES_PATH, []);
  }

  return slug ? all.filter((m) => m.slug === slug) : all;
}

export async function addMessage(
  data: Omit<Message, "id" | "createdAt">
): Promise<Message> {
  const all = await getMessages(); // no slug → all
  const msg: Message = {
    ...data,
    id: Math.random().toString(36).slice(2, 9),
    createdAt: Date.now(),
  };
  const updated = [msg, ...all].slice(0, 2000);

  const db = await kv();
  const r = await redis();
  if (db) await db.set("messages", updated);
  else if (r) await r.set("messages", JSON.stringify(updated));
  else writeJson(MESSAGES_PATH, updated);

  return msg;
}

// ── Likes ─────────────────────────────────────────────────────────────────────
export async function getLikes(key: string): Promise<number> {
  const db = await kv();
  const r = await redis();

  if (db) return ((await db.hget("likes", key)) as number) ?? 0;
  if (r) {
    const v = await r.hget("likes", key);
    return v ? parseInt(v as string, 10) : 0;
  }
  return readJson<Record<string, number>>(LIKES_PATH, {})[key] ?? 0;
}

export async function incrementLike(key: string): Promise<number> {
  const db = await kv();
  const r = await redis();

  if (db) return await db.hincrby("likes", key, 1);
  if (r) return await r.hincrby("likes", key, 1);

  const likes = readJson<Record<string, number>>(LIKES_PATH, {});
  likes[key] = (likes[key] ?? 0) + 1;
  writeJson(LIKES_PATH, likes);
  return likes[key];
}

// ── Friend-circle cache ───────────────────────────────────────────────────────
type FCCache = { generatedAt: string; items: unknown[] };

export async function getFriendCircleCache(): Promise<FCCache | null> {
  const db = await kv();
  const r = await redis();

  if (db) return (await db.get("fc-cache")) as FCCache | null;
  if (r) {
    const raw = await r.get("fc-cache");
    return raw ? (JSON.parse(raw) as FCCache) : null;
  }
  // Local: check TTL via generatedAt
  const cached = readJson<FCCache | null>(FC_PATH, null);
  if (!cached) return null;
  const age = Date.now() - new Date(cached.generatedAt).getTime();
  return age < 30 * 60 * 1000 ? cached : null; // 30 min TTL
}

export async function setFriendCircleCache(data: FCCache, ttl = 1800) {
  const db = await kv();
  const r = await redis();

  if (db) await db.set("fc-cache", data, { ex: ttl });
  else if (r) await r.set("fc-cache", JSON.stringify(data), "EX", ttl);
  else writeJson(FC_PATH, data);
}
