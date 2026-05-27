import type { Metadata } from "next";
import { friendLinks, myFriendLink } from "@/config/friends";
import FriendCard from "@/components/FriendCard";
import FriendCircle from "@/components/FriendCircle";

export const metadata: Metadata = { title: "友链" };

export default function FriendsPage() {
  const hasFriends = friendLinks.length > 0;

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
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

          {/* Apply info */}
          <div
            className="mt-10 p-5 relative"
            style={{ border: "1px solid var(--color-frame-idle)" }}
          >
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: "var(--color-accent)", margin: "-1px" }} />
            <h3 style={{ fontFamily: "var(--font-heading), sans-serif", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-text-dim)", marginBottom: "10px" }}>
              申请友链
            </h3>
            <p style={{ fontSize: "13px", color: "var(--color-text-faint)", lineHeight: "1.8" }}>
              如需互链，请在{" "}
              <a href="/messages" style={{ color: "var(--color-accent-bright)", textDecoration: "underline", textUnderlineOffset: "3px" }}>留言板</a>{" "}
              留言或通过关于页联系我。<br />
              格式参考：名称 / 描述 / 地址 / 头像 / RSS（可选）
            </p>
            {/* My link info to copy */}
            <div className="mt-4 p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-frame-idle)", fontSize: "11px", color: "var(--color-text-faint)", fontFamily: "var(--font-mono), monospace", lineHeight: "1.9" }}>
              <div>名称：{myFriendLink.title}</div>
              <div>简介：{myFriendLink.desc}</div>
              <div>地址：{myFriendLink.siteurl}</div>
              <div>头像：{myFriendLink.siteurl}/avatar.svg</div>
            </div>
          </div>
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
