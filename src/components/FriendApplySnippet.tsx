"use client";

import { useState } from "react";
import { myFriendLink } from "@/config/friends";

/**
 * 友链页顶部的「申请友链」一键复制片段。
 * 把站长自己的 FriendLink 渲染成 TS 对象字面量代码块，右上角带复制按钮。
 */
export default function FriendApplySnippet() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const snippet =
    `{\n` +
    `  title: ${JSON.stringify(myFriendLink.title)},\n` +
    `  imgurl: ${JSON.stringify(myFriendLink.imgurl)},\n` +
    `  desc: ${JSON.stringify(myFriendLink.desc)},\n` +
    `  siteurl: ${JSON.stringify(myFriendLink.siteurl)},\n` +
    `},`;

  const onCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const ta = document.createElement("textarea");
        ta.value = snippet;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 1800);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between mb-4 gap-4 flex-wrap">
        <h2
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            fontSize: "13px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--color-text-dim)",
            fontWeight: 500,
          }}
        >
          申请友链 / Apply
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text-faint)",
            lineHeight: "1.7",
          }}
        >
          复制下方代码片段，发到留言板或者直接 PR 到 <code style={{ fontFamily: "var(--font-mono), monospace", fontSize: "12px", padding: "1px 5px", background: "rgba(255,255,255,0.06)" }}>src/config/friends.ts</code>
        </p>
      </div>

      <div className="relative" style={{ border: "1px solid var(--color-frame-idle)", background: "rgba(255,255,255,0.02)" }}>
        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />

        <pre
          style={{
            margin: 0,
            padding: "18px 22px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "13px",
            lineHeight: "1.75",
            color: "var(--color-text-dim)",
            overflowX: "auto",
            whiteSpace: "pre",
          }}
        >
          <code>{snippet}</code>
        </pre>

        {/* Copy button */}
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "已复制" : failed ? "复制失败" : "复制代码"}
          className="absolute transition-all duration-200"
          style={{
            top: "10px",
            right: "10px",
            width: "32px",
            height: "32px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10, 10, 10, 0.85)",
            border: `1px solid ${copied ? "var(--color-accent)" : failed ? "#ff6b6b" : "var(--color-frame-idle)"}`,
            color: copied ? "var(--color-accent-bright)" : failed ? "#ff6b6b" : "var(--color-text-faint)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="1.5" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
