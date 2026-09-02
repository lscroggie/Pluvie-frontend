import { KpiCard } from "./KpiCard";
import type { AttendanceBreakdown, NotEligibleReason } from "@/lib/gerencial/types";

function pct(count: number, total: number): string {
  return total === 0 ? "0%" : `${Math.round((count / total) * 100)}%`;
}

export function AttendanceSection({
  data,
  notEligibleReasons,
}: {
  data: AttendanceBreakdown;
  notEligibleReasons: NotEligibleReason[];
}) {
  const total = data.grantedAppointments;

  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Turnos: desglose de estados
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Turnos otorgados" value={String(total)} accent="charcoal" sublabel="Referencia" />
        <KpiCard
          label="Ausentismo"
          value={String(data.absenteeismCount)}
          sublabel={pct(data.absenteeismCount, total)}
          accent="coral"
        />
        <KpiCard
          label="Asistió pero no pudo donar"
          value={String(data.notEligibleCount)}
          sublabel={pct(data.notEligibleCount, total)}
          accent="charcoal"
        />
        <KpiCard
          label="Donación efectiva"
          value={String(data.effectiveDonations)}
          sublabel={pct(data.effectiveDonations, total)}
          accent="green"
        />
      </div>

      {data.notEligibleCount > 0 && notEligibleReasons.length > 0 && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium text-zinc-500">
            Motivos de &ldquo;asistió pero no pudo donar&rdquo; (registrados por el staff)
          </p>
          <ul className="mt-3 space-y-2">
            {notEligibleReasons.map((reason) => (
              <li key={reason.label} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">{reason.label}</span>
                <span className="font-semibold text-zinc-700">
                  {reason.count} · {pct(reason.count, data.notEligibleCount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
