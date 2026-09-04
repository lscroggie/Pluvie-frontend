const ROWS = [
  { label: "Sangre entera", hours: "8:00 a 13:30 hs" },
  { label: "Plaquetas (aféresis)", hours: "8:00 a 11:00 hs · cupo limitado por día" },
  { label: "Plasma (aféresis)", hours: "8:00 a 11:00 hs · cupo limitado, rango a confirmar" },
];

export function DonationHoursLegend() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Horarios de atención por tipo de donación
      </p>
      <ul className="mt-2 flex flex-col gap-1">
        {ROWS.map((row) => (
          <li key={row.label} className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
            <span className="font-medium text-zinc-700">{row.label}</span>
            <span className="text-zinc-500">{row.hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
