"use client";

import Link from "next/link";
import { AppointmentSummary } from "./AppointmentSummary";
import type { Appointment } from "@/lib/donor-booking/appointments";

export function StepConfirmation({ appointment }: { appointment: Appointment }) {
  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-2xl text-brand-green">
          ✓
        </span>
        <h2 className="mt-4 text-xl font-semibold text-zinc-900">¡Turno confirmado!</h2>
        <p className="mt-1 text-sm text-zinc-500">Te esperamos en el centro elegido.</p>
      </div>

      <div className="mt-6">
        <AppointmentSummary appointment={appointment} />
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl bg-brand-violet/5 p-4">
        <span className="mt-0.5 shrink-0 text-brand-green">●</span>
        <p className="text-sm text-zinc-700">
          Te enviamos tu <span className="font-semibold">código QR de ingreso por WhatsApp</span>{" "}
          al número que registraste, y vas a recibir un{" "}
          <span className="font-semibold">recordatorio un día antes</span> de tu turno.
        </p>
      </div>

      <Link
        href="/perfil"
        className="mt-8 block w-full rounded-full bg-brand-violet px-6 py-3 text-center text-sm font-semibold text-white"
      >
        Ir a mi perfil
      </Link>
    </div>
  );
}
