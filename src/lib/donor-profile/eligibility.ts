import { donationTypes } from "@/lib/donor-booking/data";
import type { DonationTypeId } from "@/lib/donor-booking/types";
import type { Donation } from "./types";

// Plazos reales de elegibilidad entre donaciones del mismo tipo.
// Sangre entera: mínimo 2 meses (aproximado a 60 días). Plaquetas y
// plasma (ambos por aféresis): mínimo 14 días.
export const ELIGIBILITY_DAYS: Record<DonationTypeId, number> = {
  "sangre-entera": 60,
  plaquetas: 14,
  plasma: 14,
};

const MS_PER_DAY = 86_400_000;

export type EligibilityByType = {
  typeId: DonationTypeId;
  typeName: string;
  lastDate: string;
  nextEligibleDate: string;
  isEligibleNow: boolean;
};

/**
 * Para cada tipo de donación con al menos una donación previa, calcula
 * cuándo vuelve a estar habilitado según la última donación real de ESE
 * tipo. Tipos sin donaciones previas no generan fila (ya son elegibles).
 */
export function getNextEligibleDateByType(
  donations: Donation[],
  referenceDate: Date,
): EligibilityByType[] {
  const result: EligibilityByType[] = [];

  for (const type of donationTypes) {
    const lastOfType = donations
      .filter((d) => d.donationTypeId === type.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    if (!lastOfType) continue;

    const lastDate = new Date(`${lastOfType.date}T00:00:00`);
    const nextEligible = new Date(lastDate.getTime() + ELIGIBILITY_DAYS[type.id] * MS_PER_DAY);
    const isEligibleNow = referenceDate.getTime() >= nextEligible.getTime();

    result.push({
      typeId: type.id,
      typeName: type.name,
      lastDate: lastOfType.date,
      nextEligibleDate: nextEligible.toISOString().slice(0, 10),
      isEligibleNow,
    });
  }

  return result;
}
