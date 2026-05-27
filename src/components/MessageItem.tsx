"use client";
import { useState } from "react";
import type { Message } from "@/types/message";
import MessageEditor from "./MessageEditor";

interface Props {
  message: Message;
  floor: number;
  slug?: string;
  onSuccess: () => void;
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "刚刚";
  if (s < 3600) return `${Math.floor(s / 60)} 分钟前`;
  if (s < 86400) return `${Math.floor(s / 3600)} 小时前`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} 天前`;
  return new Date(ts).toLocaleDateString("zh-CN");
}

export default function MessageItem({ message: m, floor, slug, onSuccess }: Props) {
  const [replying, setReplying] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid var(--color-frame-idle)", paddingBottom: "20px", marginBottom: "4px" }}>
      {/* Main message */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative shrink-0" style={{ width: "40px", height: "40px" }}>
          <img
            src={m.avatar}
            alt={m.nickname}
            width={40}
            height={40}
            style={{ width: "40px", height: "40px", objectFit: "cover", border: "1px solid var(--color-frame-idle)", background: "#111" }}
          />
          {/* floor badge */}
          <span
            className="absolute -bottom-1 -right-1 flex items-center justify-center"
            style={{ width: "18px", height: "18px", background: "var(--color-accent)", fontSize: "9px", color: "#fff", fontFamily: "var(--font-mono), monospace", letterSpacing: "0" }}
          >
            {floor}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-3 flex-wrap">
            {m.website ? (
              <a href={m.website} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "13px", color: "var(--color-text-dim)", letterSpacing: "0.05em" }}>
                {m.nickname}
              </a>
            ) : (
              <span style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "13px", color: "var(--color-text-dim)", letterSpacing: "0.05em" }}>
                {m.nickname}
              </span>
            )}
            <span style={{ fontSize: "11px", color: "var(--color-text-faint)" }}>{timeAgo(m.createdAt)}</span>
            {m.os && (
              <span style={{ fontSize: "10px", color: "var(--color-text-faint)", opacity: 0.7 }}>
                {m.os} · {m.browser}
              </span>
            )}
          </div>

          {/* Content */}
          <p style={{ fontSize: "14px", color: "var(--color-text-dim)", lineHeight: "1.7", marginTop: "6px", wordBreak: "break-word" }}>
            {m.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => setReplying(!replying)}
              style={{ fontSize: "11px", color: "var(--color-text-faint)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-heading), sans-serif", cursor: "pointer", background: "none", border: "none", padding: 0 }}
            >
              {replying ? "取消" : "回复"}
            </button>
          </div>

          {/* Reply editor */}
          {replying && (
            <div style={{ marginTop: "12px" }}>
              <MessageEditor
                slug={slug}
                parentId={m.id}
                replyTo={m.nickname}
                onSuccess={() => { setReplying(false); onSuccess(); }}
                compact
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {m.replies && m.replies.length > 0 && (
        <div
          className="mt-4 flex flex-col gap-4"
          style={{ marginLeft: "54px", paddingLeft: "16px", borderLeft: "1px solid var(--color-frame-idle)" }}
        >
          {m.replies.map((reply, i) => (
            <div key={reply.id} className="flex gap-3">
              <img
                src={reply.avatar}
                alt={reply.nickname}
                width={28}
                height={28}
                style={{ width: "28px", height: "28px", flexShrink: 0, border: "1px solid var(--color-frame-idle)", background: "#111" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span style={{ fontSize: "12px", color: "var(--color-text-dim)", fontFamily: "var(--font-heading), sans-serif" }}>{reply.nickname}</span>
                  <span style={{ fontSize: "10px", color: "var(--color-text-faint)" }}>
                    #{floor}-{i + 1} · {timeAgo(reply.createdAt)}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--color-text-faint)", lineHeight: "1.6", marginTop: "4px", wordBreak: "break-word" }}>
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
