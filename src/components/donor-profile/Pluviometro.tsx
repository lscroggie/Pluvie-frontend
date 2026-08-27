import { donationTypes } from "@/lib/donor-booking/data";
import {
  getConsecutiveYearStreak,
  getTotalCounts,
  getYearlyCounts,
  PEOPLE_HELPED_PER_DONATION,
  REFERENCE_CAPS,
} from "@/lib/donor-profile/data";
import type { Donation } from "@/lib/donor-profile/types";
import { CountUpNumber } from "./CountUpNumber";
import { DONATION_TYPE_COLOR } from "./donationColors";
import { DropIcon } from "./DropIcon";

const INTERVAL_REASON: Record<string, string> = {
  "sangre-entera": "El cuerpo repone el hierro cada ~2 meses, por eso el espacio entre donaciones.",
  plaquetas: "Se reponen en pocos días, por eso podés donar cada 14 días.",
  plasma: "El cuerpo lo repone rápido, pero hay un tope anual de referencia para cuidar tu salud a largo plazo.",
};

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

  return (
    <div>
      <p className="text-sm text-zinc-500">
        Tu actividad de donación correspondiente a {year}. Los topes son valores de
        referencia orientativos, no un límite: podés donar más si tu centro lo habilita.
      </p>
      {streak >= 2 && (
        <span className="mt-2 inline-flex rounded-full bg-brand-violet/10 px-3 py-1 text-xs font-medium text-brand-violet">
          Donás hace {streak} años consecutivos, ¡gracias por sostenerlo!
        </span>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {donationTypes.map((type) => {
          const count = counts[type.id];
          const totalCount = totalCounts[type.id];
          const cap = REFERENCE_CAPS[type.id];
          const color = DONATION_TYPE_COLOR[type.id];
          const progress = cap ? Math.min(100, (count / cap) * 100) : 0;

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
                <CountUpNumber value={count} className="text-3xl font-bold leading-none text-zinc-900" />
                {cap && <span className="pb-0.5 text-sm text-zinc-400">de {cap} al año</span>}
                <span className="group relative ml-0.5 mb-1 inline-flex">
                  <button
                    type="button"
                    aria-label={`Por qué este intervalo para ${type.name.toLowerCase()}`}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none text-zinc-400 hover:text-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                  >
                    ⓘ
                  </button>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    {INTERVAL_REASON[type.id]}
                  </span>
                </span>
              </div>

              {cap && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full ${color.barBg}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <p className="mt-3 text-xs text-zinc-500">{encouragingLabel(count, cap)}</p>
              <p className="mt-1 text-xs text-zinc-400">{type.description}</p>

              <div className="mt-3 border-t border-zinc-100 pt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-bold leading-none ${color.text}`}>
                    {totalCount * PEOPLE_HELPED_PER_DONATION}
                  </span>
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
