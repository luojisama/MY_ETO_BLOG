import type { FriendLink } from "@/types/friend";

interface Props {
  friend: FriendLink;
}

export default function FriendCard({ friend }: Props) {
  return (
    <a
      href={friend.siteurl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 p-4 transition-all duration-300"
      style={{ border: "1px solid var(--color-frame-idle)" }}
    >
      {/* Hover top/left accent lines */}
      <span className="absolute top-0 left-0 w-6 h-6 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />
      <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />

      {/* Avatar */}
      <img
        src={friend.imgurl}
        alt={friend.title}
        width={48}
        height={48}
        style={{ width: "48px", height: "48px", flexShrink: 0, objectFit: "cover", border: "1px solid var(--color-frame-idle)", background: "#111" }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="group-hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "13px", letterSpacing: "0.08em", color: "var(--color-text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {friend.title}
          {friend.isSelf && (
            <span style={{ marginLeft: "6px", fontSize: "9px", padding: "1px 5px", border: "1px solid var(--color-accent)", color: "var(--color-accent-bright)", letterSpacing: "0.15em" }}>ME</span>
          )}
        </p>
        <p style={{ fontSize: "12px", color: "var(--color-text-faint)", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {friend.desc}
        </p>
        {friend.tags && friend.tags.filter(t => t.trim()).length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {friend.tags.filter(t => t.trim()).map((tag) => (
              <span key={tag} style={{ fontSize: "9px", padding: "1px 6px", border: "1px solid var(--color-frame-idle)", color: "var(--color-text-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: "var(--color-text-faint)" }}
      >
        <path d="M7 17L17 7M17 7H7M17 7v10"/>
      </svg>
    </a>
  );
}
