import type { DonationTypeId } from "@/lib/donor-booking/types";
import type { BrandAccent } from "@/lib/gerencial/types";

// Paleta gerencial: violeta/verde/coral (sin ámbar), a diferencia del mapeo
// usado en /perfil, para ceñirse a la paleta de marca pedida para este rol.
export const GERENCIAL_DONATION_COLOR: Record<DonationTypeId, { accent: BrandAccent; dot: string }> = {
  "sangre-entera": { accent: "violet", dot: "bg-brand-violet" },
  plaquetas: { accent: "green", dot: "bg-brand-green" },
  plasma: { accent: "coral", dot: "bg-brand-coral" },
};
