"use client";
import { useState } from "react";

interface Props {
  slug?: string;
  parentId?: string;
  replyTo?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

const inputStyle = {
  background: "transparent",
  border: "1px solid var(--color-frame-idle)",
  color: "var(--color-text)",
  fontFamily: "var(--font-body), sans-serif",
  fontSize: "13px",
  padding: "8px 12px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
} as const;

export default function MessageEditor({ slug, parentId, replyTo, onSuccess, compact }: Props) {
  const [nickname, setNickname] = useState("");
  const [qq, setQq] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState(replyTo ? `@${replyTo} ` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nickname.trim() || !content.trim()) {
      setError("昵称和内容不能为空");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, qq: qq || undefined, email: email || undefined, website: website || undefined, content, parentId, slug }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "提交失败"); return; }
      if (!compact) { setNickname(""); setQq(""); setEmail(""); setWebsite(""); }
      setContent(replyTo ? `@${replyTo} ` : "");
      onSuccess?.();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      {!compact && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "昵称 *", value: nickname, set: setNickname, type: "text", placeholder: "如何称呼你" },
            { label: "QQ（选填）", value: qq, set: setQq, type: "text", placeholder: "自动获取头像" },
            { label: "邮箱（选填）", value: email, set: setEmail, type: "email", placeholder: "用于回复通知" },
            { label: "网站（选填）", value: website, set: setWebsite, type: "text", placeholder: "https://..." },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label} className="flex flex-col gap-1">
              <label style={{ fontSize: "10px", color: "var(--color-text-faint)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-heading), sans-serif" }}>
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      )}

      {compact && (
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="昵称 *"
          style={inputStyle}
        />
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? `回复 @${replyTo}…` : "留下你的想法…（最多 800 字）"}
        rows={compact ? 3 : 5}
        style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }}
      />

      {error && <p style={{ fontSize: "12px", color: "var(--color-accent-bright)" }}>{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="relative"
          style={{
            padding: "10px 32px",
            background: "transparent",
            border: "1px solid var(--color-accent)",
            color: "var(--color-accent-bright)",
            fontFamily: "var(--font-heading), sans-serif",
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "all 0.2s",
          }}
        >
          {loading ? "发送中…" : parentId ? "发送回复" : "发送留言"}
        </button>
      </div>
    </form>
  );
}
