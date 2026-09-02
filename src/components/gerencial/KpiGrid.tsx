import type { AttendanceBreakdown, DashboardViewModel, DonationTypeBreakdownItem, Period } from "@/lib/gerencial/types";
import { GERENCIAL_DONATION_COLOR } from "./donationTypeColors";
import { KpiCard } from "./KpiCard";
import { MiniBreakdownList } from "./MiniBreakdownList";

function donationsLabel(periodKind: Period["kind"]): string {
  if (periodKind === "month") return "Donaciones este mes";
  if (periodKind === "year") return "Donaciones este año";
  return "Donaciones totales";
}

function donationTypeItems(items: DonationTypeBreakdownItem[]) {
  return items.map((item) => ({
    label: item.label,
    count: item.count,
    dotClassName: GERENCIAL_DONATION_COLOR[item.id].dot,
  }));
}

function attendanceItems(data: AttendanceBreakdown) {
  return [
    { label: "Ausentismo", count: data.absenteeismCount, dotClassName: "bg-brand-coral" },
    { label: "Asistió pero no pudo donar", count: data.notEligibleCount, dotClassName: "bg-zinc-400" },
    { label: "Donación efectiva", count: data.effectiveDonations, dotClassName: "bg-brand-green" },
  ];
}

export function KpiGrid({
  kpis,
  periodKind,
  donationTypeBreakdown,
  peopleHelpedBreakdown,
  attendance,
}: {
  kpis: DashboardViewModel["kpis"];
  periodKind: Period["kind"];
  donationTypeBreakdown: DonationTypeBreakdownItem[];
  peopleHelpedBreakdown: DonationTypeBreakdownItem[];
  attendance: AttendanceBreakdown;
}) {
  const attendanceDetail = <MiniBreakdownList items={attendanceItems(attendance)} />;

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label={donationsLabel(periodKind)}
        value={String(kpis.donationsThisMonth.value)}
        delta={kpis.donationsThisMonth.delta}
        accent="charcoal"
        detail={<MiniBreakdownList items={donationTypeItems(donationTypeBreakdown)} />}
      />
      <KpiCard
        label="Personas ayudadas"
        value={kpis.peopleHelped.value.toLocaleString("es-AR")}
        delta={kpis.peopleHelped.delta}
        sublabel="Multiplicador 3x"
        accent="violet"
        detail={
          <MiniBreakdownList title="Por tipo de donación (× 3)" items={donationTypeItems(peopleHelpedBreakdown)} />
        }
      />
      <KpiCard
        label="Turnos programados"
        value={String(kpis.scheduledAppointments.value)}
        delta={kpis.scheduledAppointments.delta}
        accent="charcoal"
        detail={attendanceDetail}
      />
      <KpiCard
        label="Tasa de asistencia"
        value={`${kpis.attendanceRate.value}%`}
        delta={kpis.attendanceRate.delta}
        accent="charcoal"
        detail={attendanceDetail}
      />
    </div>
  );
}
