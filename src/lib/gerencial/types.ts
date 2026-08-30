import type { DonationTypeId } from "@/lib/donor-booking/types";

export type ChartPoint = {
  label: string;
  count: number;
};

export type DonationTypeBreakdownItem = {
  id: DonationTypeId;
  label: string;
  count: number;
};

export type BrandAccent = "violet" | "green" | "coral";

// Los 3 estados reales de un turno otorgado (mutuamente excluyentes):
// ausentismo (no vino), asistió pero no pudo donar (motivo clínico evaluado
// por el staff), y donación efectiva (único estado que dispara impacto 3x
// y nivel Donate).
export type AttendanceBreakdown = {
  grantedAppointments: number;
  absenteeismCount: number;
  notEligibleCount: number;
  effectiveDonations: number;
};

export type MonthlyGerencialData = {
  monthKey: string; // "2026-08"
  monthLabel: string; // "Agosto 2026"
  donationsCount: number; // donación efectiva
  scheduledAppointments: number;
  absenteeismCount: number;
  notEligibleCount: number;
  weeklyDonations: ChartPoint[];
  donationTypeCounts: Record<DonationTypeId, number>;
};

export type Period = { kind: "month"; monthKey: string } | { kind: "year"; year: number } | { kind: "historic" };

export type PeriodOption = {
  value: string;
  label: string;
};

export type KpiDelta = {
  direction: "up" | "down";
  text: string; // "12%" or "3pp", without arrow or "vs ..." suffix
};

export type KpiValue = {
  value: number;
  delta?: KpiDelta;
};

export type Alert = {
  id: string;
  message: string;
};

export type DonorLevelId = "bronce" | "plata" | "oro" | "diamante";

export type DonorLevelBreakdownItem = {
  id: DonorLevelId;
  label: string;
  count: number;
};

export type DashboardViewModel = {
  periodLabel: string;
  kpis: {
    donationsThisMonth: KpiValue;
    peopleHelped: KpiValue;
    scheduledAppointments: KpiValue;
    attendanceRate: KpiValue;
  };
  chart: {
    title: string;
    points: ChartPoint[];
  };
  donationTypeBreakdown: DonationTypeBreakdownItem[];
  attendance: AttendanceBreakdown;
  alerts: Alert[];
};
