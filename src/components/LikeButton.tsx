"use client";
import { useEffect, useState } from "react";

interface Props {
  likeKey: string; // e.g. "post:hello-world" or "msg:abc1234"
  label?: string;
}

export default function LikeButton({ likeKey, label = "点赞" }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const storageKey = `liked:${likeKey}`;

  useEffect(() => {
    const likedTimer = setTimeout(() => {
      setLiked(localStorage.getItem(storageKey) === "1");
    }, 0);
    fetch(`/api/like?key=${encodeURIComponent(likeKey)}`)
      .then((r) => r.json())
      .then((d) => setCount(d.likes ?? 0))
      .catch(() => setCount(0));
    return () => clearTimeout(likedTimer);
  }, [likeKey, storageKey]);

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    localStorage.setItem(storageKey, "1");
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: likeKey }),
      });
      const d = await res.json();
      setCount(d.likes ?? (count ?? 0) + 1);
    } catch {
      setCount((c) => (c ?? 0) + 1);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className="flex items-center gap-2 transition-all duration-300"
      style={{
        padding: "8px 20px",
        border: `1px solid ${liked ? "var(--color-accent)" : "var(--color-frame-idle)"}`,
        color: liked ? "var(--color-accent-bright)" : "var(--color-text-faint)",
        background: liked ? "rgba(193,18,31,0.06)" : "transparent",
        fontFamily: "var(--font-heading), sans-serif",
        fontSize: "12px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: liked ? "default" : "pointer",
        transform: animating ? "scale(1.05)" : "scale(1)",
      }}
    >
      {/* Heart icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        style={{ transition: "transform 0.3s", transform: animating ? "scale(1.3)" : "scale(1)" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{label}</span>
      {count !== null && (
        <span style={{ color: liked ? "var(--color-accent)" : "var(--color-text-faint)", fontVariantNumeric: "tabular-nums" }}>
          {count}
        </span>
      )}
    </button>
  );
}
