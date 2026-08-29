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

export type AttendanceBreakdown = {
  grantedAppointments: number;
  completedDonations: number;
  absenteeismRate: number;
};

export type MonthlyGerencialData = {
  monthKey: string; // "2026-08"
  monthLabel: string; // "Agosto 2026"
  donationsCount: number;
  scheduledAppointments: number;
  completedDonations: number;
  weeklyDonations: ChartPoint[];
  donationTypeCounts: Record<DonationTypeId, number>;
};

export type Period = { kind: "month"; monthKey: string } | { kind: "year"; year: number };

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
};
