import type { DonorLevelId } from "@/lib/gerencial/types";

export const DONOR_LEVEL_COLOR: Record<DonorLevelId, { bar: string; dot: string }> = {
  bronce: { bar: "bg-zinc-300", dot: "bg-zinc-300" },
  plata: { bar: "bg-zinc-400", dot: "bg-zinc-400" },
  oro: { bar: "bg-brand-amber", dot: "bg-brand-amber" },
  diamante: { bar: "bg-brand-violet", dot: "bg-brand-violet" },
};
