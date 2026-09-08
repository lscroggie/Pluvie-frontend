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

// Espera mínima entre una donación de sangre entera y una de plaquetas o
// plasma (restricción cruzada, además de la elegibilidad por tipo de
// ELIGIBILITY_DAYS). Confirmado según Ley Nacional de Sangre 22.990 /
// Resolución 536/2026.
export const CROSS_TYPE_WAIT_DAYS_WHOLE_BLOOD_TO_APHERESIS = 15;

const MS_PER_DAY = 86_400_000;

export type CrossTypeRestriction = {
  blocked: true;
  lastWholeBloodDate: string;
  eligibleDate: string;
};

/**
 * Restricción cruzada: si el donante donó sangre entera hace menos de
 * CROSS_TYPE_WAIT_DAYS_WHOLE_BLOOD_TO_APHERESIS días, no puede reservar
 * plaquetas ni plasma hasta que se cumpla ese plazo.
 */
export function getCrossTypeRestriction(
  donations: Donation[],
  targetTypeId: DonationTypeId,
  referenceDate: Date,
): CrossTypeRestriction | null {
  if (targetTypeId !== "plaquetas" && targetTypeId !== "plasma") return null;

  const lastWholeBlood = donations
    .filter((d) => d.donationTypeId === "sangre-entera")
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!lastWholeBlood) return null;

  const lastDate = new Date(`${lastWholeBlood.date}T00:00:00`);
  const eligibleDate = new Date(
    lastDate.getTime() + CROSS_TYPE_WAIT_DAYS_WHOLE_BLOOD_TO_APHERESIS * MS_PER_DAY,
  );

  if (referenceDate.getTime() >= eligibleDate.getTime()) return null;

  return {
    blocked: true,
    lastWholeBloodDate: lastWholeBlood.date,
    eligibleDate: eligibleDate.toISOString().slice(0, 10),
  };
}

export type SameTypeRestriction = {
  blocked: true;
  lastDonationDate: string;
  eligibleDate: string;
};

/**
 * Elegibilidad por MISMO tipo: si el donante donó este mismo tipo hace
 * menos de ELIGIBILITY_DAYS[tipo] días, no puede reservar ese tipo de
 * nuevo hasta que se cumpla el plazo.
 */
export function getSameTypeRestriction(
  donations: Donation[],
  targetTypeId: DonationTypeId,
  referenceDate: Date,
): SameTypeRestriction | null {
  const lastOfType = donations
    .filter((d) => d.donationTypeId === targetTypeId)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!lastOfType) return null;

  const lastDate = new Date(`${lastOfType.date}T00:00:00`);
  const eligibleDate = new Date(lastDate.getTime() + ELIGIBILITY_DAYS[targetTypeId] * MS_PER_DAY);

  if (referenceDate.getTime() >= eligibleDate.getTime()) return null;

  return {
    blocked: true,
    lastDonationDate: lastOfType.date,
    eligibleDate: eligibleDate.toISOString().slice(0, 10),
  };
}

export type BookingRestriction = {
  reason: "cross-type" | "same-type";
  lastDonationDate: string;
  eligibleDate: string;
};

/**
 * Restricción a aplicar al RESERVAR un turno: combina la elegibilidad por
 * mismo tipo y la restricción cruzada (sangre entera -> aféresis), y
 * devuelve la que exija esperar más tiempo.
 */
export function getBookingRestriction(
  donations: Donation[],
  targetTypeId: DonationTypeId,
  referenceDate: Date,
): BookingRestriction | null {
  const sameType = getSameTypeRestriction(donations, targetTypeId, referenceDate);
  const crossType = getCrossTypeRestriction(donations, targetTypeId, referenceDate);

  if (sameType && crossType) {
    return new Date(`${crossType.eligibleDate}T00:00:00`) > new Date(`${sameType.eligibleDate}T00:00:00`)
      ? { reason: "cross-type", lastDonationDate: crossType.lastWholeBloodDate, eligibleDate: crossType.eligibleDate }
      : { reason: "same-type", lastDonationDate: sameType.lastDonationDate, eligibleDate: sameType.eligibleDate };
  }
  if (crossType) {
    return { reason: "cross-type", lastDonationDate: crossType.lastWholeBloodDate, eligibleDate: crossType.eligibleDate };
  }
  if (sameType) {
    return { reason: "same-type", lastDonationDate: sameType.lastDonationDate, eligibleDate: sameType.eligibleDate };
  }
  return null;
}

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
    let nextEligible = new Date(lastDate.getTime() + ELIGIBILITY_DAYS[type.id] * MS_PER_DAY);

    // La restricción cruzada (sangre entera -> aféresis) puede exigir una
    // fecha más tardía que la del plazo propio del tipo.
    const crossRestriction = getCrossTypeRestriction(donations, type.id, referenceDate);
    if (crossRestriction) {
      const crossEligible = new Date(`${crossRestriction.eligibleDate}T00:00:00`);
      if (crossEligible.getTime() > nextEligible.getTime()) {
        nextEligible = crossEligible;
      }
    }

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
