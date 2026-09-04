import type { DonationTypeId } from "@/lib/donor-booking/types";
import type { Donation } from "./types";

// Datos mock del historial de un donante. En producción vendrían del
// registro de donaciones del donante en el backend.

// Nombre mock del donante. En producción vendría del perfil autenticado.
export const DONOR_NAME = "Julieta";

// Grupo y factor sanguíneo mock del donante. En producción vendría del
// perfil autenticado / historia clínica.
export const DONOR_BLOOD_TYPE = "O+";

export const donations: Donation[] = [
  // Año anterior (2025)
  { id: "d0a", donationTypeId: "sangre-entera", date: "2025-03-11", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d0b", donationTypeId: "plaquetas", date: "2025-09-16", centerName: "Centro de Donación Pluvie CABA" },
  // Año en curso (2026)
  { id: "d1", donationTypeId: "sangre-entera", date: "2026-01-14", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d2", donationTypeId: "plaquetas", date: "2026-02-03", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d3", donationTypeId: "plaquetas", date: "2026-02-24", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d4", donationTypeId: "sangre-entera", date: "2026-03-20", centerName: "Centro de Donación Pluvie La Plata" },
  { id: "d5", donationTypeId: "plaquetas", date: "2026-04-10", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d6", donationTypeId: "plaquetas", date: "2026-05-05", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d7", donationTypeId: "plasma", date: "2026-05-28", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d8", donationTypeId: "plaquetas", date: "2026-06-18", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d9", donationTypeId: "sangre-entera", date: "2026-07-22", centerName: "Centro de Donación Pluvie CABA" },
  { id: "d10", donationTypeId: "plaquetas", date: "2026-08-12", centerName: "Centro de Donación Pluvie CABA" },
];

// Topes de referencia anuales, puramente informativos: Pluvie no bloquea
// ninguna donación más allá de estos números.
export const REFERENCE_CAPS: Partial<Record<DonationTypeId, number>> = {
  "sangre-entera": 4,
  plasma: 24,
};

export function getYearlyCounts(
  list: Donation[],
  year: number,
): Record<DonationTypeId, number> {
  const counts: Record<DonationTypeId, number> = {
    "sangre-entera": 0,
    plaquetas: 0,
    plasma: 0,
  };
  for (const donation of list) {
    if (new Date(donation.date).getFullYear() === year) {
      counts[donation.donationTypeId] += 1;
    }
  }
  return counts;
}

// Cada donación ayuda, en promedio, a esta cantidad de personas.
export const PEOPLE_HELPED_PER_DONATION = 3;

export function getConsecutiveYearStreak(list: Donation[], year: number): number {
  const yearsWithDonations = new Set(list.map((d) => new Date(d.date).getFullYear()));
  let streak = 0;
  let current = year;
  while (yearsWithDonations.has(current)) {
    streak += 1;
    current -= 1;
  }
  return streak;
}

export function getTotalCounts(list: Donation[]): Record<DonationTypeId, number> {
  const counts: Record<DonationTypeId, number> = {
    "sangre-entera": 0,
    plaquetas: 0,
    plasma: 0,
  };
  for (const donation of list) {
    counts[donation.donationTypeId] += 1;
  }
  return counts;
}
