import type { DonationTypeId } from "@/lib/donor-booking/types";

export const DONATION_TYPE_COLOR: Record<
  DonationTypeId,
  { text: string; iconBg: string; barBg: string; cardBg: string }
> = {
  "sangre-entera": {
    text: "text-brand-violet",
    iconBg: "bg-brand-violet/10",
    barBg: "bg-brand-violet",
    cardBg: "bg-brand-violet/5",
  },
  plaquetas: {
    text: "text-brand-amber",
    iconBg: "bg-brand-amber/15",
    barBg: "bg-brand-amber",
    cardBg: "bg-brand-amber/5",
  },
  plasma: {
    text: "text-brand-coral",
    iconBg: "bg-brand-coral/15",
    barBg: "bg-brand-coral",
    cardBg: "bg-brand-coral/5",
  },
};
