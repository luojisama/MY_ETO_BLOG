"use client";
import { useEffect, useState } from "react";
import type { FriendCircleItem } from "@/types/friend";

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)} 分钟前`;
  if (s < 86400) return `${Math.floor(s / 3600)} 小时前`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} 天前`;
  return new Date(iso).toLocaleDateString("zh-CN");
}

export default function FriendCircle() {
  const [items, setItems] = useState<FriendCircleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState("");

  useEffect(() => {
    fetch("/api/friend-circle")
      .then((r) => r.json())
      .then((d) => { setItems(d.items ?? []); setGeneratedAt(d.generatedAt ?? ""); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div style={{ width: "20px", height: "20px", border: "1.5px solid var(--color-frame-idle)", borderTopColor: "var(--color-accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (items.length === 0) {
    return <p style={{ color: "var(--color-text-faint)", fontSize: "13px", textAlign: "center", padding: "40px 0" }}>暂无动态</p>;
  }

  return (
    <div>
      <div className="flex flex-col gap-0">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 py-4 transition-colors duration-200"
            style={{ borderBottom: i < items.length - 1 ? "1px solid var(--color-frame-idle)" : "none" }}
          >
            <img
              src={item.avatar}
              alt={item.siteTitle}
              width={32}
              height={32}
              style={{ width: "32px", height: "32px", flexShrink: 0, border: "1px solid var(--color-frame-idle)", background: "#111", borderRadius: "0" }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span style={{ fontSize: "11px", color: "var(--color-accent-bright)", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "0.05em" }}>
                  {item.siteTitle}
                </span>
                <span style={{ fontSize: "10px", color: "var(--color-text-faint)" }}>{timeAgo(item.published)}</span>
              </div>
              <p
                className="group-hover:text-white transition-colors duration-200"
                style={{ fontSize: "13px", color: "var(--color-text-dim)", marginTop: "2px", letterSpacing: "0.02em" }}
              >
                {item.title}
              </p>
              {item.description && (
                <p style={{ fontSize: "12px", color: "var(--color-text-faint)", marginTop: "3px", lineHeight: "1.5", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                  {item.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
      {generatedAt && (
        <p style={{ fontSize: "10px", color: "var(--color-text-faint)", marginTop: "12px", textAlign: "right", letterSpacing: "0.05em" }}>
          更新于 {new Date(generatedAt).toLocaleString("zh-CN")}
        </p>
      )}
    </div>
  );
}
