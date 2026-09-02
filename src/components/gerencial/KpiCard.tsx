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
  id,
  label,
  value,
  sublabel,
  delta,
  badge,
  accent = "charcoal",
  icon,
  detail,
  highlight = false,
}: {
  // Ancla opcional para navegación interna (ej. desde una alerta con
  // scrollIntoView), no afecta el estilo ni el comportamiento de la card.
  id?: string;
  label: string;
  value: string;
  sublabel?: string;
  delta?: KpiDelta;
  // Slot para un <Badge tone="..."> cuando el estado es semántico (ej.
  // severidad de alertas) en vez de una variación numérica vs. período anterior.
  badge?: ReactNode;
  accent?: "violet" | "green" | "coral" | "charcoal";
  icon?: ReactNode;
  detail?: ReactNode;
  // Métrica North Star: mismo fondo blanco que el resto (ver fix previo que
  // sacó el violeta sólido de las cards destacadas), solo se remarca con un
  // borde violeta y un valor más grande.
  highlight?: boolean;
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
      <p
        className={`mt-1 font-bold leading-none ${highlight ? "text-3xl" : "text-xl"} ${ACCENT_TEXT[accent]}`}
      >
        {value}
      </p>
      {delta && <DeltaBadge delta={delta} />}
      {badge && <div className="mt-1.5">{badge}</div>}
      {sublabel && <p className="mt-1 text-xs text-zinc-400">{sublabel}</p>}
    </>
  );

  const borderClass = highlight ? "border-2 border-brand-violet/40" : "border border-zinc-200";

  if (!detail) {
    return (
      <div id={id} className={`rounded-lg ${borderClass} bg-white p-3 transition-colors hover:bg-brand-violet/10`}>
        {body}
      </div>
    );
  }

  return (
    <div id={id} className={`rounded-lg ${borderClass} bg-white transition-colors hover:bg-brand-violet/10`}>
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
