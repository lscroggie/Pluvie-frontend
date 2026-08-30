import type { DonorLevelBreakdownItem, DonorLevelId } from "./types";

// Mock: distribución de donantes de la institución por nivel Donate, según
// su cantidad de donaciones históricas TOTAL (todos los años, no solo el
// período seleccionado en el dashboard). Cada donante cuenta una sola vez,
// en el nivel más alto que alcanza.
export const DONOR_LEVEL_RANGES: Record<DonorLevelId, string> = {
  bronce: "1-2 donaciones",
  plata: "3-4 donaciones",
  oro: "5-9 donaciones",
  diamante: "10+ donaciones",
};

export const donorLevelCounts: DonorLevelBreakdownItem[] = [
  { id: "bronce", label: "Bronce", count: 480 },
  { id: "plata", label: "Plata", count: 260 },
  { id: "oro", label: "Oro", count: 95 },
  { id: "diamante", label: "Diamante", count: 30 },
];
