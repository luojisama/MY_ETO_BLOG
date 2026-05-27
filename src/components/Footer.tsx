import RunningTime from "./RunningTime";
import Link from "next/link";
import { SITE_TITLE } from "@/config/site";

export default function Footer() {
  return (
    <footer className="relative z-10" style={{ borderTop: "1px solid var(--color-frame-idle)" }}>
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left */}
        <p style={{ fontSize: "12px", letterSpacing: "0.12em", color: "var(--color-text-faint)" }}>
          &copy; {new Date().getFullYear()}{" "}
          <span style={{ fontFamily: "var(--font-heading), sans-serif" }}>{SITE_TITLE}</span>
        </p>

        {/* Center: running time */}
        <RunningTime />

        {/* Right */}
        <div className="flex items-center gap-4" style={{ fontSize: "11px", color: "var(--color-text-faint)", letterSpacing: "0.1em" }}>
          <Link href="/friends" className="hover:text-white transition-colors duration-200">友链</Link>
          <span style={{ opacity: 0.3 }}>·</span>
          <Link href="/messages" className="hover:text-white transition-colors duration-200">留言</Link>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ fontFamily: "var(--font-heading), sans-serif" }}>Next.js</span>
        </div>
      </div>
    </footer>
  );
}
