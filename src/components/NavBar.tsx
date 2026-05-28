"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import { NAV_BRAND } from "@/config/site";

const links = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/thoughts", label: "小事" },
  { href: "/friends", label: "友链" },
  { href: "/messages", label: "留言" },
  { href: "/archive", label: "归档" },
  { href: "/about", label: "关于" },
];

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" strokeWidth="10" opacity="0.5">
        <circle cx="128" cy="128" r="92"/>
        <circle cx="128" cy="128" r="60"/>
      </g>
      <polygon points="128,56 198,178 58,178" fill="none" stroke="currentColor" strokeWidth="12"/>
      <circle cx="128" cy="100" r="5" fill="currentColor"/>
      <circle cx="128" cy="140" r="18" fill="none" stroke="currentColor" strokeWidth="8"/>
      <line x1="128" y1="178" x2="128" y2="215" stroke="#c1121f" strokeWidth="8"/>
      <line x1="105" y1="178" x2="151" y2="178" stroke="#c1121f" strokeWidth="8"/>
      <circle cx="128" cy="178" r="5" fill="#c1121f"/>
    </svg>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Listen for global open-search event (dispatched by ⌘K in SearchModal)
  useEffect(() => {
    const open = () => setSearchOpen(true);
    window.addEventListener("open-search", open);
    return () => window.removeEventListener("open-search", open);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(10,10,10,0.88)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-colors hover:text-white"
            style={{ color: "var(--color-text-dim)" }}
          >
            <LogoIcon />
            <span
              style={{
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: "28px",
                letterSpacing: "0.25em",
                textTransform: "uppercase" as const,
              }}
            >
              {NAV_BRAND}
            </span>
          </Link>

          {/* Desktop links — breakpoint pushed to xl due to 36px font size */}
          <div className="hidden xl:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:text-white"
                style={{
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: "36px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: pathname === link.href ? "var(--color-text)" : "var(--color-text-faint)",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-white"
              style={{ color: "var(--color-text-faint)" }}
              aria-label="搜索 (⌘K)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <kbd style={{ fontSize: "9px", padding: "1px 4px", border: "1px solid var(--color-frame-idle)", color: "var(--color-text-faint)", letterSpacing: "0.05em", lineHeight: "1.4" }}>⌘K</kbd>
            </button>
          </div>

          {/* Mobile / tablet: search + hamburger */}
          <div className="xl:hidden flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} style={{ color: "var(--color-text-faint)" }} aria-label="搜索">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="block w-5 h-px transition-all duration-300" style={{ backgroundColor: "var(--color-text-dim)", transform: menuOpen ? "rotate(45deg) translate(2px, 4px)" : "none" }} />
              <span className="block w-5 h-px transition-all duration-300" style={{ backgroundColor: "var(--color-text-dim)", opacity: menuOpen ? 0 : 1 }} />
              <span className="block w-5 h-px transition-all duration-300" style={{ backgroundColor: "var(--color-text-dim)", transform: menuOpen ? "rotate(-45deg) translate(2px, -4px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile / tablet dropdown */}
        {menuOpen && (
          <div className="xl:hidden border-t" style={{ borderColor: "var(--color-frame-idle)", backgroundColor: "rgba(10,10,10,0.97)" }}>
            <div className="flex flex-col py-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-heading), sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase" as const,
                    color: pathname === link.href ? "var(--color-text)" : "var(--color-text-faint)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
