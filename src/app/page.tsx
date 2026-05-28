import CTAButton from "@/components/CTAButton";
import FeatureCard from "@/components/FeatureCard";
import ScrollHint from "@/components/ScrollHint";
import Slogan from "@/components/Slogan";
import { getAllPosts } from "@/lib/posts";
import { SITE_DESCRIPTION } from "@/config/site";

function IconCrosshair() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="16" cy="16" r="8" />
      <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
      <line x1="16" y1="4" x2="16" y2="8" />
      <line x1="16" y1="24" x2="16" y2="28" />
      <line x1="4" y1="16" x2="8" y2="16" />
      <line x1="24" y1="16" x2="28" y2="16" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="currentColor">
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
      <circle cx="22" cy="10" r="1.5" />
      <circle cx="10" cy="16" r="1.5" />
      <circle cx="16" cy="16" r="1.5" />
      <circle cx="22" cy="16" r="1.5" />
      <circle cx="10" cy="22" r="1.5" />
      <circle cx="16" cy="22" r="1.5" />
      <circle cx="22" cy="22" r="1.5" />
    </svg>
  );
}

function IconSignal() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="16" cy="16" r="10" />
      <circle cx="16" cy="16" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="16" y="4" width="16" height="16" transform="rotate(45 16 4)" />
    </svg>
  );
}

const features = [
  {
    title: "深度思考",
    description: "长篇文章，关于技术、设计与方法论",
    href: "/posts",
    icon: <IconCrosshair />,
  },
  {
    title: "快速阅读",
    description: "简短的见解与值得记录的想法",
    href: "/posts",
    icon: <IconGrid />,
  },
  {
    title: "技术信号",
    description: "追踪前沿趋势与微弱信号",
    href: "/archive",
    icon: <IconSignal />,
  },
  {
    title: "跨界探索",
    description: "技术、哲学与文化的交汇处",
    href: "/about",
    icon: <IconDiamond />,
  },
];

export default function Home() {
  const posts = getAllPosts();
  const latestSlug = posts.length > 0 ? `/posts/${posts[0].slug}` : "/posts";

  return (
    <div className="relative z-10">
      <section className="relative flex flex-col items-center min-h-screen px-6 pt-24">
        {/* Hero — vertically centered in upper portion */}
        <div className="flex flex-col items-center text-center max-w-5xl mt-auto mb-auto" style={{ paddingBottom: "240px" }}>
          <Slogan />

          <p
            className="mt-8 animate-fade-in-up delay-200"
            style={{
              color: "var(--color-text-faint)",
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: "clamp(12px, 1.2vw, 15px)",
              letterSpacing: "0.3em",
            }}
          >
            {SITE_DESCRIPTION}
          </p>

          <div className="mt-12 animate-fade-in-up delay-400">
            <CTAButton href={latestSlug}>阅读文章</CTAButton>
          </div>
        </div>

        {/* Bottom area: cards + horizontal line + scroll hint */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          {/* Cards row */}
          <div className="w-full max-w-6xl px-6 animate-fade-in-up delay-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  href={feature.href}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>

          {/* Horizontal connecting line */}
          <div className="w-full max-w-6xl px-6 mt-2">
            <div style={{ height: "1px", background: "linear-gradient(to right, transparent 5%, var(--color-frame-idle) 20%, var(--color-frame-idle) 80%, transparent 95%)" }} />
          </div>

          {/* Scroll hint */}
          <div className="py-3 animate-fade-in delay-800">
            <ScrollHint />
          </div>
        </div>
      </section>
    </div>
  );
}
