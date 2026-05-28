import type { Metadata } from "next";
import MessageBoard from "@/components/MessageBoard";

export const metadata: Metadata = { title: "留言板" };

export default function MessagesPage() {
  return (
    <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1
        className="text-center animate-fade-in-up"
        style={{
          fontFamily: "var(--font-display), var(--font-heading), sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        留言板
      </h1>
      <div className="mt-4 mb-14 mx-auto" style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }} />

      <div className="animate-fade-in-up delay-200">
        <MessageBoard slug="message-board" />
      </div>
    </div>
  );
}
