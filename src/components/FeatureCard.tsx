import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function FeatureCard({
  title,
  description,
  href,
  icon,
}: FeatureCardProps) {
  return (
    <Link href={href} className="group relative block">
      <div className="relative px-5 py-5 flex flex-col items-center text-center transition-all duration-300">
        {/* Corner brackets — larger, 24px */}
        <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300" />
        <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300" />
        <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300" />
        <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[var(--color-frame-idle)] group-hover:border-[var(--color-frame-active)] transition-colors duration-300" />

        {/* Icon */}
        <div className="mb-4 text-[var(--color-text-faint)] group-hover:text-[var(--color-text-dim)] transition-colors duration-300">
          {icon}
        </div>

        {/* Title */}
        <h3
          className="mb-2 text-[var(--color-text-dim)] group-hover:text-[var(--color-text)] transition-colors duration-300"
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            fontSize: "12px",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-[var(--color-text-faint)] group-hover:text-[var(--color-text-dim)] transition-colors duration-300 max-w-[200px]"
          style={{ fontSize: "11px", lineHeight: "1.6" }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
