import { KpiCard } from "./KpiCard";
import type { AttendanceBreakdown } from "@/lib/gerencial/types";

export function AttendanceSection({ data }: { data: AttendanceBreakdown }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Turnos y asistencia
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Turnos otorgados" value={String(data.grantedAppointments)} accent="charcoal" />
        <KpiCard
          label="Turnos efectivamente donados"
          value={String(data.completedDonations)}
          accent="green"
        />
        <KpiCard
          label="% de ausentismo"
          value={`${Math.round(data.absenteeismRate * 100)}%`}
          accent="coral"
        />
      </div>
    </div>
  );
}
