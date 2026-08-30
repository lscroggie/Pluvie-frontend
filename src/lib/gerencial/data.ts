import { PEOPLE_HELPED_PER_DONATION } from "@/lib/donor-profile/data";
import type { DonationTypeId } from "@/lib/donor-booking/types";
import type {
  Alert,
  AttendanceBreakdown,
  ChartPoint,
  DashboardViewModel,
  DonationTypeBreakdownItem,
  KpiDelta,
  MonthlyGerencialData,
  Period,
  PeriodOption,
} from "./types";

// Umbrales de alerta gerencial: por debajo de esto se considera variación
// normal y no se muestra alerta.
const ABSENTEEISM_ALERT_THRESHOLD_PP = 10;
const DONATION_DROP_ALERT_THRESHOLD_PCT = 20;

// Mock: de los turnos otorgados que no terminan en donación efectiva, esta
// proporción corresponde a "asistió pero no pudo donar" (motivo clínico) y
// el resto a ausentismo real. No existe hoy este desglose en los datos
// históricos, así que se estima con esta proporción fija.
const NOT_ELIGIBLE_SHARE_OF_GAP = 0.2;

const DONATION_TYPE_LABELS: Record<DonationTypeId, string> = {
  "sangre-entera": "Glóbulos rojos",
  plaquetas: "Plaquetas",
  plasma: "Plasma",
};

// Datos mock del dashboard gerencial, mes a mes. En producción vendrían
// agregados desde el backend por institución (Pluvie no compara instituciones
// entre sí). Solo hay datos hasta el mes actual (agosto 2026): no se inventan
// meses futuros ni un 2025 completo, así enero 2026 queda sin mes anterior con
// el que compararse (caso real de "sin período anterior disponible").

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MONTH_ABBR = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function splitIntoWeeks(total: number): ChartPoint[] {
  const weights = [0.24, 0.27, 0.23, 0.26];
  const counts = weights.slice(0, 3).map((w) => Math.round(total * w));
  counts.push(total - counts.reduce((sum, n) => sum + n, 0));
  return counts.map((count, index) => ({ label: `Sem ${index + 1}`, count }));
}

function splitByDonationType(total: number): Record<DonationTypeId, number> {
  const rojos = Math.round(total * 0.54);
  const plaquetas = Math.round(total * 0.28);
  return {
    "sangre-entera": rojos,
    plaquetas,
    plasma: total - rojos - plaquetas,
  };
}

function buildMonth(
  monthIndex: number,
  year: number,
  donationsCount: number,
  scheduledAppointments: number,
): MonthlyGerencialData {
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const gap = scheduledAppointments - donationsCount;
  const notEligibleCount = Math.round(gap * NOT_ELIGIBLE_SHARE_OF_GAP);
  const absenteeismCount = gap - notEligibleCount;

  return {
    monthKey,
    monthLabel: `${MONTH_NAMES[monthIndex]} ${year}`,
    donationsCount,
    scheduledAppointments,
    absenteeismCount,
    notEligibleCount,
    weeklyDonations: splitIntoWeeks(donationsCount),
    donationTypeCounts: splitByDonationType(donationsCount),
  };
}

export const monthlyData: MonthlyGerencialData[] = [
  buildMonth(0, 2026, 250, 430),
  buildMonth(1, 2026, 270, 450),
  buildMonth(2, 2026, 310, 470),
  buildMonth(3, 2026, 295, 460),
  buildMonth(4, 2026, 330, 490),
  buildMonth(5, 2026, 360, 505),
  buildMonth(6, 2026, 368, 517),
  buildMonth(7, 2026, 412, 548),
];

// Mock: en producción vendría del perfil de la institución logueada.
export const INSTITUTION_NAME = "Swiss Medical";

export const CURRENT_MONTH_KEY = monthlyData[monthlyData.length - 1].monthKey;
const CURRENT_YEAR = Number(CURRENT_MONTH_KEY.slice(0, 4));

export function serializePeriod(period: Period): string {
  if (period.kind === "historic") return "historic";
  return period.kind === "month" ? `month:${period.monthKey}` : `year:${period.year}`;
}

export function parsePeriod(value: string): Period {
  if (value === "historic") return { kind: "historic" };
  const [kind, rest] = value.split(":");
  return kind === "year" ? { kind: "year", year: Number(rest) } : { kind: "month", monthKey: rest };
}

export function getPeriodOptions(): PeriodOption[] {
  const monthOptions = [...monthlyData]
    .reverse()
    .map((month) => ({ value: serializePeriod({ kind: "month", monthKey: month.monthKey }), label: month.monthLabel }));

  return [
    { value: serializePeriod({ kind: "historic" }), label: "Histórico" },
    { value: serializePeriod({ kind: "year", year: CURRENT_YEAR }), label: `${CURRENT_YEAR} (año completo)` },
    ...monthOptions,
  ];
}

function computeDelta(current: number, previous: number | undefined, unit: "pct" | "pp"): KpiDelta | undefined {
  if (previous === undefined) return undefined;

  if (unit === "pp") {
    const diff = current - previous;
    return { direction: diff >= 0 ? "up" : "down", text: `${Math.round(Math.abs(diff))}pp` };
  }

  if (previous === 0) return undefined;
  const diff = ((current - previous) / previous) * 100;
  return { direction: diff >= 0 ? "up" : "down", text: `${Math.round(Math.abs(diff))}%` };
}

function sumDonationTypeCounts(months: MonthlyGerencialData[]): Record<DonationTypeId, number> {
  return months.reduce<Record<DonationTypeId, number>>(
    (acc, month) => ({
      "sangre-entera": acc["sangre-entera"] + month.donationTypeCounts["sangre-entera"],
      plaquetas: acc.plaquetas + month.donationTypeCounts.plaquetas,
      plasma: acc.plasma + month.donationTypeCounts.plasma,
    }),
    { "sangre-entera": 0, plaquetas: 0, plasma: 0 },
  );
}

function toBreakdown(counts: Record<DonationTypeId, number>): DonationTypeBreakdownItem[] {
  return (Object.keys(DONATION_TYPE_LABELS) as DonationTypeId[]).map((id) => ({
    id,
    label: DONATION_TYPE_LABELS[id],
    count: counts[id],
  }));
}

function computeAlerts(month: MonthlyGerencialData, previous: MonthlyGerencialData | undefined): Alert[] {
  if (!previous) return [];

  const alerts: Alert[] = [];

  const currentAbsenteeismPct = (month.absenteeismCount / month.scheduledAppointments) * 100;
  const previousAbsenteeismPct = (previous.absenteeismCount / previous.scheduledAppointments) * 100;
  const absenteeismDeltaPp = currentAbsenteeismPct - previousAbsenteeismPct;

  if (absenteeismDeltaPp > ABSENTEEISM_ALERT_THRESHOLD_PP) {
    alerts.push({
      id: "absenteeism-spike",
      message: `La tasa de ausentismo subió ${Math.round(absenteeismDeltaPp)}pp vs. ${previous.monthLabel} (de ${Math.round(previousAbsenteeismPct)}% a ${Math.round(currentAbsenteeismPct)}%).`,
    });
  }

  for (const id of Object.keys(DONATION_TYPE_LABELS) as DonationTypeId[]) {
    const currentCount = month.donationTypeCounts[id];
    const previousCount = previous.donationTypeCounts[id];
    if (previousCount === 0) continue;

    const dropPct = ((previousCount - currentCount) / previousCount) * 100;
    if (dropPct > DONATION_DROP_ALERT_THRESHOLD_PCT) {
      alerts.push({
        id: `donation-drop-${id}`,
        message: `Las donaciones de ${DONATION_TYPE_LABELS[id]} cayeron ${Math.round(dropPct)}% vs. ${previous.monthLabel} (de ${previousCount} a ${currentCount}).`,
      });
    }
  }

  return alerts;
}

function toAttendance(scheduled: number, absenteeismCount: number, notEligibleCount: number, effectiveDonations: number): AttendanceBreakdown {
  return {
    grantedAppointments: scheduled,
    absenteeismCount,
    notEligibleCount,
    effectiveDonations,
  };
}

function aggregateMonths(months: MonthlyGerencialData[]) {
  const donationsTotal = months.reduce((sum, month) => sum + month.donationsCount, 0);
  const scheduledTotal = months.reduce((sum, month) => sum + month.scheduledAppointments, 0);
  const absenteeismTotal = months.reduce((sum, month) => sum + month.absenteeismCount, 0);
  const notEligibleTotal = months.reduce((sum, month) => sum + month.notEligibleCount, 0);

  return {
    kpis: {
      donationsThisMonth: { value: donationsTotal },
      peopleHelped: { value: donationsTotal * PEOPLE_HELPED_PER_DONATION },
      scheduledAppointments: { value: scheduledTotal },
      attendanceRate: {
        value: scheduledTotal === 0 ? 0 : Math.round((1 - absenteeismTotal / scheduledTotal) * 100),
      },
    },
    donationTypeBreakdown: toBreakdown(sumDonationTypeCounts(months)),
    attendance: toAttendance(scheduledTotal, absenteeismTotal, notEligibleTotal, donationsTotal),
  };
}

export function getDashboardViewModel(period: Period): DashboardViewModel {
  if (period.kind === "month") {
    const index = monthlyData.findIndex((month) => month.monthKey === period.monthKey);
    const month = monthlyData[index];
    const previous = monthlyData[index - 1];
    const attendanceRate = 1 - month.absenteeismCount / month.scheduledAppointments;
    const previousAttendanceRate = previous ? 1 - previous.absenteeismCount / previous.scheduledAppointments : undefined;

    return {
      periodLabel: month.monthLabel,
      kpis: {
        donationsThisMonth: {
          value: month.donationsCount,
          delta: computeDelta(month.donationsCount, previous?.donationsCount, "pct"),
        },
        peopleHelped: {
          value: month.donationsCount * PEOPLE_HELPED_PER_DONATION,
          delta: computeDelta(month.donationsCount, previous?.donationsCount, "pct"),
        },
        scheduledAppointments: {
          value: month.scheduledAppointments,
          delta: computeDelta(month.scheduledAppointments, previous?.scheduledAppointments, "pct"),
        },
        attendanceRate: {
          value: Math.round(attendanceRate * 100),
          delta: computeDelta(attendanceRate * 100, previousAttendanceRate && previousAttendanceRate * 100, "pp"),
        },
      },
      chart: { title: "Donaciones por semana", points: month.weeklyDonations },
      donationTypeBreakdown: toBreakdown(month.donationTypeCounts),
      attendance: toAttendance(month.scheduledAppointments, month.absenteeismCount, month.notEligibleCount, month.donationsCount),
      alerts: computeAlerts(month, previous),
    };
  }

  if (period.kind === "year") {
    const yearMonths = monthlyData.filter((month) => month.monthKey.startsWith(String(period.year)));
    const monthlyTotalsByIndex = new Map(yearMonths.map((month) => [Number(month.monthKey.slice(5, 7)) - 1, month.donationsCount]));
    const points: ChartPoint[] = MONTH_ABBR.map((label, index) => ({
      label,
      count: monthlyTotalsByIndex.get(index) ?? 0,
    }));

    return {
      periodLabel: String(period.year),
      ...aggregateMonths(yearMonths),
      chart: { title: "Donaciones por mes", points },
      // No hay un año anterior completo en los datos mock con el que comparar.
      alerts: [],
    };
  }

  const points: ChartPoint[] = monthlyData.map((month) => ({
    label: `${MONTH_ABBR[Number(month.monthKey.slice(5, 7)) - 1]} ${month.monthKey.slice(2, 4)}`,
    count: month.donationsCount,
  }));

  return {
    periodLabel: "Histórico",
    ...aggregateMonths(monthlyData),
    chart: { title: "Donaciones por mes", points },
    // Un histórico no tiene un "período anterior" con el que compararse.
    alerts: [],
  };
}
