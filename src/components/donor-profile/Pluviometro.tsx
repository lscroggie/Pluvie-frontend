import { donationTypes } from "@/lib/donor-booking/data";
import {
  getConsecutiveYearStreak,
  getTotalCounts,
  getYearlyCounts,
  PEOPLE_HELPED_PER_DONATION,
  REFERENCE_CAPS,
} from "@/lib/donor-profile/data";
import type { Donation } from "@/lib/donor-profile/types";
import { FadeInNumber } from "./FadeInNumber";
import { DONATION_TYPE_COLOR } from "./donationColors";
import { DropIcon } from "./DropIcon";

function encouragingLabel(count: number, cap?: number): string {
  if (!cap) {
    if (count === 0) return "Todavía no registrás donaciones este año.";
    return "Cada donación cuenta, ¡gracias por sumar!";
  }
  const ratio = count / cap;
  if (count === 0) return "Arrancá el año cuando quieras.";
  if (ratio >= 1) return "¡Vas excelente este año!";
  if (ratio >= 0.5) return "Vas muy bien este año.";
  return "Buen comienzo de año.";
}

export function Pluviometro({ donations, year }: { donations: Donation[]; year: number }) {
  const counts = getYearlyCounts(donations, year);
  const totalCounts = getTotalCounts(donations);
  const streak = getConsecutiveYearStreak(donations, year);
  const totalYear = counts["sangre-entera"] + counts.plaquetas + counts.plasma;

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <FadeInNumber value={totalYear} className="text-4xl font-bold leading-none text-zinc-900" />
        <span className="text-sm text-zinc-500">donaciones en {year}</span>
      </div>

      <p className="mt-2 text-sm text-zinc-500">
        Tu actividad de donación correspondiente a {year}. Los topes son valores de
        referencia orientativos, no un límite: podés donar más si tu centro lo habilita.
      </p>
      {streak >= 2 && (
        <span className="mt-2 inline-flex rounded-full bg-brand-violet/10 px-3 py-1 text-xs font-medium text-brand-violet">
          Donás hace {streak} años consecutivos, ¡gracias por sostenerlo!
        </span>
      )}

      <h2 className="mt-5 text-lg font-semibold text-zinc-900">
        Tu Pluviómetro
      </h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {donationTypes.map((type, index) => {
          const count = counts[type.id];
          const totalCount = totalCounts[type.id];
          const cap = REFERENCE_CAPS[type.id];
          const color = DONATION_TYPE_COLOR[type.id];
          const cardDelay = index * 90;

          return (
            <div key={type.id} className={`rounded-2xl border border-zinc-200 p-5 ${color.cardBg}`}>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color.iconBg}`}
                >
                  <DropIcon className={`h-4 w-4 ${color.text}`} />
                </span>
                <span className="font-semibold text-zinc-900">{type.name}</span>
              </div>

              <div className="mt-4 flex items-end gap-1.5">
                <FadeInNumber
                  value={count}
                  delayMs={cardDelay}
                  className="text-3xl font-bold leading-none text-zinc-900"
                />
                {cap && <span className="pb-0.5 text-sm text-zinc-400">de {cap} al año</span>}
              </div>

              <p className="mt-4 text-xs text-zinc-500">{encouragingLabel(count, cap)}</p>
              <p className="mt-1 text-xs text-zinc-400">{type.description}</p>

              <div className="mt-4 border-t border-zinc-100 pt-4">
                <div className="flex items-baseline gap-1.5">
                  <FadeInNumber
                    value={totalCount * PEOPLE_HELPED_PER_DONATION}
                    delayMs={cardDelay + 40}
                    className={`text-2xl font-bold leading-none ${color.text}`}
                  />
                  <span className="text-xs text-zinc-500">personas ayudadas</span>
                </div>
                <p className="mt-0.5 text-[11px] text-zinc-400">
                  {totalCount} donaci{totalCount === 1 ? "ón" : "ones"} en total
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
