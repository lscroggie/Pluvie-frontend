import { DONOR_LEVELS, DONOR_LEVEL_COLORS, getDonorLevel, getNextDonorLevel } from "@/lib/donor-levels";
import { DonorLevelBadge } from "@/components/donor-levels/DonorLevelBadge";
import type { Donation } from "@/lib/donor-profile/types";

export function DonorLevelSection({ donations }: { donations: Donation[] }) {
  const totalDonations = donations.length;
  const level = getDonorLevel(totalDonations);

  if (!level) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Mi nivel</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Todavía no tenés donaciones registradas. Con tu primera donación alcanzás el nivel Bronce.
        </p>
      </div>
    );
  }

  const nextLevel = getNextDonorLevel(level);
  const currentLevelMin = DONOR_LEVELS.find((l) => l.id === level)!.minDonations;
  const progressPct = nextLevel
    ? Math.min(
        100,
        Math.round(((totalDonations - currentLevelMin) / (nextLevel.minDonations - currentLevelMin)) * 100),
      )
    : 100;
  const remaining = nextLevel ? nextLevel.minDonations - totalDonations : 0;

  return (
    <div>
      <h2 className="text-lg font-semibold text-zinc-900">Mi nivel</h2>

      <div className="mt-3 flex items-center gap-3">
        <DonorLevelBadge level={level} />
        <span className="text-sm text-zinc-500">
          {totalDonations} donaci{totalDonations === 1 ? "ón" : "ones"} en total
        </span>
      </div>

      {nextLevel ? (
        <div className="mt-4">
          <p className="text-sm text-zinc-600">
            Te falta{remaining === 1 ? "" : "n"} {remaining} donaci{remaining === 1 ? "ón" : "ones"} para{" "}
            {nextLevel.label}.
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full transition-[width]"
              style={{ width: `${progressPct}%`, backgroundColor: DONOR_LEVEL_COLORS[nextLevel.id] }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-zinc-500">
          Llegaste al nivel más alto. ¡Gracias por sostenerlo!
        </p>
      )}
    </div>
  );
}
