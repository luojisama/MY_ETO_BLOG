"use client";

import { useEffect, useState } from "react";
import { SLOGAN, SLOGAN_RED_POOL, SLOGAN_RED_COUNT } from "@/config/site";

/**
 * 首页 hero 标语。
 *
 * - 服务端 / 首屏：所有字符均默认色（避免 hydration mismatch）
 * - 客户端 mount 后：从 SLOGAN_RED_POOL 包含的字符位置中随机抽 SLOGAN_RED_COUNT 个染红
 * - 刷新页面 → 重新随机
 */
export default function Slogan() {
  const [redIndices, setRedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    // 找出标语中所有「字符在候选池里」的下标
    const pool = new Set(Array.from(SLOGAN_RED_POOL));
    const candidates: number[] = [];
    for (let i = 0; i < SLOGAN.length; i++) {
      if (pool.has(SLOGAN[i])) candidates.push(i);
    }
    if (candidates.length === 0) return;

    // 洗牌取前 N 个
    const shuffled = [...candidates];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const pick = Math.min(SLOGAN_RED_COUNT, shuffled.length);
    setRedIndices(new Set(shuffled.slice(0, pick)));
  }, []);

  return (
    <h1 className="animate-fade-in-up">
      <span
        className="block leading-[1.05] tracking-[0.02em]"
        style={{
          fontFamily: "var(--font-display), var(--font-heading), sans-serif",
          fontSize: "clamp(2.2rem, 7.5vw, 6.5rem)",
        }}
      >
        {Array.from(SLOGAN).map((ch, i) => (
          <span
            key={i}
            style={{
              color: redIndices.has(i)
                ? "var(--color-accent-bright)"
                : "var(--color-text)",
              transition: "color 0.6s ease",
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    </h1>
  );
}
