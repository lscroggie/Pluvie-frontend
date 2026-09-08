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
import { donationTypes } from "@/lib/donor-booking/data";
import type { Center, DonationTypeId } from "@/lib/donor-booking/types";
import { donations } from "@/lib/donor-profile/data";
import { getBookingRestriction } from "@/lib/donor-profile/eligibility";
import { ToastStack, useToasts } from "@/components/ui/Toast";

const DATE_LABEL = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

function formatDate(iso: string): string {
  return DATE_LABEL.format(new Date(`${iso}T00:00:00`));
}

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
  const [blockedType, setBlockedType] = useState<{
    typeId: DonationTypeId;
    reason: "cross-type" | "same-type";
    lastDonationDate: string;
    eligibleDate: string;
  } | null>(null);
  const existingAppointment = useActiveAppointment();
  const { toasts, showToast, dismissToast } = useToasts();

  const stepIndex = state.center ? 2 : state.donationTypeId ? 1 : 0;

  function handleSelectDonationType(donationTypeId: DonationTypeId) {
    const restriction = getBookingRestriction(donations, donationTypeId, new Date());
    if (restriction) {
      setBlockedType({
        typeId: donationTypeId,
        reason: restriction.reason,
        lastDonationDate: restriction.lastDonationDate,
        eligibleDate: restriction.eligibleDate,
      });
      return;
    }
    setState((s) => ({ ...s, donationTypeId }));
  }

  if (blockedType) {
    const typeName = donationTypes.find((t) => t.id === blockedType.typeId)!.name;
    return (
      <div className="w-full">
        <BookingHeader onBack={() => setBlockedType(null)} />
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-zinc-900">Todavía no podés reservar {typeName.toLowerCase()}</h2>
            {blockedType.reason === "cross-type" ? (
              <p className="mt-2 text-sm text-zinc-500">
                Donaste sangre entera el {formatDate(blockedType.lastDonationDate)}. Para donar
                plaquetas o plasma, necesitás esperar hasta el{" "}
                <span className="font-medium text-zinc-700">{formatDate(blockedType.eligibleDate)}</span>.
              </p>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">
                Ya donaste {typeName.toLowerCase()} el {formatDate(blockedType.lastDonationDate)}. Para
                donar {typeName.toLowerCase()} de nuevo, necesitás esperar hasta el{" "}
                <span className="font-medium text-zinc-700">{formatDate(blockedType.eligibleDate)}</span>.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (confirmedAppointment) {
    return (
      <div className="w-full">
        <BookingHeader backHref="/" />
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
          <ToastStack toasts={toasts} onDismiss={dismissToast} />
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
        <BookingHeader backHref="/" />
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
      <BookingHeader backHref={stepIndex === 0 ? "/" : undefined} />

      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
        <div className="mb-8">
          <Stepper currentIndex={stepIndex} />
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          {stepIndex === 0 && <StepDonationType onSelect={handleSelectDonationType} />}

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
                showToast(
                  `Te avisamos: se reservó tu turno del ${formatDate(appointment.dateStr)} a las ${time}. Si no fuiste vos, contactanos.`,
                  "security",
                );
              }}
              onBack={() => setState((s) => ({ ...s, center: null }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
