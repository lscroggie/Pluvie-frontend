// Nivel Donate: definición canónica compartida entre el perfil del propio
// donante y el dashboard gerencial (distribución agregada de donantes por
// nivel). El nivel es permanente y se calcula sobre el total histórico de
// donaciones efectivas de por vida, nunca sobre el contador anual.

export type DonorLevelId = "bronce" | "plata" | "oro" | "diamante";

type DonorLevelDefinition = {
  id: DonorLevelId;
  label: string;
  minDonations: number;
  rangeLabel: string;
  color: string;
};

export const DONOR_LEVELS: DonorLevelDefinition[] = [
  { id: "bronce", label: "Bronce", minDonations: 1, rangeLabel: "1-2 donaciones", color: "#CD7F32" },
  { id: "plata", label: "Plata", minDonations: 3, rangeLabel: "3-4 donaciones", color: "#A0A0A8" },
  { id: "oro", label: "Oro", minDonations: 5, rangeLabel: "5-9 donaciones", color: "#C8990A" },
  { id: "diamante", label: "Diamante", minDonations: 10, rangeLabel: "10+ donaciones", color: "#7F77DD" },
];

export const DONOR_LEVEL_LABELS: Record<DonorLevelId, string> = Object.fromEntries(
  DONOR_LEVELS.map((level) => [level.id, level.label]),
) as Record<DonorLevelId, string>;

export const DONOR_LEVEL_RANGES: Record<DonorLevelId, string> = Object.fromEntries(
  DONOR_LEVELS.map((level) => [level.id, level.rangeLabel]),
) as Record<DonorLevelId, string>;

export const DONOR_LEVEL_COLORS: Record<DonorLevelId, string> = Object.fromEntries(
  DONOR_LEVELS.map((level) => [level.id, level.color]),
) as Record<DonorLevelId, string>;

/** Nivel actual según el total histórico de donaciones. null si todavía no donó nunca. */
export function getDonorLevel(totalDonations: number): DonorLevelId | null {
  let current: DonorLevelId | null = null;
  for (const level of DONOR_LEVELS) {
    if (totalDonations >= level.minDonations) current = level.id;
  }
  return current;
}

/** Siguiente nivel a alcanzar. null si ya está en el nivel más alto (Diamante). */
export function getNextDonorLevel(level: DonorLevelId | null): DonorLevelDefinition | null {
  const index = level ? DONOR_LEVELS.findIndex((l) => l.id === level) : -1;
  return DONOR_LEVELS[index + 1] ?? null;
}
