import { donationTypes } from "@/lib/donor-booking/data";
import type { DonationTypeId } from "@/lib/donor-booking/types";
import { DonationHoursLegend } from "./DonationHoursLegend";

export function StepDonationType({
  onSelect,
}: {
  onSelect: (typeId: DonationTypeId) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">¿Qué querés donar?</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Elegí el tipo de donación para ver los centros y turnos disponibles.
      </p>

      <div className="mt-4">
        <DonationHoursLegend />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {donationTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type.id)}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-zinc-200 p-5 text-left transition-colors hover:border-brand-violet hover:bg-brand-violet/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-violet/10 text-lg font-semibold text-brand-violet group-hover:bg-brand-violet group-hover:text-white">
              {type.name.charAt(0)}
            </span>
            <span className="font-semibold text-zinc-900">{type.name}</span>
            <span className="text-sm text-zinc-500">{type.description}</span>
            <span className="text-xs font-medium text-brand-violet">{type.durationLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
