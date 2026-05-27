import Link from "next/link";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function CTAButton({ href, children }: CTAButtonProps) {
  return (
    <Link href={href} className="group/cta relative inline-block">
      {/* Outer corner brackets — well separated from button */}
      <span className="absolute w-7 h-7 border-t border-l border-[var(--color-frame-idle)] group-hover/cta:border-[var(--color-frame-active)] transition-colors duration-300" style={{ top: "-10px", left: "-14px" }} />
      <span className="absolute w-7 h-7 border-t border-r border-[var(--color-frame-idle)] group-hover/cta:border-[var(--color-frame-active)] transition-colors duration-300" style={{ top: "-10px", right: "-14px" }} />
      <span className="absolute w-7 h-7 border-b border-l border-[var(--color-frame-idle)] group-hover/cta:border-[var(--color-frame-active)] transition-colors duration-300" style={{ bottom: "-10px", left: "-14px" }} />
      <span className="absolute w-7 h-7 border-b border-r border-[var(--color-frame-idle)] group-hover/cta:border-[var(--color-frame-active)] transition-colors duration-300" style={{ bottom: "-10px", right: "-14px" }} />

      {/* Button body */}
      <span
        className="relative inline-flex items-center gap-3 border transition-all duration-300"
        style={{
          fontFamily: "var(--font-heading), sans-serif",
          padding: "16px 52px",
          borderColor: "var(--color-accent)",
          color: "var(--color-accent-bright)",
          letterSpacing: "0.3em",
          textTransform: "uppercase" as const,
          fontSize: "14px",
        }}
      >
        {children}
        <svg className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>

      <style>{`
        .group\\/cta:hover > span:last-of-type {
          background-color: var(--color-accent-bright) !important;
          border-color: var(--color-accent-bright) !important;
          color: white !important;
        }
      `}</style>
    </Link>
  );
}
