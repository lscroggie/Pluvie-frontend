const ACCENT_TEXT: Record<string, string> = {
  violet: "text-brand-violet",
  green: "text-brand-green",
  coral: "text-brand-coral",
  charcoal: "text-brand-charcoal",
};

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
  delta?: string;
  accent?: "violet" | "green" | "coral" | "charcoal";
  highlighted?: boolean;
}) {
  if (highlighted) {
    return (
      <div className="rounded-2xl bg-brand-violet p-5">
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="mt-2 text-3xl font-bold leading-none text-white">{value}</p>
        {sublabel && <p className="mt-2 text-xs text-white/70">{sublabel}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold leading-none ${ACCENT_TEXT[accent]}`}>{value}</p>
      {delta && <p className="mt-2 text-xs font-medium text-brand-green">{delta}</p>}
      {sublabel && <p className="mt-2 text-xs text-zinc-400">{sublabel}</p>}
    </div>
  );
}
