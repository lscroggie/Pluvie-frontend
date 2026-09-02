import { PEOPLE_HELPED_PER_DONATION } from "@/lib/donor-profile/data";
import type { DonationTypeId } from "@/lib/donor-booking/types";
import { DONOR_LEVEL_LABELS, monthlyDonorLevelCounts } from "./donorLevels";
import type {
  Alert,
  AttendanceBreakdown,
  ChartPoint,
  DashboardViewModel,
  DonationTypeBreakdownItem,
  DonorLevelId,
  DonorSegmentation,
  KpiDelta,
  MonthlyGerencialData,
  Period,
  PeriodOption,
  SocialImpact,
  Suggestion,
} from "./types";

// Umbrales de alerta gerencial: por debajo de esto se considera variación
// normal y no se muestra alerta.
const ABSENTEEISM_ALERT_THRESHOLD_PP = 10;
const DONATION_DROP_ALERT_THRESHOLD_PCT = 20;
const DONOR_LEVEL_DROP_ALERT_THRESHOLD_PCT = 10;
const LOW_SLOT_AVAILABILITY_THRESHOLD_PCT = 50;

// Mock: de los donantes detrás de las donaciones efectivas del mes, esta
// proporción corresponde a donantes nuevos (primera donación) y el resto a
// recurrentes. No existe hoy un modelo de donante individual con historial,
// así que se estima con esta proporción fija en vez de derivarse de datos
// reales por donante.
const NEW_DONOR_SHARE = 0.3;

// Mock: litros por donación efectiva de sangre entera (valor estándar de
// referencia, ~450ml). Es una aproximación simple, no un dato clínico real
// por donante ni por tipo de donación.
const LITERS_PER_EFFECTIVE_DONATION = 0.45;

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

function splitNewVsRecurringDonors(total: number): { newDonorsCount: number; recurringDonorsCount: number } {
  const newDonorsCount = Math.round(total * NEW_DONOR_SHARE);
  return { newDonorsCount, recurringDonorsCount: total - newDonorsCount };
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
    ...splitNewVsRecurringDonors(donationsCount),
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

// Mock: turnos ya reservados vs. capacidad disponible para la semana que
// viene, por tipo de donación. Es información puntual de "ahora", no
// histórica por mes, así que solo tiene sentido mostrarla cuando se está
// viendo el mes actual.
type UpcomingSlotAvailability = { donationType: DonationTypeId; scheduledCount: number; capacityCount: number };

const UPCOMING_SLOT_AVAILABILITY: UpcomingSlotAvailability[] = [
  { donationType: "sangre-entera", scheduledCount: 38, capacityCount: 60 },
  { donationType: "plaquetas", scheduledCount: 9, capacityCount: 24 },
  { donationType: "plasma", scheduledCount: 20, capacityCount: 30 },
];

// Mock: en producción vendría del perfil de la institución logueada.
export const INSTITUTION_NAME = "Swiss Medical";

export const CURRENT_MONTH_KEY = monthlyData[monthlyData.length - 1].monthKey;
const CURRENT_YEAR = Number(CURRENT_MONTH_KEY.slice(0, 4));

// Mock: hoy simula "se actualizó ahora" con la hora del sistema al cargar la
// página. Cuando se conecte al backend real, reemplazar por el timestamp de
// la última sincronización de datos (ej. devuelto por la API).
export function getLastSyncedAt(): Date {
  return new Date();
}

export function formatLastSyncedAt(date: Date): string {
  return date.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
    const rounded = Math.round(Math.abs(diff));
    if (rounded === 0) return { direction: "neutral", text: "Sin cambios" };
    return { direction: diff >= 0 ? "up" : "down", text: `${rounded} ${rounded === 1 ? "punto" : "puntos"}` };
  }

  if (previous === 0) return undefined;
  const diff = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(diff));
  if (rounded === 0) return { direction: "neutral", text: "Sin cambios" };
  return { direction: diff >= 0 ? "up" : "down", text: `${rounded}%` };
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
      message: `La tasa de ausentismo subió ${Math.round(absenteeismDeltaPp)} puntos vs. ${previous.monthLabel} (de ${Math.round(previousAbsenteeismPct)}% a ${Math.round(currentAbsenteeismPct)}%).`,
      shortLabel: "ausentismo",
      detailTitle: `Ausentismo por semana — ${month.monthLabel}`,
      breakdown: splitIntoWeeks(month.absenteeismCount),
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
        shortLabel: `donaciones de ${DONATION_TYPE_LABELS[id].toLowerCase()}`,
        detailTitle: `${DONATION_TYPE_LABELS[id]} por semana — ${month.monthLabel}`,
        breakdown: splitIntoWeeks(currentCount),
      });
    }
  }

  alerts.push(...computeDonorLevelAlerts(month, previous));

  return alerts;
}

function recentDonorLevelTrend(id: DonorLevelId): ChartPoint[] {
  return monthlyDonorLevelCounts.slice(-4).map((snapshot) => ({
    label: MONTH_ABBR[Number(snapshot.monthKey.slice(5, 7)) - 1],
    count: snapshot.counts[id],
  }));
}

function computeDonorLevelAlerts(month: MonthlyGerencialData, previous: MonthlyGerencialData): Alert[] {
  const currentSnapshot = monthlyDonorLevelCounts.find((snapshot) => snapshot.monthKey === month.monthKey);
  const previousSnapshot = monthlyDonorLevelCounts.find((snapshot) => snapshot.monthKey === previous.monthKey);
  if (!currentSnapshot || !previousSnapshot) return [];

  const alerts: Alert[] = [];

  for (const id of Object.keys(DONOR_LEVEL_LABELS) as DonorLevelId[]) {
    const currentCount = currentSnapshot.counts[id];
    const previousCount = previousSnapshot.counts[id];
    if (previousCount === 0) continue;

    const dropPct = ((previousCount - currentCount) / previousCount) * 100;
    if (dropPct > DONOR_LEVEL_DROP_ALERT_THRESHOLD_PCT) {
      alerts.push({
        id: `donor-level-drop-${id}`,
        message: `Los donantes nivel ${DONOR_LEVEL_LABELS[id]} bajaron ${Math.round(dropPct)}% vs. ${previous.monthLabel} (de ${previousCount} a ${currentCount}).`,
        shortLabel: `donantes ${DONOR_LEVEL_LABELS[id].toLowerCase()} en descenso`,
        detailTitle: `Donantes ${DONOR_LEVEL_LABELS[id]} — últimos meses`,
        breakdown: recentDonorLevelTrend(id),
      });
    }
  }

  return alerts;
}

function findLowAvailabilitySlots(): UpcomingSlotAvailability[] {
  return UPCOMING_SLOT_AVAILABILITY.filter(
    (slot) => (slot.scheduledCount / slot.capacityCount) * 100 < LOW_SLOT_AVAILABILITY_THRESHOLD_PCT,
  );
}

function slotAvailabilityAlerts(slots: UpcomingSlotAvailability[]): Alert[] {
  return slots.map((slot) => {
    const label = DONATION_TYPE_LABELS[slot.donationType];
    const pct = Math.round((slot.scheduledCount / slot.capacityCount) * 100);
    return {
      id: `low-slot-availability-${slot.donationType}`,
      message: `Solo ${slot.scheduledCount} de ${slot.capacityCount} turnos de ${label} están reservados para la próxima semana (${pct}%).`,
      shortLabel: `pocos turnos de ${label.toLowerCase()} reservados`,
      detailTitle: `Turnos de ${label} — próxima semana`,
      breakdown: [
        { label: "Reservados", count: slot.scheduledCount },
        { label: "Capacidad", count: slot.capacityCount },
      ],
    };
  });
}

function slotAvailabilitySuggestions(slots: UpcomingSlotAvailability[]): Suggestion[] {
  return slots.map((slot) => ({
    id: `suggestion-slots-${slot.donationType}`,
    message: `Recomendación: intensificar la difusión de turnos de ${DONATION_TYPE_LABELS[slot.donationType]} esta semana.`,
  }));
}

function toAttendance(scheduled: number, absenteeismCount: number, notEligibleCount: number, effectiveDonations: number): AttendanceBreakdown {
  return {
    grantedAppointments: scheduled,
    absenteeismCount,
    notEligibleCount,
    effectiveDonations,
  };
}

function sumDonorSegmentation(months: MonthlyGerencialData[]): DonorSegmentation {
  return {
    newDonors: months.reduce((sum, month) => sum + month.newDonorsCount, 0),
    recurringDonors: months.reduce((sum, month) => sum + month.recurringDonorsCount, 0),
  };
}

function computeImpact(effectiveDonations: number, livesHelped: number): SocialImpact {
  return {
    litersOfBlood: Math.round(effectiveDonations * LITERS_PER_EFFECTIVE_DONATION * 10) / 10,
    livesHelped,
  };
}

function aggregateMonths(months: MonthlyGerencialData[]) {
  const donationsTotal = months.reduce((sum, month) => sum + month.donationsCount, 0);
  const scheduledTotal = months.reduce((sum, month) => sum + month.scheduledAppointments, 0);
  const absenteeismTotal = months.reduce((sum, month) => sum + month.absenteeismCount, 0);
  const notEligibleTotal = months.reduce((sum, month) => sum + month.notEligibleCount, 0);
  const peopleHelped = donationsTotal * PEOPLE_HELPED_PER_DONATION;

  return {
    kpis: {
      donationsThisMonth: { value: donationsTotal },
      peopleHelped: { value: peopleHelped },
      scheduledAppointments: { value: scheduledTotal },
      attendanceRate: {
        value: scheduledTotal === 0 ? 0 : Math.round((1 - absenteeismTotal / scheduledTotal) * 100),
      },
    },
    donationTypeBreakdown: toBreakdown(sumDonationTypeCounts(months)),
    attendance: toAttendance(scheduledTotal, absenteeismTotal, notEligibleTotal, donationsTotal),
    donorSegmentation: sumDonorSegmentation(months),
    impact: computeImpact(donationsTotal, peopleHelped),
  };
}

export function getDashboardViewModel(period: Period): DashboardViewModel {
  if (period.kind === "month") {
    const index = monthlyData.findIndex((month) => month.monthKey === period.monthKey);
    const month = monthlyData[index];
    const previous = monthlyData[index - 1];
    const attendanceRate = 1 - month.absenteeismCount / month.scheduledAppointments;
    const previousAttendanceRate = previous ? 1 - previous.absenteeismCount / previous.scheduledAppointments : undefined;
    const isCurrentMonth = month.monthKey === CURRENT_MONTH_KEY;
    const lowAvailabilitySlots = isCurrentMonth ? findLowAvailabilitySlots() : [];

    return {
      periodLabel: month.monthLabel,
      previousPeriodLabel: previous?.monthLabel.split(" ")[0].toLowerCase(),
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
      donorSegmentation: { newDonors: month.newDonorsCount, recurringDonors: month.recurringDonorsCount },
      impact: computeImpact(month.donationsCount, month.donationsCount * PEOPLE_HELPED_PER_DONATION),
      // La disponibilidad de turnos de la semana que viene es información de
      // "ahora": solo aplica cuando se está viendo el mes actual, no al mirar
      // un mes pasado.
      alerts: [...computeAlerts(month, previous), ...slotAvailabilityAlerts(lowAvailabilitySlots)],
      suggestions: slotAvailabilitySuggestions(lowAvailabilitySlots),
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
      suggestions: [],
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
    suggestions: [],
  };
}

export function buildExecutiveSummary(viewModel: DashboardViewModel, period: Period): string {
  const prefix = period.kind === "month" ? "Este mes" : period.kind === "year" ? "Este año" : "En total";
  const donations = viewModel.kpis.donationsThisMonth.value.toLocaleString("es-AR");

  let sentence = `${prefix}: ${donations} donaciones`;

  const delta = viewModel.kpis.donationsThisMonth.delta;
  if (delta && viewModel.previousPeriodLabel) {
    if (delta.direction === "neutral") {
      sentence += `, sin cambios respecto a ${viewModel.previousPeriodLabel}`;
    } else {
      const comparative = delta.direction === "up" ? "más" : "menos";
      sentence += `, ${delta.text} ${comparative} que ${viewModel.previousPeriodLabel}`;
    }
  }

  if (viewModel.alerts.length > 0) {
    const labels = viewModel.alerts.map((alert) => alert.shortLabel);
    sentence +=
      viewModel.alerts.length === 1
        ? `, con una alerta activa en ${labels[0]}`
        : `, con ${viewModel.alerts.length} alertas activas (${labels.join(", ")})`;
  }

  return `${sentence}.`;
}
