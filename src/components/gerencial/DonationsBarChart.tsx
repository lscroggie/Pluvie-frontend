import type { ChartPoint } from "@/lib/gerencial/types";

export function DonationsBarChart({ title, points }: { title: string; points: ChartPoint[] }) {
  const max = Math.max(...points.map((point) => point.count), 1);

  return (
    <div className="h-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        {title}
      </h2>

      <div className="mt-6 flex h-48 gap-2">
        {points.map((point) => {
          const heightPct = (point.count / max) * 100;
          return (
            <div key={point.label} className="group flex flex-1 flex-col items-center">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-[4px] bg-brand-violet transition-opacity group-hover:opacity-80"
                  style={{ height: `${heightPct}%` }}
                  title={`${point.label}: ${point.count} donaciones`}
                />
              </div>
              <span className="mt-2 text-xs text-zinc-500">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
