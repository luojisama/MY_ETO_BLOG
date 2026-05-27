import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const thoughtsDir = path.join(process.cwd(), "content/thoughts");

export interface Thought {
  id: string;
  date: string;
  tags?: string[];
  content: string;    // raw markdown
  contentHtml: string;
}

function normalizeDate(value: unknown, fallback: string): string {
  if (!value) return fallback;
  if (value instanceof Date) return value.toISOString().replace("T", " ").slice(0, 19);
  return String(value);
}

export async function getAllThoughts(): Promise<Thought[]> {
  if (!fs.existsSync(thoughtsDir)) return [];

  const files = fs
    .readdirSync(thoughtsDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse(); // newest first

  const thoughts = await Promise.all(
    files.map(async (file) => {
      const raw = fs.readFileSync(path.join(thoughtsDir, file), "utf-8");
      const { data, content } = matter(raw);
      const processed = await remark().use(html).process(content.trim());
      return {
        id: file.replace(/\.md$/, ""),
        date: normalizeDate(data.date, file.replace(/\.md$/, "")),
        tags: data.tags ?? [],
        content: content.trim(),
        contentHtml: processed.toString(),
      } satisfies Thought;
    })
  );

  return thoughts;
}
