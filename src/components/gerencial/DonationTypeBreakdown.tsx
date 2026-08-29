import type { DonationTypeBreakdownItem } from "@/lib/gerencial/types";
import { GERENCIAL_DONATION_COLOR } from "./donationTypeColors";

export function DonationTypeBreakdown({ items }: { items: DonationTypeBreakdownItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="h-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Por tipo de donación
      </h2>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const color = GERENCIAL_DONATION_COLOR[item.id];
          const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);
          return (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-zinc-700">
                <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
                {item.label}
              </span>
              <span className="font-semibold text-zinc-700">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
