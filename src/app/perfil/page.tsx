import { BookingHeader } from "@/components/donor-booking/BookingHeader";
import { AuthGate } from "@/components/donor-auth/AuthGate";
import { DonationHistorySection } from "@/components/donor-profile/DonationHistorySection";
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
    <AuthGate>
      <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
        <BookingHeader backHref="/" />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
          <div className="flex items-start justify-between gap-3">
            <p className="text-3xl font-semibold text-zinc-900">Hola, {DONOR_NAME}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="inline-flex h-11 shrink-0 items-center rounded-full bg-brand-violet px-5 text-2xl font-extrabold leading-none text-white shadow-sm">
                {DONOR_BLOOD_TYPE}
              </span>
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
            <DonationHistorySection donations={donations} />
          </section>
        </main>
      </div>
    </AuthGate>
  );
}
