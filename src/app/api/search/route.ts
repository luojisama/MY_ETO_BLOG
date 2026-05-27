import type { NextRequest } from "next/server";
import { searchPosts } from "@/lib/posts";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return Response.json([]);
  const results = searchPosts(q).slice(0, 10);
  return Response.json(results);
}
