import type { NextRequest } from "next/server";
import { getLikes, incrementLike } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return Response.json({ error: "Missing key" }, { status: 400 });
  const likes = await getLikes(key);
  return Response.json({ likes });
}

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    if (!key || typeof key !== "string") {
      return Response.json({ error: "Missing key" }, { status: 400 });
    }
    const likes = await incrementLike(key);
    return Response.json({ likes });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
