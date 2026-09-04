"use client";

import Link from "next/link";
import { AppointmentSummary } from "@/components/donor-booking/AppointmentSummary";
import { cancelActiveAppointment } from "@/lib/donor-booking/appointments";
import { useActiveAppointment } from "@/lib/donor-booking/useActiveAppointment";

export function MyAppointmentSection() {
  const appointment = useActiveAppointment();

  if (!appointment) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Mi turno</h2>
          <p className="mt-1 text-sm text-zinc-500">No tenés ningún turno reservado.</p>
        </div>
        <Link
          href="/turno"
          className="rounded-full bg-brand-violet px-5 py-2.5 text-sm font-semibold text-white"
        >
          Reservar turno
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Mi turno</h2>
        <Link href="/turno" className="text-sm font-medium text-brand-violet hover:underline">
          Ver mis turnos
        </Link>
      </div>
      <div className="mt-3">
        <AppointmentSummary appointment={appointment} onCancel={() => cancelActiveAppointment()} />
      </div>
    </div>
  );
}
