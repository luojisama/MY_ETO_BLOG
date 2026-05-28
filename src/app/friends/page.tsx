import type { Metadata } from "next";
import { friendLinks, myFriendLink } from "@/config/friends";
import FriendCard from "@/components/FriendCard";
import FriendCircle from "@/components/FriendCircle";
import FriendApplySnippet from "@/components/FriendApplySnippet";

export const metadata: Metadata = { title: "友链" };

export default function FriendsPage() {
  const hasFriends = friendLinks.length > 0;

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
      {/* Title */}
      <h1
        className="text-center animate-fade-in-up"
        style={{
          fontFamily: "var(--font-display), var(--font-heading), sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        友链
      </h1>
      <div className="mt-4 mb-14 mx-auto" style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }} />

      {/* Apply snippet — top of page */}
      <div className="animate-fade-in-up delay-100">
        <FriendApplySnippet />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-14 animate-fade-in-up delay-200">
        {/* Left: friend cards */}
        <div>
          <h2 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "16px" }}>
            友情链接
          </h2>

          {/* My own card */}
          <div style={{ marginBottom: "8px" }}>
            <FriendCard friend={myFriendLink} />
          </div>

          {hasFriends ? (
            <div className="flex flex-col gap-2 mt-4">
              {friendLinks.map((f) => <FriendCard key={f.siteurl} friend={f} />)}
            </div>
          ) : (
            <p style={{ color: "var(--color-text-faint)", fontSize: "13px", padding: "20px 0" }}>暂无友链</p>
          )}
        </div>

        {/* Right: friend circle */}
        <div>
          <h2 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--color-text-faint)", marginBottom: "16px" }}>
            友圈动态
          </h2>
          <div className="relative p-4" style={{ border: "1px solid var(--color-frame-idle)" }}>
            <FriendCircle />
          </div>
        </div>
      </div>
    </div>
  );
}
