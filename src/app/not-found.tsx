import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 -mt-16">
      <div className="text-center">
        <h1
          className="animate-fade-in-up"
          style={{
            fontFamily: "var(--font-display), var(--font-heading), sans-serif",
            fontSize: "clamp(5rem, 15vw, 12rem)",
            letterSpacing: "0.1em",
            color: "var(--color-frame-idle)",
          }}
        >
          404
        </h1>

        <p
          className="mt-2 animate-fade-in-up delay-200"
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            fontSize: "13px",
            letterSpacing: "0.35em",
            textTransform: "uppercase" as const,
            color: "var(--color-text-faint)",
          }}
        >
          信号丢失
        </p>

        <div className="mt-3 mx-auto animate-fade-in-up delay-300" style={{ width: "80px", height: "1px", background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }} />

        <div className="mt-10 animate-fade-in-up delay-400">
          <Link
            href="/"
            className="transition-colors duration-300 hover:text-[var(--color-text)]"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
            }}
          >
            &larr; 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
