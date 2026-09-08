"use client";

import { useState } from "react";
import Link from "next/link";
import { AppointmentSummary } from "@/components/donor-booking/AppointmentSummary";
import { cancelActiveAppointment, type Appointment } from "@/lib/donor-booking/appointments";
import { useActiveAppointment } from "@/lib/donor-booking/useActiveAppointment";
import { ToastStack, useToasts } from "@/components/ui/Toast";

const DATE_LABEL = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

function formatDate(dateStr: string): string {
  return DATE_LABEL.format(new Date(`${dateStr}T00:00:00`));
}

export function MyAppointmentSection() {
  const appointment = useActiveAppointment();
  const [pendingCancel, setPendingCancel] = useState<Appointment | null>(null);
  const { toasts, showToast, dismissToast } = useToasts();

  function handleConfirmCancel() {
    if (pendingCancel) {
      cancelActiveAppointment(pendingCancel);
      showToast("Tu turno ha sido cancelado.", "success");
      showToast(
        `Te avisamos: se canceló tu turno del ${formatDate(pendingCancel.dateStr)} a las ${pendingCancel.time}. Si no fuiste vos, contactanos.`,
        "security",
      );
    }
    setPendingCancel(null);
  }

  return (
    <div>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {!appointment ? (
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
      ) : (
        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">Mi turno</h2>
            <Link href="/turno" className="text-sm font-medium text-brand-violet hover:underline">
              Ver mis turnos
            </Link>
          </div>
          <div className="mt-3">
            <AppointmentSummary appointment={appointment} onCancel={() => setPendingCancel(appointment)} />
          </div>
        </div>
      )}

      {pendingCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-brand-bone p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-zinc-900">¿Cancelar tu turno?</h3>
            <p className="mt-2 text-sm text-zinc-600">
              ¿Estás seguro que querés cancelar tu turno del{" "}
              <span className="font-medium text-zinc-900">{formatDate(pendingCancel.dateStr)}</span> a las{" "}
              <span className="font-medium text-zinc-900">{pendingCancel.time}</span>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="rounded-full bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Sí, cancelar turno
              </button>
              <button
                type="button"
                onClick={() => setPendingCancel(null)}
                className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Volver atrás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
