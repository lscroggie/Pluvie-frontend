import type { BloodType } from "./types";

export const BLOOD_TYPES: BloodType[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

// Mock: cantidad de donantes registrados en la institución por tipo de
// sangre, con una distribución aproximada a la frecuencia real de tipos de
// sangre en Argentina. En producción vendría del padrón de donantes real.
export const bloodTypeDonorCounts: Record<BloodType, number> = {
  "O+": 320,
  "O-": 58,
  "A+": 210,
  "A-": 34,
  "B+": 95,
  "B-": 15,
  "AB+": 28,
  "AB-": 5,
};
