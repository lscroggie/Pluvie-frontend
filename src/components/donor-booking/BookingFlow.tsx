"use client";

import { useState } from "react";
import { BookingHeader } from "./BookingHeader";
import { Stepper } from "./Stepper";
import { StepDonationType } from "./StepDonationType";
import { StepCenter } from "./StepCenter";
import { StepSchedule } from "./StepSchedule";
import { StepConfirmation } from "./StepConfirmation";
import type { Center, DonationTypeId, Locality } from "@/lib/donor-booking/types";

type BookingState = {
  donationTypeId: DonationTypeId | null;
  locality: Locality | null;
  center: Center | null;
  date: Date | null;
  time: string | null;
};

const INITIAL_STATE: BookingState = {
  donationTypeId: null,
  locality: null,
  center: null,
  date: null,
  time: null,
};

export function BookingFlow() {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);

  const stepIndex = state.time
    ? 3
    : state.center
      ? 2
      : state.donationTypeId
        ? 1
        : 0;

  return (
    <div className="w-full">
      <BookingHeader />

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
              onSelect={(locality, center) => setState((s) => ({ ...s, locality, center }))}
              onBack={() => setState((s) => ({ ...s, donationTypeId: null }))}
            />
          )}

          {stepIndex === 2 && state.center && (
            <StepSchedule
              center={state.center}
              onSelect={(date, time) => setState((s) => ({ ...s, date, time }))}
              onBack={() => setState((s) => ({ ...s, center: null, locality: null }))}
            />
          )}

          {stepIndex === 3 &&
            state.donationTypeId &&
            state.locality &&
            state.center &&
            state.date &&
            state.time && (
              <StepConfirmation
                donationTypeId={state.donationTypeId}
                locality={state.locality}
                center={state.center}
                date={state.date}
                time={state.time}
                onRestart={() => setState(INITIAL_STATE)}
              />
            )}
        </div>
      </div>
    </div>
  );
}
