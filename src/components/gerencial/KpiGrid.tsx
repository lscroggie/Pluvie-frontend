import type { DashboardViewModel, Period } from "@/lib/gerencial/types";
import { KpiCard } from "./KpiCard";

function donationsLabel(periodKind: Period["kind"]): string {
  if (periodKind === "month") return "Donaciones este mes";
  if (periodKind === "year") return "Donaciones este año";
  return "Donaciones totales";
}

export function KpiGrid({
  kpis,
  periodKind,
}: {
  kpis: DashboardViewModel["kpis"];
  periodKind: Period["kind"];
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label={donationsLabel(periodKind)}
        value={String(kpis.donationsThisMonth.value)}
        delta={kpis.donationsThisMonth.delta}
        accent="charcoal"
      />
      <KpiCard
        label="Personas ayudadas"
        value={kpis.peopleHelped.value.toLocaleString("es-AR")}
        delta={kpis.peopleHelped.delta}
        sublabel="Multiplicador 3x"
        accent="violet"
      />
      <KpiCard
        label="Turnos programados"
        value={String(kpis.scheduledAppointments.value)}
        delta={kpis.scheduledAppointments.delta}
        accent="charcoal"
      />
      <KpiCard
        label="Tasa de asistencia"
        value={`${kpis.attendanceRate.value}%`}
        delta={kpis.attendanceRate.delta}
        accent="charcoal"
      />
    </div>
  );
}
