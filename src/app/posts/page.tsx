import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "文章" };

export default function PostsPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 pt-36 pb-20">
      <h1
        className="text-center animate-fade-in-up"
        style={{
          fontFamily: "var(--font-display), var(--font-heading), sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
        }}
      >
        文章
      </h1>
      <div className="mt-4 mb-12 mx-auto" style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }} />

      {/* Two-column layout: posts list + tag sidebar */}
      <div className="grid lg:grid-cols-[1fr_220px] gap-12 animate-fade-in-up delay-200">

        {/* Posts list */}
        <div>
          {posts.length === 0 ? (
            <p className="text-center" style={{ color: "var(--color-text-faint)" }}>暂无文章</p>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group relative block animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className={`relative transition-all duration-300 ${post.cover ? "flex flex-col sm:flex-row gap-0 sm:gap-5" : "px-6 py-5"}`}>
                    {/* Corner brackets */}
                    <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300 z-10" />
                    <span className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300 z-10" />
                    <span className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300 z-10" />
                    <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300 z-10" />

                    {/* Cover image (optional) */}
                    {post.cover && (
                      <div className="shrink-0 overflow-hidden relative w-full sm:w-[240px] aspect-[16/9] sm:aspect-[4/3] border-b sm:border-b-0 sm:border-r border-[var(--color-frame-idle)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.cover}
                          alt={post.title}
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s",
                          }}
                          className="group-hover:scale-[1.03]"
                        />
                      </div>
                    )}

                    {/* Text body */}
                    <div className={post.cover ? "flex-1 px-6 py-5 min-w-0" : ""}>
                      <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <h2
                          className="text-[var(--color-text-dim)] group-hover:text-[var(--color-text)] transition-colors duration-300"
                          style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "17px", letterSpacing: "0.04em" }}
                        >
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-3 shrink-0">
                          {post.readingTime && (
                            <span style={{ fontSize: "12px", color: "var(--color-text-faint)" }}>
                              {post.readingTime} min
                            </span>
                          )}
                          <time style={{ color: "var(--color-text-faint)", fontSize: "12px", letterSpacing: "0.05em" }}>
                            {post.date}
                          </time>
                        </div>
                      </div>

                      {post.description && (
                        <p className="mt-2 group-hover:text-[var(--color-text-dim)] transition-colors duration-300"
                          style={{ color: "var(--color-text-faint)", fontSize: "14px", lineHeight: "1.7" }}
                        >
                          {post.description}
                        </p>
                      )}

                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          {/* Tag cloud */}
          {tags.length > 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "var(--color-text-faint)", marginBottom: "12px" }}>
                标签
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ tag, count }) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "11px",
                      padding: "3px 10px",
                      border: "1px solid var(--color-frame-idle)",
                      color: "var(--color-text-faint)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase" as const,
                      fontFamily: "var(--font-heading), sans-serif",
                    }}
                  >
                    {tag}
                    <span style={{ marginLeft: "4px", color: "var(--color-accent)", fontSize: "10px" }}>{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 p-4 relative" style={{ border: "1px solid var(--color-frame-idle)" }}>
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />
            <p style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase" as const, color: "var(--color-text-faint)", marginBottom: "10px" }}>
              统计
            </p>
            <p style={{ fontSize: "28px", fontFamily: "var(--font-display), sans-serif", letterSpacing: "0.05em", color: "var(--color-text-dim)" }}>
              {posts.length}
            </p>
            <p style={{ fontSize: "11px", color: "var(--color-text-faint)", marginTop: "2px" }}>篇文章</p>
          </div>

          {/* Quick links */}
          <div className="mt-6 flex flex-col gap-2">
            {[
              { href: "/archive", label: "时间归档" },
              { href: "/friends", label: "友链" },
              { href: "/messages", label: "留言板" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="group flex items-center gap-2 transition-colors duration-200"
                style={{ fontSize: "12px", color: "var(--color-text-faint)", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                <span className="group-hover:text-[var(--color-accent-bright)] transition-colors duration-200">→</span>
                <span className="group-hover:text-[var(--color-text-dim)] transition-colors duration-200">{l.label}</span>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
