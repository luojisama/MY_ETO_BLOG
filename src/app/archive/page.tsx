import Link from "next/link";
import { getPostsByYear } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "归档",
};

export default function ArchivePage() {
  const postsByYear = getPostsByYear();
  const years = Object.keys(postsByYear).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1
        className="text-center animate-fade-in-up"
        style={{
          fontFamily: "var(--font-display), var(--font-heading), sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
        }}
      >
        归档
      </h1>

      <div className="mt-4 mb-14 mx-auto" style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }} />

      {years.length === 0 ? (
        <p className="text-center" style={{ color: "var(--color-text-faint)" }}>暂无内容</p>
      ) : (
        <div className="space-y-14">
          {years.map((year, yi) => (
            <section
              key={year}
              className="animate-fade-in-up"
              style={{ animationDelay: `${yi * 0.1}s` }}
            >
              <h2
                className="mb-6"
                style={{
                  fontFamily: "var(--font-display), var(--font-heading), sans-serif",
                  fontSize: "2rem",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-dim)",
                }}
              >
                <span className="text-[var(--color-accent)]">#</span> {year}
              </h2>

              <div className="flex flex-col gap-1 pl-5 border-l border-[var(--color-frame-idle)]">
                {postsByYear[year].map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group flex items-baseline gap-5 py-2 transition-colors duration-300"
                  >
                    <time
                      className="shrink-0 tabular-nums"
                      style={{ color: "var(--color-text-faint)", fontSize: "13px", letterSpacing: "0.05em" }}
                    >
                      {post.date.slice(5)}
                    </time>
                    <span
                      className="text-[var(--color-text-dim)] group-hover:text-[var(--color-text)] transition-colors duration-300"
                      style={{ fontSize: "15px" }}
                    >
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
