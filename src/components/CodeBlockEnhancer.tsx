"use client";

import { useEffect } from "react";

/**
 * 给文章内的所有 <pre> 代码块挂上「复制」按钮。
 * 文章内容通过 dangerouslySetInnerHTML 渲染，所以这里用 DOM 直接增强。
 */
export default function CodeBlockEnhancer({
  containerSelector = ".article-content",
}: {
  containerSelector?: string;
}) {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) return;

    const pres = container.querySelectorAll<HTMLPreElement>("pre");
    const cleanups: Array<() => void> = [];

    pres.forEach((pre) => {
      // 跳过 video-embed 等不含 code 的 pre
      const code = pre.querySelector("code");
      if (!code) return;
      // 防重入
      if (pre.querySelector(".code-copy-btn")) return;

      // pre 需要 position:relative 来定位按钮
      if (getComputedStyle(pre).position === "static") {
        pre.style.position = "relative";
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "复制代码");
      btn.innerHTML = COPY_ICON;

      const onClick = async () => {
        const text = code.textContent ?? "";
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            // 兼容旧环境（非 https / 旧浏览器）
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
          }
          btn.classList.add("copied");
          btn.innerHTML = CHECK_ICON;
          btn.setAttribute("aria-label", "已复制");
          window.setTimeout(() => {
            btn.classList.remove("copied");
            btn.innerHTML = COPY_ICON;
            btn.setAttribute("aria-label", "复制代码");
          }, 1600);
        } catch (e) {
          console.warn("[copy] failed:", e);
          btn.classList.add("failed");
          window.setTimeout(() => btn.classList.remove("failed"), 1600);
        }
      };

      btn.addEventListener("click", onClick);
      pre.appendChild(btn);

      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        btn.remove();
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [containerSelector]);

  return null;
}

const COPY_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const CHECK_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
