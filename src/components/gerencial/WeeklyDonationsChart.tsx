import type { WeeklyDonationPoint } from "@/lib/gerencial/types";

export function WeeklyDonationsChart({ data }: { data: WeeklyDonationPoint[] }) {
  const max = Math.max(...data.map((point) => point.count));

  return (
    <div className="h-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Donaciones por semana
      </h2>

      <div className="mt-6 flex h-48 items-end gap-4">
        {data.map((point) => {
          const heightPct = (point.count / max) * 100;
          return (
            <div key={point.weekLabel} className="group flex flex-1 flex-col items-center">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-[4px] bg-brand-violet transition-opacity group-hover:opacity-80"
                  style={{ height: `${heightPct}%` }}
                  title={`${point.weekLabel}: ${point.count} donaciones`}
                />
              </div>
              <span className="mt-2 text-xs text-zinc-500">{point.weekLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
