"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(await res.json());
      setSelected(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 250);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  useEffect(() => {
    if (!open) return;
    const resetTimer = setTimeout(() => {
      setQuery("");
      setResults([]);
    }, 0);
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      clearTimeout(resetTimer);
      clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Let parent control open state; if already open just close
        if (open) onClose();
        // If not open, the NavBar's onClick handles it.
        // But to allow global ⌘K we dispatch a custom event:
        if (!open) window.dispatchEvent(new CustomEvent("open-search"));
      }
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, results.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && results[selected]) {
        window.location.href = `/posts/${results[selected].slug}`;
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, results, selected]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full mx-4 relative"
        style={{ maxWidth: "600px", border: "1px solid var(--color-frame-idle)", background: "#0e0e0e" }}
      >
        {/* Corner accents */}
        {["top-0 left-0 border-t border-l","top-0 right-0 border-t border-r","bottom-0 left-0 border-b border-l","bottom-0 right-0 border-b border-r"].map((cls, i) => (
          <span key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />
        ))}

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--color-frame-idle)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-faint)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章…"
            className="flex-1 bg-transparent outline-none"
            style={{
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "14px",
              color: "var(--color-text)",
              letterSpacing: "0.05em",
            }}
          />
          {loading && (
            <div style={{ width: "14px", height: "14px", border: "1.5px solid var(--color-frame-idle)", borderTopColor: "var(--color-accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          )}
          <kbd style={{ fontSize: "10px", padding: "2px 6px", border: "1px solid var(--color-frame-idle)", color: "var(--color-text-faint)", letterSpacing: "0.1em" }}>ESC</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul style={{ maxHeight: "360px", overflowY: "auto" }}>
            {results.map((post, i) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  onClick={onClose}
                  className="flex flex-col px-5 py-3 transition-colors duration-150"
                  style={{
                    background: i === selected ? "rgba(193,18,31,0.08)" : "transparent",
                    borderLeft: i === selected ? "2px solid var(--color-accent)" : "2px solid transparent",
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <span style={{ fontSize: "14px", color: "var(--color-text-dim)", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "0.03em" }}>{post.title}</span>
                  {post.description && (
                    <span style={{ fontSize: "12px", color: "var(--color-text-faint)", marginTop: "2px" }}>{post.description}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query && !loading && results.length === 0 && (
          <div className="px-5 py-6 text-center" style={{ color: "var(--color-text-faint)", fontSize: "13px" }}>
            未找到与 &ldquo;{query}&rdquo; 相关的文章
          </div>
        )}

        <div className="px-5 py-2 flex gap-4" style={{ borderTop: "1px solid var(--color-frame-idle)" }}>
          {[["↑↓","切换"],["↵","打开"],["esc","关闭"]].map(([k,v]) => (
            <span key={k} style={{ fontSize: "11px", color: "var(--color-text-faint)" }}>
              <kbd style={{ marginRight: "4px", padding: "1px 5px", border: "1px solid var(--color-frame-idle)", fontSize: "10px" }}>{k}</kbd>{v}
            </span>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
