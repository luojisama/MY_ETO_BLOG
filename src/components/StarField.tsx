"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  r: number;           // 到旋转中心的距离
  theta: number;       // 当前旋转极角
  baseSize: number;
  baseOpacity: number;
  phase: number;       // 呼吸相位偏移
  breathSpeed: number; // 呼吸速率倍率
  layer: number;       // 视差层 0-2
  color: string;       // 星星的特有颜色占位模板 (rgba)
}

// 视差强度（深层移动少，前景移动多，柔和视差）
const LAYER_DEPTH = [6, 12, 20];

export default function StarField() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const starsRef    = useRef<Star[]>([]);
  const mouseRef    = useRef({ x: 0, y: 0 });          // 目标鼠标偏移
  const smoothMouseRef = useRef({ x: 0, y: 0 });       // 缓动平滑鼠标偏移
  
  const breathRafRef= useRef<number | null>(null);
  const ctxRef      = useRef<CanvasRenderingContext2D | null>(null);
  const hasPointer  = useRef(false);
  const noMotion    = useRef(false);
  const timeRef     = useRef(0);
  const lastBreath  = useRef(0);

  const generateStars = useCallback((w: number, h: number): Star[] => {
    // 旋转中心设定在屏幕顶部中央略微偏上的地方（北极星位置）
    const cx = w * 0.5;
    const cy = h * -0.15;
    
    // 计算屏幕四个角到旋转中心的最大半径，确保圆面覆盖整个视口
    const dx = w * 0.5;
    const dy = h - cy;
    const rMax = Math.sqrt(dx * dx + dy * dy);
    
    // 维持适当的星星密度
    const circleArea = Math.PI * rMax * rMax;
    const count = Math.floor(circleArea / 9500); 
    
    return Array.from({ length: count }, () => {
      const layer = Math.floor(Math.random() * 3);
      
      // 在圆内均匀随机分布（极坐标法）
      const rVal = rMax * Math.sqrt(Math.random());
      const thetaVal = Math.random() * Math.PI * 2;

      // 全部采用偏暗、柔和的冷色调，避免刺眼
      const r = Math.random();
      let color = "rgba(255, 255, 255, opacity)";
      if (r < 0.55) {
        color = "rgba(215, 235, 255, opacity)"; // 极淡柔和冰蓝
      } else if (r < 0.8) {
        color = "rgba(230, 220, 250, opacity)"; // 极淡柔和粉紫
      } else {
        color = "rgba(250, 230, 215, opacity)"; // 极淡温和橘白
      }

      return {
        r: rVal,
        theta: thetaVal,
        // 缩减星星尺寸，使其精致纤细，绝不抢占文字视线
        baseSize: layer === 2
          ? Math.random() * 0.8 + 1.3  // 前景：1.3px - 2.1px
          : layer === 1
            ? Math.random() * 0.5 + 0.8  // 中景：0.8px - 1.3px
            : Math.random() * 0.3 + 0.4, // 背景：0.4px - 0.7px
        // 适当调整基础亮度，使羽化后效果自然明亮，但依然深邃
        baseOpacity: layer === 2
          ? Math.random() * 0.22 + 0.30 // 前景：30% - 52% 亮度
          : layer === 1
            ? Math.random() * 0.15 + 0.16 // 中景：16% - 31% 亮度
            : Math.random() * 0.08 + 0.08, // 背景：8% - 16% 亮度
        phase: Math.random() * Math.PI * 2,
        breathSpeed: 0.35 + Math.random() * 0.65,
        layer,
        color,
      };
    });
  }, []);

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 如果处于 prefers-reduced-motion，使用纯黑底清空，不保留轨迹
    if (noMotion.current) {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);
    } else {
      // 每一帧覆盖一层极淡的底色，逐渐淡化前几帧的内容，从而留下星轨拖尾
      ctx.fillStyle = "rgba(10, 10, 10, 0.045)"; 
      ctx.fillRect(0, 0, w, h);
    }

    // 1. 全局宇宙微波背景慢呼吸（线性余弦平滑波动，无断续闪烁）
    const globalBreath = noMotion.current
      ? 1.0
      : 1.0 + 0.15 * Math.sin(timeRef.current * 0.4);

    // 旋转中心坐标
    const cx = w * 0.5;
    const cy = h * -0.15;

    // 2. 绘制星空星星
    for (const s of starsRef.current) {
      // 计算旋转后的基础坐标
      const baseX = cx + s.r * Math.cos(s.theta);
      const baseY = cy + s.r * Math.sin(s.theta);

      // 鼠标平滑缓动视差
      const ox = hasPointer.current && !noMotion.current
        ? smoothMouseRef.current.x * LAYER_DEPTH[s.layer]
        : 0;
      const oy = hasPointer.current && !noMotion.current
        ? smoothMouseRef.current.y * LAYER_DEPTH[s.layer]
        : 0;

      let posX = baseX + ox;
      let posY = baseY + oy;

      // 鼠标附近的引力弯曲与平滑变亮
      let mouseGlow = 1.0;
      if (hasPointer.current && !noMotion.current) {
        const mousePixelX = (smoothMouseRef.current.x / 2 + 0.5) * w;
        const mousePixelY = (smoothMouseRef.current.y / 2 + 0.5) * h;
        const dx = posX - mousePixelX;
        const dy = posY - mousePixelY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          // 空间引力弯曲效果
          const force = Math.pow(1 - dist / 180, 2) * 12; 
          posX += (dx / dist) * force;
          posY += (dy / dist) * force;

          // 靠近鼠标时星轨亮度平滑提升
          const distFactor = 1 - dist / 180;
          mouseGlow = 1.0 + 0.35 * distFactor * distFactor; 
        }
      }

      // 星星日常正弦呼吸
      const cycle = noMotion.current 
        ? 1 
        : (0.5 + 0.5 * Math.sin(timeRef.current * s.breathSpeed + s.phase));

      const opacity = s.baseOpacity * (0.25 + 0.75 * cycle) * mouseGlow * globalBreath;
      const size = s.baseSize * (0.92 + 0.08 * cycle);

      // 使用单次径向渐变填涂星星，消除硬边界，使中心与羽化边缘完美融合，拒绝割裂感
      const renderRadius = size * 2.2;
      const starGlow = ctx.createRadialGradient(posX, posY, 0, posX, posY, renderRadius);
      
      const centerColor = s.color.replace("opacity", opacity.toFixed(3));
      const midColor = s.color.replace("opacity", (opacity * 0.42).toFixed(3));
      const edgeColor = s.color.replace("opacity", "0");

      starGlow.addColorStop(0, centerColor);     // 亮核中心
      starGlow.addColorStop(0.18, centerColor);   // 实心内核过渡
      starGlow.addColorStop(0.55, midColor);     // 羽化渐变开始
      starGlow.addColorStop(1, edgeColor);       // 彻底融于夜空

      ctx.save();
      ctx.beginPath();
      ctx.arc(posX, posY, renderRadius, 0, Math.PI * 2);
      ctx.fillStyle = starGlow;
      ctx.fill();
      ctx.restore();
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

    // --- Canvas 大小自适应 ---
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // 尺寸改变时首次填涂底色
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      starsRef.current = generateStars(window.innerWidth, window.innerHeight);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);

    // --- 鼠标移动事件 ---
    const onMouse = (e: MouseEvent) => {
      if (!hasPointer.current || noMotion.current) return;
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse);

    // --- 物理与绘制循环 ---
    if (!noMotion.current) {
      const loop = (ts: number) => {
        if (document.visibilityState !== "visible") {
          lastBreath.current = 0;
          breathRafRef.current = requestAnimationFrame(loop);
          return;
        }

        const delta = lastBreath.current ? ts - lastBreath.current : 16.6;
        lastBreath.current = ts;

        // 累加时间
        timeRef.current += delta / 3000;

        // 极其缓慢地累加所有星星的角度，代表星轨的推进
        const angularSpeed = 0.00035; // 慢速星轨旋转速度
        const deltaTheta = angularSpeed * (delta / 16.6);
        for (const s of starsRef.current) {
          s.theta += deltaTheta;
        }

        // 鼠标缓动 (lerp)
        smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.08;
        smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.08;

        // 绘制当前帧
        draw();

        breathRafRef.current = requestAnimationFrame(loop);
      };
      breathRafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
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
