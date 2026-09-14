import { BookingHeader } from "@/components/donor-booking/BookingHeader";
import { RoleGate } from "@/components/auth/RoleGate";
import { BloodTypeBadge } from "@/components/donor-profile/BloodTypeBadge";
import { DonationHistorySection } from "@/components/donor-profile/DonationHistorySection";
import { DonorLevelSection } from "@/components/donor-profile/DonorLevelSection";
import { MyAppointmentSection } from "@/components/donor-profile/MyAppointmentSection";
import { NextDonationEligibility } from "@/components/donor-profile/NextDonationEligibility";
import { Pluviometro } from "@/components/donor-profile/Pluviometro";
import { ProfileDrawer } from "@/components/donor-profile/ProfileDrawer";
import { DONOR_BLOOD_TYPE, DONOR_NAME, donations } from "@/lib/donor-profile/data";

export const metadata = {
  title: "Mi perfil · Pluvie",
  description: "Perfil del donante en Pluvie",
};

export default function PerfilPage() {
  const currentYear = new Date().getFullYear();

  return (
    <RoleGate role="donante">
      <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
        <BookingHeader backHref="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
          <div className="flex items-start justify-between gap-3">
            <p className="text-3xl font-semibold text-zinc-900">Hola, {DONOR_NAME}</p>
            <div className="mt-1 flex items-center gap-3">
              <BloodTypeBadge bloodType={DONOR_BLOOD_TYPE} />
              <ProfileDrawer />
            </div>
          </div>

          <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <MyAppointmentSection />
          </section>

          <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <NextDonationEligibility donations={donations} />
          </section>

          <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <Pluviometro donations={donations} year={currentYear} />
          </section>

          <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <DonorLevelSection donations={donations} />
          </section>

          <section
            id="historial"
            className="mt-6 scroll-mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <DonationHistorySection donations={donations} />
          </section>
        </main>
      </div>
    </RoleGate>
  );
}
