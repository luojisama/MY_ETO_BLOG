"use client";
import { useCallback, useEffect, useState } from "react";
import type { Message } from "@/types/message";
import MessageEditor from "./MessageEditor";
import MessageItem from "./MessageItem";

interface Props {
  slug?: string;
}

export default function MessageBoard({ slug = "message-board" }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?slug=${slug}`);
      if (res.ok) setMessages(await res.json());
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMessages]);

  function handleSuccess() {
    setToast("留言已发送！");
    setTimeout(() => setToast(""), 3000);
    fetchMessages();
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Toast */}
      {toast && (
        <div
          className="fixed z-50 flex items-center gap-2"
          style={{ top: "80px", right: "24px", background: "var(--color-accent)", color: "#fff", padding: "10px 20px", fontSize: "13px", fontFamily: "var(--font-heading), sans-serif", letterSpacing: "0.1em" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}

      {/* Editor */}
      <div className="relative p-6" style={{ border: "1px solid var(--color-frame-idle)" }}>
        {/* Corner accents */}
        {["top-0 left-0 border-t border-l","top-0 right-0 border-t border-r","bottom-0 left-0 border-b border-l","bottom-0 right-0 border-b border-r"].map((cls, i) => (
          <span key={i} className={`absolute w-4 h-4 ${cls}`} style={{ borderColor: "var(--color-accent-bright)", margin: "-1px" }} />
        ))}

        <h2 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-text-dim)", marginBottom: "20px" }}>
          留下足迹
        </h2>
        <MessageEditor slug={slug} onSuccess={handleSuccess} />
      </div>

      {/* List */}
      <div>
        <h2 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-text-dim)", marginBottom: "20px" }}>
          {loading ? "加载中…" : `共 ${messages.length} 条留言`}
        </h2>

        {!loading && messages.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--color-text-faint)", fontSize: "14px" }}>
            还没有留言，快来抢沙发吧
          </div>
        )}

        <div className="flex flex-col gap-0">
          {messages.map((msg, i) => (
            <MessageItem
              key={msg.id}
              message={msg}
              floor={i + 1}
              slug={slug}
              onSuccess={handleSuccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
