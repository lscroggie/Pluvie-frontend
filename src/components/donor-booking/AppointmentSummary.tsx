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
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5">
      <SummaryRow label="Tipo de donación" value={donationType?.name ?? appointment.donationTypeId} />
      <SummaryRow label="Centro" value={appointment.centerName} sub={appointment.centerAddress} />
      <SummaryRow label="Localidad buscada" value={appointment.localityName} />
      <SummaryRow label="Fecha" value={formatDate(appointment.dateStr)} />
      <SummaryRow label="Horario" value={appointment.time} />

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 self-start text-sm font-medium text-red-600 hover:text-red-700"
        >
          Cancelar turno
        </button>
      )}
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
