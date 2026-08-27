import { donationTypes } from "@/lib/donor-booking/data";
import type { Donation } from "@/lib/donor-profile/types";
import { DONATION_TYPE_COLOR } from "./donationColors";
import { DropIcon } from "./DropIcon";

const DATE_LABEL = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function DonationTimeline({
  donations,
  showHeading = true,
  showType = true,
}: {
  donations: Donation[];
  showHeading?: boolean;
  showType?: boolean;
}) {
  const sorted = [...donations].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      {showHeading && (
        <h2 className="text-lg font-semibold text-zinc-900">Historial de donaciones</h2>
      )}

      <ol className={showHeading ? "mt-4" : ""}>
        {sorted.map((donation, index) => {
          const type = donationTypes.find((t) => t.id === donation.donationTypeId)!;
          const color = DONATION_TYPE_COLOR[donation.donationTypeId];
          const isLast = index === sorted.length - 1;
          const dateLabel = DATE_LABEL.format(new Date(donation.date));

          return (
            <li key={donation.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color.iconBg}`}
                >
                  <DropIcon className={`h-4 w-4 ${color.text}`} />
                </span>
                {!isLast && <span className="w-px flex-1 bg-zinc-200" />}
              </div>
              <div className={isLast ? "pb-1" : "pb-6"}>
                {showType && <p className="text-sm font-medium text-zinc-900">{type.name}</p>}
                <p className={showType ? "text-xs text-zinc-500" : "text-sm font-medium text-zinc-900"}>
                  {dateLabel}
                </p>
                <p className="text-xs text-zinc-400">{donation.centerName}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
