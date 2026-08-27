import type { DonationTypeId } from "@/lib/donor-booking/types";

export type Donation = {
  id: string;
  donationTypeId: DonationTypeId;
  date: string; // ISO date (YYYY-MM-DD)
  centerName: string;
};
