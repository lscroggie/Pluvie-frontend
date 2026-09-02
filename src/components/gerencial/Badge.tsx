import type { ReactNode } from "react";

// Semántica de tono para estados derivados (no reemplaza los badges de
// variación de KpiCard, que ya son sólidos a propósito — ver DeltaBadge).
// "critical" se logra con más opacidad/saturación del coral, no con un color
// nuevo: misma paleta de marca (violeta/verde/coral/charcoal) en todos los tonos.
export type BadgeTone = "positive" | "attention" | "critical" | "neutral";

const TONE_STYLES: Record<BadgeTone, string> = {
  positive: "bg-brand-green/10 text-brand-green",
  attention: "bg-brand-coral/10 text-brand-coral",
  critical: "bg-brand-coral/20 text-brand-coral font-semibold",
  neutral: "bg-brand-charcoal/10 text-brand-charcoal",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONE_STYLES[tone]}`}>
      {children}
    </span>
  );
}
