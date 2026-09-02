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

export const DONOR_LEVEL_LABELS: Record<DonorLevelId, string> = {
  bronce: "Bronce",
  plata: "Plata",
  oro: "Oro",
  diamante: "Diamante",
};

// Mock: snapshot de la cantidad de donantes por nivel al cierre de cada mes
// (acumulado hasta ese mes, no nuevos donantes del mes). Permite detectar
// alertas de tendencia (ej. "Donantes Oro en descenso") comparando dos meses
// consecutivos. Las claves coinciden con monthlyData en data.ts.
export const monthlyDonorLevelCounts: { monthKey: string; counts: Record<DonorLevelId, number> }[] = [
  { monthKey: "2026-01", counts: { bronce: 430, plata: 220, oro: 88, diamante: 24 } },
  { monthKey: "2026-02", counts: { bronce: 441, plata: 228, oro: 90, diamante: 25 } },
  { monthKey: "2026-03", counts: { bronce: 452, plata: 236, oro: 93, diamante: 26 } },
  { monthKey: "2026-04", counts: { bronce: 459, plata: 241, oro: 96, diamante: 27 } },
  { monthKey: "2026-05", counts: { bronce: 466, plata: 247, oro: 82, diamante: 28 } },
  { monthKey: "2026-06", counts: { bronce: 471, plata: 251, oro: 85, diamante: 29 } },
  { monthKey: "2026-07", counts: { bronce: 476, plata: 255, oro: 89, diamante: 29 } },
  { monthKey: "2026-08", counts: { bronce: 480, plata: 260, oro: 95, diamante: 30 } },
];
