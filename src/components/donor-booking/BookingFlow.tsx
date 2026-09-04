"use client";

import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { Stepper } from "./Stepper";
import { StepDonationType } from "./StepDonationType";
import { StepCenter } from "./StepCenter";
import { StepSchedule } from "./StepSchedule";
import { StepConfirmation } from "./StepConfirmation";
import { AppointmentSummary } from "./AppointmentSummary";
import { cancelActiveAppointment, saveAppointment, type Appointment } from "@/lib/donor-booking/appointments";
import { useActiveAppointment } from "@/lib/donor-booking/useActiveAppointment";
import type { Center, DonationTypeId } from "@/lib/donor-booking/types";

type BookingState = {
  donationTypeId: DonationTypeId | null;
  center: Center | null;
};

const INITIAL_STATE: BookingState = {
  donationTypeId: null,
  center: null,
};

export function BookingFlow() {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const existingAppointment = useActiveAppointment();

  const stepIndex = state.center ? 2 : state.donationTypeId ? 1 : 0;

  if (confirmedAppointment) {
    return (
      <div className="w-full">
        <BookingHeader backHref="/perfil" />
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <StepConfirmation appointment={confirmedAppointment} />
          </div>
        </div>
      </div>
    );
  }

  // Un donante solo puede tener 1 turno activo a la vez: si ya tiene uno,
  // no lo dejamos avanzar en el wizard para no romper la equidad de cupos.
  if (existingAppointment) {
    return (
      <div className="w-full">
        <BookingHeader backHref="/perfil" />
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-zinc-900">Ya tenés un turno reservado</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Para preservar la equidad de cupos, solo podés tener un turno activo a la vez. Si
              necesitás cambiar el horario, cancelá este turno primero y reservá uno nuevo.
            </p>

            <div className="mt-6">
              <AppointmentSummary
                appointment={existingAppointment}
                onCancel={() => cancelActiveAppointment()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <BookingHeader backHref={stepIndex === 0 ? "/perfil" : undefined} />

      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
        <div className="mb-8">
          <Stepper currentIndex={stepIndex} />
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          {stepIndex === 0 && (
            <StepDonationType
              onSelect={(donationTypeId) => setState((s) => ({ ...s, donationTypeId }))}
            />
          )}

          {stepIndex === 1 && (
            <StepCenter
              onSelect={(center) => setState((s) => ({ ...s, center }))}
              onBack={() => setState((s) => ({ ...s, donationTypeId: null }))}
            />
          )}

          {stepIndex === 2 && state.center && state.donationTypeId && (
            <StepSchedule
              center={state.center}
              donationTypeId={state.donationTypeId}
              onSelect={(date, time) => {
                const appointment: Appointment = {
                  donationTypeId: state.donationTypeId!,
                  centerId: state.center!.id,
                  centerName: state.center!.name,
                  centerAddress: state.center!.address,
                  dateStr: date.toISOString().slice(0, 10),
                  time,
                };
                saveAppointment(appointment);
                setConfirmedAppointment(appointment);
              }}
              onBack={() => setState((s) => ({ ...s, center: null }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
