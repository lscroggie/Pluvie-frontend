import { donationTypes } from "@/lib/donor-booking/data";
import type { Center, DonationTypeId, Locality } from "@/lib/donor-booking/types";

const DATE_LABEL = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function StepConfirmation({
  donationTypeId,
  locality,
  center,
  date,
  time,
  onRestart,
}: {
  donationTypeId: DonationTypeId;
  locality: Locality;
  center: Center;
  date: Date;
  time: string;
  onRestart: () => void;
}) {
  const donationType = donationTypes.find((t) => t.id === donationTypeId)!;
  const dateLabel = DATE_LABEL.format(date);
  const capitalizedDateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-2xl text-brand-green">
          ✓
        </span>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900">¡Turno confirmado!</h2>
        <p className="mt-1 text-sm text-zinc-500">Te esperamos en el centro elegido.</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5">
        <SummaryRow label="Tipo de donación" value={donationType.name} />
        <SummaryRow label="Centro" value={center.name} sub={center.address} />
        <SummaryRow label="Localidad buscada" value={locality.name} />
        <SummaryRow label="Fecha" value={capitalizedDateLabel} />
        <SummaryRow label="Horario" value={time} />
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl bg-brand-violet/5 p-4">
        <span className="mt-0.5 shrink-0 text-brand-green">●</span>
        <p className="text-sm text-zinc-700">
          Te enviamos tu <span className="font-semibold">código QR de ingreso por WhatsApp</span>{" "}
          al número que registraste, y vas a recibir un{" "}
          <span className="font-semibold">recordatorio un día antes</span> de tu turno.
        </p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-8 w-full rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white"
      >
        Reservar otro turno
      </button>
    </div>
  );
}

function SummaryRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-right text-sm font-medium text-zinc-900">
        {value}
        {sub && <span className="block text-xs font-normal text-zinc-400">{sub}</span>}
      </span>
    </div>
  );
}
