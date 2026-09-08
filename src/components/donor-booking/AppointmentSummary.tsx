"use client";

import { donationTypes } from "@/lib/donor-booking/data";
import type { Appointment } from "@/lib/donor-booking/appointments";

const DATE_LABEL = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function formatDate(dateStr: string): string {
  const label = DATE_LABEL.format(new Date(`${dateStr}T00:00:00`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function AppointmentSummary({
  appointment,
  onCancel,
}: {
  appointment: Appointment;
  onCancel?: () => void;
}) {
  const donationType = donationTypes.find((t) => t.id === appointment.donationTypeId);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-4">
      <SummaryRow label="Tipo de donación" value={donationType?.name ?? appointment.donationTypeId} />
      <SummaryRow label="Centro" value={appointment.centerName} sub={appointment.centerAddress} inline />
      <SummaryRow
        label="Fecha y horario"
        value={`${formatDate(appointment.dateStr)} · ${appointment.time}`}
      />

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-1 flex items-center gap-1 self-start rounded-full border border-brand-violet px-3 py-1.5 text-xs font-semibold text-brand-violet transition-colors hover:bg-brand-violet hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
          Cancelar turno
        </button>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  sub,
  inline,
}: {
  label: string;
  value: string;
  sub?: string;
  inline?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-right text-sm font-medium text-zinc-900">
        {value}
        {sub &&
          (inline ? (
            <span className="text-xs font-normal text-zinc-400"> · {sub}</span>
          ) : (
            <span className="block text-xs font-normal text-zinc-400">{sub}</span>
          ))}
      </span>
    </div>
  );
}
