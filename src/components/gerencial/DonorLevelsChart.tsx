import { DONOR_LEVEL_RANGES } from "@/lib/gerencial/donorLevels";
import type { DonorLevelBreakdownItem } from "@/lib/gerencial/types";
import { DONOR_LEVEL_COLOR } from "./donorLevelColors";

export function DonorLevelsChart({ items }: { items: DonorLevelBreakdownItem[] }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="h-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          Donantes por nivel Donate
        </h2>
        <span className="text-xs text-zinc-400">Total histórico · no varía según el período</span>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => {
          const color = DONOR_LEVEL_COLOR[item.id];
          const widthPct = (item.count / max) * 100;
          const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);

          return (
            <li key={item.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-zinc-700">
                  <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
                  {item.label}
                  <span className="text-xs font-normal text-zinc-400">({DONOR_LEVEL_RANGES[item.id]})</span>
                </span>
                <span className="font-semibold text-zinc-700">
                  {item.count} · {pct}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-zinc-100">
                <div
                  className={`h-2 rounded-full ${color.bar}`}
                  style={{ width: `${widthPct}%` }}
                  title={`${item.label}: ${item.count} donantes`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
