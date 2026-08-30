import { PEOPLE_HELPED_PER_DONATION } from "@/lib/donor-profile/data";
import type { DonationTypeId } from "@/lib/donor-booking/types";
import type {
  AttendanceBreakdown,
  ChartPoint,
  DashboardViewModel,
  DonationTypeBreakdownItem,
  KpiDelta,
  MonthlyGerencialData,
  Period,
  PeriodOption,
} from "./types";

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
  attendanceRate: number,
): MonthlyGerencialData {
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  return {
    monthKey,
    monthLabel: `${MONTH_NAMES[monthIndex]} ${year}`,
    donationsCount,
    scheduledAppointments,
    completedDonations: Math.round(scheduledAppointments * attendanceRate),
    weeklyDonations: splitIntoWeeks(donationsCount),
    donationTypeCounts: splitByDonationType(donationsCount),
  };
}

export const monthlyData: MonthlyGerencialData[] = [
  buildMonth(0, 2026, 250, 430, 0.86),
  buildMonth(1, 2026, 270, 450, 0.84),
  buildMonth(2, 2026, 310, 470, 0.87),
  buildMonth(3, 2026, 295, 460, 0.85),
  buildMonth(4, 2026, 330, 490, 0.88),
  buildMonth(5, 2026, 360, 505, 0.87),
  buildMonth(6, 2026, 368, 517, 0.86),
  buildMonth(7, 2026, 412, 548, 0.89),
];

// Mock: en producción vendría del perfil de la institución logueada.
export const INSTITUTION_NAME = "Swiss Medical";

export const CURRENT_MONTH_KEY = monthlyData[monthlyData.length - 1].monthKey;
const CURRENT_YEAR = Number(CURRENT_MONTH_KEY.slice(0, 4));

export function serializePeriod(period: Period): string {
  return period.kind === "month" ? `month:${period.monthKey}` : `year:${period.year}`;
}

export function parsePeriod(value: string): Period {
  const [kind, rest] = value.split(":");
  return kind === "year" ? { kind: "year", year: Number(rest) } : { kind: "month", monthKey: rest };
}

export function getPeriodOptions(): PeriodOption[] {
  const monthOptions = [...monthlyData]
    .reverse()
    .map((month) => ({ value: serializePeriod({ kind: "month", monthKey: month.monthKey }), label: month.monthLabel }));

  return [
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
  return [
    { id: "sangre-entera", label: "Glóbulos rojos", count: counts["sangre-entera"] },
    { id: "plaquetas", label: "Plaquetas", count: counts.plaquetas },
    { id: "plasma", label: "Plasma", count: counts.plasma },
  ];
}

function toAttendance(scheduled: number, completed: number): AttendanceBreakdown {
  return {
    grantedAppointments: scheduled,
    completedDonations: completed,
    absenteeismRate: scheduled === 0 ? 0 : 1 - completed / scheduled,
  };
}

export function getDashboardViewModel(period: Period): DashboardViewModel {
  if (period.kind === "month") {
    const index = monthlyData.findIndex((month) => month.monthKey === period.monthKey);
    const month = monthlyData[index];
    const previous = monthlyData[index - 1];
    const attendanceRate = month.completedDonations / month.scheduledAppointments;
    const previousAttendanceRate = previous ? previous.completedDonations / previous.scheduledAppointments : undefined;

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
      attendance: toAttendance(month.scheduledAppointments, month.completedDonations),
    };
  }

  const yearMonths = monthlyData.filter((month) => month.monthKey.startsWith(String(period.year)));
  const donationsTotal = yearMonths.reduce((sum, month) => sum + month.donationsCount, 0);
  const scheduledTotal = yearMonths.reduce((sum, month) => sum + month.scheduledAppointments, 0);
  const completedTotal = yearMonths.reduce((sum, month) => sum + month.completedDonations, 0);

  const monthlyTotalsByIndex = new Map(yearMonths.map((month) => [Number(month.monthKey.slice(5, 7)) - 1, month.donationsCount]));
  const points: ChartPoint[] = MONTH_ABBR.map((label, index) => ({
    label,
    count: monthlyTotalsByIndex.get(index) ?? 0,
  }));

  return {
    periodLabel: String(period.year),
    kpis: {
      donationsThisMonth: { value: donationsTotal },
      peopleHelped: { value: donationsTotal * PEOPLE_HELPED_PER_DONATION },
      scheduledAppointments: { value: scheduledTotal },
      attendanceRate: { value: scheduledTotal === 0 ? 0 : Math.round((completedTotal / scheduledTotal) * 100) },
    },
    chart: { title: "Donaciones por mes", points },
    donationTypeBreakdown: toBreakdown(sumDonationTypeCounts(yearMonths)),
    attendance: toAttendance(scheduledTotal, completedTotal),
  };
}
