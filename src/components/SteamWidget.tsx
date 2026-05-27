"use client";

import { useState } from "react";

export interface SteamProfile {
  personaname: string;
  avatarfull: string;
  profileurl: string;
  personastate: number; // 0=离线 1=在线 2=忙碌 3=离开 4=打盹 5=交易 6=玩耍
  gameextrainfo?: string; // 当前游戏名
  loccountrycode?: string;
  gameCount?: number;
}

const STATE: Record<number, { label: string; color: string }> = {
  0: { label: "离线", color: "#6b7280" },
  1: { label: "在线", color: "#57cbde" },
  2: { label: "忙碌", color: "#57cbde" },
  3: { label: "离开", color: "#6b7280" },
  4: { label: "打盹", color: "#6b7280" },
  5: { label: "交易中", color: "#57cbde" },
  6: { label: "找人玩", color: "#57cbde" },
};

function SteamIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.255 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.007zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/>
    </svg>
  );
}

export default function SteamWidget({ profile }: { profile: SteamProfile | null }) {
  const [open, setOpen] = useState(false);

  if (!profile) return null;

  const state = STATE[profile.personastate] ?? STATE[0];
  const isOnline = profile.personastate > 0;

  return (
    <section>
      {/* Section header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 transition-colors duration-300 hover:text-[var(--color-text-dim)] group"
        style={{
          fontFamily: "var(--font-heading), sans-serif",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--color-text-faint)",
        }}
        aria-expanded={open}
      >
        <SteamIcon />
        <span>Steam</span>
        {/* Status dot when collapsed */}
        {!open && (
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: state.color,
              display: "inline-block",
              marginLeft: "2px",
            }}
          />
        )}
        <span
          className="ml-auto transition-transform duration-200"
          style={{ transform: open ? "scaleY(-1)" : "none", display: "inline-block" }}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {/* Expandable profile card */}
      {open && (
        <div
          className="mt-3"
          style={{ border: "1px solid var(--color-frame-idle)", background: "rgba(255,255,255,0.02)" }}
        >
          <a
            href={profile.profileurl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 transition-colors duration-300 hover:bg-white/[0.03] group"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {/* Online indicator ring */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  padding: "2px",
                  border: `1px solid ${isOnline ? state.color : "var(--color-frame-idle)"}`,
                  transition: "border-color 0.3s",
                }}
              >
                <img
                  src={profile.avatarfull}
                  alt={profile.personaname}
                  width={48}
                  height={48}
                  style={{ width: "48px", height: "48px", display: "block", objectFit: "cover" }}
                />
              </div>
              {/* Status dot */}
              <span
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: state.color,
                  border: "2px solid var(--color-bg)",
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div
                className="group-hover:text-white transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: "15px",
                  color: "var(--color-text)",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profile.personaname}
              </div>

              <div
                className="mt-1 flex items-center gap-1.5"
                style={{ fontSize: "12px", color: state.color, fontFamily: "var(--font-heading), sans-serif", letterSpacing: "0.05em" }}
              >
                {profile.gameextrainfo ? (
                  <>
                    <span style={{ opacity: 0.7 }}>▶</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {profile.gameextrainfo}
                    </span>
                  </>
                ) : (
                  <span>{state.label}</span>
                )}
              </div>

              <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                {profile.gameCount !== undefined && (
                  <span style={{ fontSize: "11px", color: "var(--color-text-faint)", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.04em" }}>
                    {profile.gameCount.toLocaleString("zh")} 款游戏
                  </span>
                )}
                {profile.loccountrycode && (
                  <span style={{ fontSize: "11px", color: "var(--color-text-faint)", fontFamily: "var(--font-mono), monospace" }}>
                    {profile.loccountrycode}
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
              style={{ color: "var(--color-text-faint)" }}>
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
        </div>
      )}
    </section>
  );
}
