import { PEOPLE_HELPED_PER_DONATION } from "@/lib/donor-profile/data";
import type {
  AttendanceBreakdown,
  DonationTypeBreakdownItem,
  GerencialSummary,
  WeeklyDonationPoint,
} from "./types";

// Datos mock del dashboard gerencial. En producción vendrían agregados desde
// el backend por institución (Pluvie no compara instituciones entre sí).

export const summary: GerencialSummary = {
  donationsThisMonth: 412,
  scheduledAppointments: 548,
  attendanceRate: 0.89,
};

export const peopleHelpedThisMonth = summary.donationsThisMonth * PEOPLE_HELPED_PER_DONATION;

export const weeklyDonations: WeeklyDonationPoint[] = [
  { weekLabel: "Sem 1", count: 96 },
  { weekLabel: "Sem 2", count: 118 },
  { weekLabel: "Sem 3", count: 104 },
  { weekLabel: "Sem 4", count: 142 },
];

export const donationTypeBreakdown: DonationTypeBreakdownItem[] = [
  { id: "sangre-entera", label: "Glóbulos rojos", count: 54 },
  { id: "plaquetas", label: "Plaquetas", count: 28 },
  { id: "plasma", label: "Plasma", count: 18 },
];

export const attendance: AttendanceBreakdown = {
  grantedAppointments: summary.scheduledAppointments,
  completedDonations: Math.round(summary.scheduledAppointments * summary.attendanceRate),
  absenteeismRate: 1 - summary.attendanceRate,
};
