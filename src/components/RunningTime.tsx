"use client";
import { useEffect, useState } from "react";
import { SITE_START } from "@/config/site";

const SITE_START_DATE = new Date(`${SITE_START}T00:00:00+08:00`);

function format(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${d} 天 ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function RunningTime() {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const tick = () => setDisplay(format(Date.now() - SITE_START_DATE.getTime()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!display) return null;

  return (
    <span
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: "11px",
        color: "var(--color-text-faint)",
        letterSpacing: "0.05em",
      }}
    >
      已运行 {display}
    </span>
  );
}
