"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  baseSize: number;
  baseOpacity: number;
  phase: number;       // 呼吸相位偏移
  breathSpeed: number; // 呼吸速率倍率
  layer: number;       // 视差层 0-2
}

// 视差强度（放大3倍）
const LAYER_DEPTH = [8, 18, 32];

export default function StarField() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const starsRef    = useRef<Star[]>([]);
  const mouseRef    = useRef({ x: 0, y: 0 });
  const mouseRafRef = useRef<number | null>(null);
  const breathRafRef= useRef<number | null>(null);
  const ctxRef      = useRef<CanvasRenderingContext2D | null>(null);
  const hasPointer  = useRef(false);
  const noMotion    = useRef(false);
  const timeRef     = useRef(0);
  const lastBreath  = useRef(0);

  // 呼吸用 rAF 原生帧率，删除 FPS cap — 24fps 会让正弦变化肉眼可见地跳变

  const generateStars = useCallback((w: number, h: number): Star[] => {
    const count = Math.floor((w * h) / 9000);
    return Array.from({ length: count }, () => {
      const layer = Math.floor(Math.random() * 3);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        // 前景层星星更大更亮
        baseSize: layer === 2
          ? Math.random() * 2 + 1.2
          : layer === 1
            ? Math.random() * 1.4 + 0.6
            : Math.random() * 0.9 + 0.3,
        baseOpacity: layer === 2
          ? Math.random() * 0.55 + 0.35
          : Math.random() * 0.45 + 0.12,
        phase: Math.random() * Math.PI * 2,
        breathSpeed: 0.5 + Math.random() * 1.2,
        layer,
      };
    });
  }, []);

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (const s of starsRef.current) {
      const ox = hasPointer.current && !noMotion.current
        ? mouseRef.current.x * LAYER_DEPTH[s.layer]
        : 0;
      const oy = hasPointer.current && !noMotion.current
        ? mouseRef.current.y * LAYER_DEPTH[s.layer]
        : 0;

      // 呼吸：从 15% → 100% 基础亮度（范围大才明显）
      const cycle = noMotion.current ? 1 : (0.5 + 0.5 * Math.sin(timeRef.current * s.breathSpeed + s.phase));
      const opacity = s.baseOpacity * (0.15 + 0.85 * cycle);
      // 大小随呼吸轻微膨胀
      const size = s.baseSize * (0.88 + 0.12 * cycle);

      // 最亮时给大星星加光晕
      if (s.layer === 2 && cycle > 0.75) {
        const glow = ctx.createRadialGradient(s.x + ox, s.y + oy, 0, s.x + ox, s.y + oy, size * 4);
        glow.addColorStop(0, `rgba(255,255,255,${(opacity * 0.3).toFixed(3)})`);
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(s.x + ox, s.y + oy, Math.max(0.1, size), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    noMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hasPointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = generateStars(window.innerWidth, window.innerHeight);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);

    // 鼠标视差 — on-demand rAF
    const onMouse = (e: MouseEvent) => {
      if (!hasPointer.current || noMotion.current) return;
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
      if (mouseRafRef.current === null) {
        mouseRafRef.current = requestAnimationFrame(() => {
          draw();
          mouseRafRef.current = null;
        });
      }
    };
    window.addEventListener("mousemove", onMouse);

    // 呼吸动画 — 原生 rAF 60fps，按 delta time 推进，正弦变化丝滑
    if (!noMotion.current) {
      const breathLoop = (ts: number) => {
        if (document.visibilityState !== "visible") {
          lastBreath.current = 0; // 重置时间戳，恢复时避免大跳
          breathRafRef.current = requestAnimationFrame(breathLoop);
          return;
        }
        // delta = 上一帧到现在的实际毫秒数（首帧 fallback 16ms）
        const delta = lastBreath.current ? ts - lastBreath.current : 16;
        lastBreath.current = ts;
        // base cycle ≈ 3s（快慢不同星星 ×0.5-1.7 = 1.8s-5.1s）
        timeRef.current += delta / 3000;
        draw();
        breathRafRef.current = requestAnimationFrame(breathLoop);
      };
      breathRafRef.current = requestAnimationFrame(breathLoop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      if (mouseRafRef.current !== null) cancelAnimationFrame(mouseRafRef.current);
      if (breathRafRef.current !== null) cancelAnimationFrame(breathRafRef.current);
    };
  }, [generateStars, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
