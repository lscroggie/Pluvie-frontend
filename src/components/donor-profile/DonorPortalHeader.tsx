import { DONOR_BLOOD_TYPE, DONOR_NAME } from "@/lib/donor-profile/data";
import { BloodTypeDrop } from "./BloodTypeDrop";
import { ProfileDrawer } from "./ProfileDrawer";

/** Encabezado del portal del donante: saludo y gota con el grupo sanguíneo. */
export function DonorPortalHeader() {
  return (
    <header>
      <div className="flex items-start justify-between gap-3">
        <p className="text-3xl font-semibold text-zinc-900">¡Hola, {DONOR_NAME}!</p>
        <div className="mt-1 flex items-center gap-3">
          <ProfileDrawer />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <BloodTypeDrop bloodType={DONOR_BLOOD_TYPE} className="h-20 w-20 sm:h-24 sm:w-24" />
        <p className="mt-1 text-sm text-zinc-500">Tu grupo sanguíneo</p>
      </div>
    </header>
  );
}
