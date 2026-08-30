import { KpiCard } from "./KpiCard";
import type { AttendanceBreakdown } from "@/lib/gerencial/types";

function pct(count: number, total: number): string {
  return total === 0 ? "0%" : `${Math.round((count / total) * 100)}%`;
}

export function AttendanceSection({ data }: { data: AttendanceBreakdown }) {
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
    </div>
  );
}
