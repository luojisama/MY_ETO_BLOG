import type { Metadata } from "next";
import { getAllThoughts } from "@/lib/thoughts";

export const metadata: Metadata = { title: "小事" };

function formatDate(d: string) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function ThoughtsPage() {
  const thoughts = await getAllThoughts();

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-20">
      {/* Header */}
      <h1
        className="text-center animate-fade-in-up"
        style={{
          fontFamily: "var(--font-display), var(--font-heading), sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
        }}
      >
        小事
      </h1>
      <p
        className="text-center mt-3 animate-fade-in-up delay-100"
        style={{
          fontFamily: "var(--font-heading), sans-serif",
          fontSize: "12px",
          letterSpacing: "0.3em",
          textTransform: "uppercase" as const,
          color: "var(--color-text-faint)",
        }}
      >
        只言片语 · 随手记录
      </p>
      <div className="mt-4 mb-14 mx-auto" style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }} />

      {thoughts.length === 0 ? (
        <p className="text-center" style={{ color: "var(--color-text-faint)", fontSize: "14px" }}>
          暂无内容
        </p>
      ) : (
        <div className="relative animate-fade-in-up delay-200">
          {/* Vertical timeline line */}
          <div
            className="absolute top-0 bottom-0"
            style={{ left: "0", width: "1px", background: "linear-gradient(to bottom, var(--color-accent), var(--color-frame-idle) 60%, transparent)" }}
          />

          <div className="flex flex-col gap-0 pl-8">
            {thoughts.map((thought, i) => (
              <div
                key={thought.id}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${0.1 + i * 0.08}s`, paddingBottom: i < thoughts.length - 1 ? "32px" : "0" }}
              >
                {/* Timeline dot */}
                <span
                  className="absolute"
                  style={{
                    left: "-35px",
                    top: "4px",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: i === 0 ? "var(--color-accent-bright)" : "var(--color-frame-idle)",
                    border: i === 0 ? "none" : "1px solid var(--color-frame-idle)",
                    boxShadow: i === 0 ? "0 0 8px var(--color-accent)" : "none",
                  }}
                />

                {/* Date + tags */}
                <div className="flex items-center gap-3 mb-2">
                  <time style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "var(--color-text-faint)", letterSpacing: "0.08em" }}>
                    {formatDate(thought.date)}
                  </time>
                  {thought.tags && thought.tags.length > 0 && thought.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "9px",
                        padding: "1px 7px",
                        border: "1px solid var(--color-frame-idle)",
                        color: "var(--color-text-faint)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        fontFamily: "var(--font-heading), sans-serif",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <div
                  className="thought-content"
                  style={{
                    fontSize: "15px",
                    color: "var(--color-text-dim)",
                    lineHeight: "1.85",
                    fontFamily: "var(--font-body), -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
                  }}
                  dangerouslySetInnerHTML={{ __html: thought.contentHtml }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .thought-content p { margin-bottom: 0.6em; }
        .thought-content p:last-child { margin-bottom: 0; }
        .thought-content a { color: var(--color-accent-bright); text-decoration: underline; text-underline-offset: 3px; }
        .thought-content strong { color: var(--color-text); font-weight: 600; }
        .thought-content em { color: var(--color-text-dim); }
        .thought-content code { background: rgba(255,255,255,0.06); padding: 0.1em 0.4em; font-family: var(--font-mono); font-size: 0.9em; }
      `}</style>
    </div>
  );
}
