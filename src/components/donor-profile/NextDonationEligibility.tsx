import { getNextEligibleDateByType } from "@/lib/donor-profile/eligibility";
import type { Donation } from "@/lib/donor-profile/types";

const DATE_LABEL = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

function formatDate(iso: string): string {
  return DATE_LABEL.format(new Date(`${iso}T00:00:00`));
}

export function NextDonationEligibility({
  donations,
  referenceDate = new Date(),
}: {
  donations: Donation[];
  referenceDate?: Date;
}) {
  const rows = getNextEligibleDateByType(donations, referenceDate);

  if (rows.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-zinc-900">Tu próxima donación</h2>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.typeId}
            className={[
              "rounded-2xl border p-4 text-sm",
              row.isEligibleNow
                ? "border-brand-green/30 bg-brand-green/5 text-zinc-900"
                : "border-zinc-200 bg-zinc-50 text-zinc-600",
            ].join(" ")}
          >
            {row.isEligibleNow ? (
              <p>
                <span className="font-semibold text-brand-green">
                  ¡Ya podés donar {row.typeName.toLowerCase()} de nuevo!
                </span>
              </p>
            ) : (
              <p>
                Donaste <span className="font-medium text-zinc-900">{row.typeName.toLowerCase()}</span>{" "}
                el {formatDate(row.lastDate)}. Podés volver a donar {row.typeName.toLowerCase()} a
                partir del <span className="font-medium text-zinc-900">{formatDate(row.nextEligibleDate)}</span>.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
