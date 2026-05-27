import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import LikeButton from "@/components/LikeButton";
import MessageBoard from "@/components/MessageBoard";
import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="relative z-10 max-w-[72ch] mx-auto px-6 pt-28 pb-20">
      <Link
        href="/posts"
        className="inline-block transition-colors duration-300 hover:text-[var(--color-text)]"
        style={{
          color: "var(--color-text-faint)",
          fontFamily: "var(--font-heading), sans-serif",
          fontSize: "12px",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
        }}
      >
        &larr; 返回文章
      </Link>

      <header className="mt-10 mb-14">
        <h1
          className="animate-fade-in-up"
          style={{
            fontFamily: "var(--font-display), var(--font-heading), sans-serif",
            fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
            letterSpacing: "0.03em",
            lineHeight: "1.1",
          }}
        >
          {post.title}
        </h1>

        <div className="mt-5 flex items-center gap-4 flex-wrap animate-fade-in-up delay-100">
          <time style={{ color: "var(--color-text-faint)", fontSize: "12px", letterSpacing: "0.1em" }}>
            {post.date}
          </time>
          {post.readingTime && (
            <span style={{ color: "var(--color-text-faint)", fontSize: "12px", letterSpacing: "0.05em" }}>
              · 约 {post.readingTime} 分钟阅读
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border"
                  style={{
                    color: "var(--color-text-faint)",
                    borderColor: "var(--color-frame-idle)",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    padding: "2px 8px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8" style={{ height: "1px", background: "linear-gradient(to right, var(--color-accent), var(--color-frame-idle), transparent)" }} />
      </header>

      <article
        className="article-content animate-fade-in-up delay-200"
        style={{
          fontFamily: "var(--font-body), -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
        }}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Code-block copy buttons (runs after article DOM is committed) */}
      <CodeBlockEnhancer />

      {/* Like + share */}
      <div className="mt-14 flex items-center justify-between flex-wrap gap-4">
        <LikeButton likeKey={`post:${slug}`} label="为这篇文章点赞" />
        <Link
          href="/posts"
          className="transition-colors duration-300 hover:text-[var(--color-text)]"
          style={{ color: "var(--color-text-faint)", fontSize: "12px", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" as const }}
        >
          返回文章列表 →
        </Link>
      </div>

      {/* Divider */}
      <div className="mt-12 mb-10" style={{ height: "1px", background: "linear-gradient(to right, transparent, var(--color-frame-idle), transparent)" }} />

      {/* Comments */}
      <MessageBoard slug={slug} />
    </div>
  );
}
