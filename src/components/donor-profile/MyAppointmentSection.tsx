"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppointmentSummary } from "@/components/donor-booking/AppointmentSummary";
import { cancelActiveAppointment, type Appointment } from "@/lib/donor-booking/appointments";
import { useActiveAppointment } from "@/lib/donor-booking/useActiveAppointment";

const DATE_LABEL = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

function formatDate(dateStr: string): string {
  return DATE_LABEL.format(new Date(`${dateStr}T00:00:00`));
}

const TOAST_DURATION_MS = 4000;

export function MyAppointmentSection() {
  const appointment = useActiveAppointment();
  const [pendingCancel, setPendingCancel] = useState<Appointment | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;
    const timeout = window.setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [showToast]);

  function handleConfirmCancel() {
    if (pendingCancel) cancelActiveAppointment(pendingCancel);
    setPendingCancel(null);
    setShowToast(true);
  }

  return (
    <div>
      {showToast && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green">
          <span aria-hidden>✓</span>
          Tu turno ha sido cancelado.
        </div>
      )}

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
          <div className="w-full max-w-sm rounded-3xl bg-[#fffcf7] p-6 shadow-lg">
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
