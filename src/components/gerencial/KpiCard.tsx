import type { KpiDelta } from "@/lib/gerencial/types";

const ACCENT_TEXT: Record<string, string> = {
  violet: "text-brand-violet",
  green: "text-brand-green",
  coral: "text-brand-coral",
  charcoal: "text-brand-charcoal",
};

function DeltaBadge({ delta, light = false }: { delta: KpiDelta; light?: boolean }) {
  if (delta.direction === "neutral") {
    return (
      <p className={`mt-2 text-xs font-medium ${light ? "text-white/70" : "text-zinc-400"}`}>
        {delta.text} vs mes anterior
      </p>
    );
  }

  const arrow = delta.direction === "up" ? "↑" : "↓";
  const colorClass = light
    ? "text-white/90"
    : delta.direction === "up"
      ? "text-brand-green"
      : "text-brand-coral";

  return (
    <p className={`mt-2 text-xs font-medium ${colorClass}`}>
      {arrow} {delta.text} vs mes anterior
    </p>
  );
}

export function KpiCard({
  label,
  value,
  sublabel,
  delta,
  accent = "charcoal",
  highlighted = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
  delta?: KpiDelta;
  accent?: "violet" | "green" | "coral" | "charcoal";
  highlighted?: boolean;
}) {
  if (highlighted) {
    return (
      <div className="rounded-2xl bg-brand-violet p-5">
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="mt-2 text-3xl font-bold leading-none text-white">{value}</p>
        {delta && <DeltaBadge delta={delta} light />}
        {sublabel && <p className="mt-2 text-xs text-white/70">{sublabel}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold leading-none ${ACCENT_TEXT[accent]}`}>{value}</p>
      {delta && <DeltaBadge delta={delta} />}
      {sublabel && <p className="mt-2 text-xs text-zinc-400">{sublabel}</p>}
    </div>
  );
}
