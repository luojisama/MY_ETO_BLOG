"use client";

import { ReactNode } from "react";

interface CornerFrameProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  hoverActive?: boolean;
  cornerSize?: number;
  lineWidth?: number;
}

export default function CornerFrame({
  children,
  className = "",
  active = false,
  hoverActive = true,
  cornerSize = 20,
  lineWidth = 1,
}: CornerFrameProps) {
  const color = active ? "var(--color-frame-active)" : "var(--color-frame-idle)";
  const hoverColor = "var(--color-frame-active)";

  return (
    <div
      className={`relative group ${className}`}
      style={{ padding: `${cornerSize / 2}px` }}
    >
      {/* Top-left */}
      <span
        className="absolute top-0 left-0 transition-colors duration-300"
        style={{
          width: cornerSize,
          height: cornerSize,
          borderTop: `${lineWidth}px solid ${color}`,
          borderLeft: `${lineWidth}px solid ${color}`,
          ...(hoverActive
            ? {}
            : {}),
        }}
      />
      {/* Top-right */}
      <span
        className="absolute top-0 right-0 transition-colors duration-300"
        style={{
          width: cornerSize,
          height: cornerSize,
          borderTop: `${lineWidth}px solid ${color}`,
          borderRight: `${lineWidth}px solid ${color}`,
        }}
      />
      {/* Bottom-left */}
      <span
        className="absolute bottom-0 left-0 transition-colors duration-300"
        style={{
          width: cornerSize,
          height: cornerSize,
          borderBottom: `${lineWidth}px solid ${color}`,
          borderLeft: `${lineWidth}px solid ${color}`,
        }}
      />
      {/* Bottom-right */}
      <span
        className="absolute bottom-0 right-0 transition-colors duration-300"
        style={{
          width: cornerSize,
          height: cornerSize,
          borderBottom: `${lineWidth}px solid ${color}`,
          borderRight: `${lineWidth}px solid ${color}`,
        }}
      />

      {hoverActive && (
        <style>{`
          .group:hover > span {
            border-color: ${hoverColor} !important;
          }
        `}</style>
      )}

      {children}
    </div>
  );
}
