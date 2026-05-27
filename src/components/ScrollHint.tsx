"use client";

export default function ScrollHint() {
  return (
    <div className="flex flex-col items-center gap-0">
      <div style={{ width: "1px", height: "16px", background: "linear-gradient(to bottom, transparent, var(--color-frame-idle))" }} />
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "var(--color-accent-bright)",
          boxShadow: "0 0 10px rgba(193,18,31,0.7)",
          animation: "float 2.5s ease-in-out infinite",
        }}
      />
      <div style={{ width: "1px", height: "12px", background: "linear-gradient(to top, transparent, var(--color-frame-idle))" }} />
    </div>
  );
}
