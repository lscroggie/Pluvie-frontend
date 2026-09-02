import type {
  Alert,
  AttendanceBreakdown,
  DashboardViewModel,
  DonationTypeBreakdownItem,
  KpiTrendSeries,
  Period,
} from "@/lib/gerencial/types";
import { Badge } from "./Badge";
import { GERENCIAL_DONATION_COLOR } from "./donationTypeColors";
import { KpiCard } from "./KpiCard";
import { MiniBreakdownList } from "./MiniBreakdownList";
import { Sparkline } from "./Sparkline";

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

function alertsDetail(alerts: Alert[]) {
  return (
    <ul className="space-y-1.5">
      {alerts.map((alert) => (
        <li key={alert.id} className="text-xs text-zinc-600">
          {alert.message}
        </li>
      ))}
    </ul>
  );
}

function alertsTone(count: number): "positive" | "attention" | "critical" {
  if (count === 0) return "positive";
  if (count === 1) return "attention";
  return "critical";
}

export function KpiGrid({
  kpis,
  periodKind,
  donationTypeBreakdown,
  peopleHelpedBreakdown,
  attendance,
  alerts,
  trends,
}: {
  kpis: DashboardViewModel["kpis"];
  periodKind: Period["kind"];
  donationTypeBreakdown: DonationTypeBreakdownItem[];
  peopleHelpedBreakdown: DonationTypeBreakdownItem[];
  attendance: AttendanceBreakdown;
  alerts: Alert[];
  // Serie mensual real de los últimos períodos, para la mini-tendencia de
  // cada card — ver getKpiTrendSeries en data.ts.
  trends: KpiTrendSeries;
}) {
  const attendanceDetail = <MiniBreakdownList items={attendanceItems(attendance)} />;
  const tone = alertsTone(alerts.length);

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
      <KpiCard
        id="kpi-donations-card"
        label={donationsLabel(periodKind)}
        value={String(kpis.donationsThisMonth.value)}
        delta={kpis.donationsThisMonth.delta}
        accent="violet"
        highlight
        sparkline={<Sparkline points={trends.donations} color="violet" />}
        detail={<MiniBreakdownList title="Por tipo de donación" items={donationTypeItems(donationTypeBreakdown)} />}
      />
      <KpiCard
        label="Personas ayudadas"
        value={kpis.peopleHelped.value.toLocaleString("es-AR")}
        delta={kpis.peopleHelped.delta}
        sublabel="Multiplicador 3x"
        accent="violet"
        sparkline={<Sparkline points={trends.peopleHelped} color="violet" />}
        detail={
          <MiniBreakdownList title="Por tipo de donación (× 3)" items={donationTypeItems(peopleHelpedBreakdown)} />
        }
      />
      <KpiCard
        label="Tasa de asistencia"
        value={`${kpis.attendanceRate.value}%`}
        delta={kpis.attendanceRate.delta}
        accent="charcoal"
        sparkline={<Sparkline points={trends.attendanceRate} color="charcoal" />}
        detail={attendanceDetail}
      />
      <KpiCard
        label="Turnos programados"
        value={String(kpis.scheduledAppointments.value)}
        delta={kpis.scheduledAppointments.delta}
        accent="charcoal"
        sparkline={<Sparkline points={trends.scheduledAppointments} color="charcoal" />}
        detail={attendanceDetail}
      />
      <KpiCard
        label="Alertas activas"
        value={String(alerts.length)}
        accent={alerts.length > 0 ? "coral" : "charcoal"}
        badge={
          <Badge tone={tone}>
            {alerts.length === 0 ? "Sin alertas" : alerts.length === 1 ? "1 activa" : `${alerts.length} activas`}
          </Badge>
        }
        sparkline={<Sparkline points={trends.alertsCount} color="coral" />}
        detail={alerts.length > 0 ? alertsDetail(alerts) : undefined}
      />
    </div>
  );
}
