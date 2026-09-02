"use client";

import { useState, type ReactNode } from "react";
import type { KpiDelta } from "@/lib/gerencial/types";
import { ChevronIcon } from "./icons";

const ACCENT_TEXT: Record<string, string> = {
  violet: "text-brand-violet",
  green: "text-brand-green",
  coral: "text-brand-coral",
  charcoal: "text-brand-charcoal",
};

function DeltaBadge({ delta }: { delta: KpiDelta }) {
  if (delta.direction === "neutral") {
    return (
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">{delta.text}</span>
        <span className="text-[10px] text-zinc-400">vs mes anterior</span>
      </div>
    );
  }

  const arrow = delta.direction === "up" ? "↑" : "↓";
  const colorClass = delta.direction === "up" ? "bg-brand-green" : "bg-brand-coral";

  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold text-white ${colorClass}`}>
        {arrow} {delta.text}
      </span>
      <span className="text-[10px] text-zinc-400">vs mes anterior</span>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  sublabel,
  delta,
  accent = "charcoal",
  icon,
  detail,
}: {
  label: string;
  value: string;
  sublabel?: string;
  delta?: KpiDelta;
  accent?: "violet" | "green" | "coral" | "charcoal";
  icon?: ReactNode;
  detail?: ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const body = (
    <>
      <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
        {icon}
        {label}
        {detail && (
          <ChevronIcon
            className={`ml-auto h-3 w-3 shrink-0 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        )}
      </p>
      <p className={`mt-1 text-xl font-bold leading-none ${ACCENT_TEXT[accent]}`}>{value}</p>
      {delta && <DeltaBadge delta={delta} />}
      {sublabel && <p className="mt-1 text-xs text-zinc-400">{sublabel}</p>}
    </>
  );

  if (!detail) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:bg-brand-violet/10">
        {body}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white transition-colors hover:bg-brand-violet/10">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className="w-full p-3 text-left"
      >
        {body}
      </button>
      {isExpanded && <div className="border-t border-zinc-100 px-3 pb-3 pt-2.5">{detail}</div>}
    </div>
  );
}
