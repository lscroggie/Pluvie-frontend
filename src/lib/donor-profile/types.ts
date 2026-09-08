import type { DonationTypeId } from "@/lib/donor-booking/types";

export type Donation = {
  id: string;
  donationTypeId: DonationTypeId;
  date: string; // ISO date (YYYY-MM-DD)
  centerName: string;
};

export type DonorEditablePersonalData = {
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};
