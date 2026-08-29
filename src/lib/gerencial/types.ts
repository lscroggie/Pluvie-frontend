import type { DonationTypeId } from "@/lib/donor-booking/types";

export type WeeklyDonationPoint = {
  weekLabel: string;
  count: number;
};

export type DonationTypeBreakdownItem = {
  id: DonationTypeId;
  label: string;
  count: number;
};

export type BrandAccent = "violet" | "green" | "coral";

export type GerencialSummary = {
  donationsThisMonth: number;
  scheduledAppointments: number;
  attendanceRate: number;
};

export type AttendanceBreakdown = {
  grantedAppointments: number;
  completedDonations: number;
  absenteeismRate: number;
};
