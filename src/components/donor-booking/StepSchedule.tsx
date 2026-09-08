"use client";

import { useMemo, useState } from "react";
import { getActiveAppointment } from "@/lib/donor-booking/appointments";
import { getDaySlots, getUpcomingDays } from "@/lib/donor-booking/availability";
import { donationTypes } from "@/lib/donor-booking/data";
import type { Center, DaySlots, DonationTypeId } from "@/lib/donor-booking/types";
import { donations } from "@/lib/donor-profile/data";
import {
  CROSS_TYPE_WAIT_DAYS_WHOLE_BLOOD_TO_APHERESIS,
  getBookingRestriction,
} from "@/lib/donor-profile/eligibility";
import { BackButton } from "./BackButton";

const DAY_LABEL = new Intl.DateTimeFormat("es-AR", { weekday: "short" });
const MONTH_LABEL = new Intl.DateTimeFormat("es-AR", { month: "short" });
const FULL_DATE_LABEL = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

function formatFullDate(dateStr: string): string {
  return FULL_DATE_LABEL.format(new Date(`${dateStr}T00:00:00`));
}

function statusLabel(day: DaySlots): string {
  if (day.status === "closed") return "Cerrado";
  if (day.status === "full") return "Completo";
  if (day.status === "ineligible") return "No disponible";
  return `${day.freeCount} libres`;
}

export function StepSchedule({
  center,
  donationTypeId,
  onSelect,
  onBack,
}: {
  center: Center;
  donationTypeId: DonationTypeId;
  onSelect: (date: Date, time: string) => void;
  onBack: () => void;
}) {
  const restriction = useMemo(
    () => getBookingRestriction(donations, donationTypeId, new Date()),
    [donationTypeId],
  );
  const minEligibleDateStr = restriction?.eligibleDate ?? null;

  const days = useMemo(() => {
    const activeAppointment = getActiveAppointment();
    return getUpcomingDays(14).map((date) => {
      const day = getDaySlots(center, date, donationTypeId, activeAppointment);
      if (minEligibleDateStr && day.dateStr < minEligibleDateStr) {
        return { ...day, status: "ineligible" as const };
      }
      return day;
    });
  }, [center, donationTypeId, minEligibleDateStr]);

  const firstOpenIndex = days.findIndex(
    (d) => d.status !== "closed" && d.status !== "full" && d.status !== "ineligible",
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(Math.max(0, firstOpenIndex));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDay = days[selectedDayIndex];
  const allDaysIneligible = minEligibleDateStr !== null && days.every((d) => d.status === "ineligible");

  const typeName = donationTypes.find((t) => t.id === donationTypeId)!.name;
  const ineligibilityReason =
    restriction?.reason === "cross-type"
      ? `No disponible: donaste sangre entera hace menos de ${CROSS_TYPE_WAIT_DAYS_WHOLE_BLOOD_TO_APHERESIS} días.`
      : `No disponible: todavía no cumplís el plazo mínimo desde tu última donación de ${typeName.toLowerCase()}.`;

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">Elegí día y horario</h2>
      <p className="mt-1 text-sm text-zinc-500">{center.name}</p>

      {allDaysIneligible && restriction && (
        <div className="mt-4 flex gap-3 rounded-2xl bg-brand-amber/10 p-4">
          <span className="mt-0.5 shrink-0 text-brand-amber">●</span>
          <p className="text-sm text-zinc-700">
            Vas a poder reservar {typeName.toLowerCase()} a partir del{" "}
            <span className="font-semibold">{formatFullDate(restriction.eligibleDate)}</span>. Todavía
            no te mostramos horarios porque caen antes de esa fecha.
          </p>
        </div>
      )}

      <div className="mt-6 -mx-1 flex snap-x gap-2 overflow-x-auto pb-2 px-1">
        {days.map((day, i) => {
          const disabled = day.status === "closed" || day.status === "full" || day.status === "ineligible";
          const isSelected = i === selectedDayIndex;
          return (
            <button
              key={day.dateStr}
              type="button"
              disabled={disabled}
              title={day.status === "ineligible" ? ineligibilityReason : undefined}
              onClick={() => {
                setSelectedDayIndex(i);
                setSelectedTime(null);
              }}
              className={[
                "flex w-[76px] shrink-0 snap-start flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition-colors",
                isSelected
                  ? "border-brand-violet bg-brand-violet text-white"
                  : disabled
                    ? "border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed"
                    : "border-zinc-200 text-zinc-700 hover:border-brand-violet hover:bg-brand-violet/5",
              ].join(" ")}
            >
              <span className="text-[11px] font-medium uppercase opacity-70">
                {DAY_LABEL.format(day.date)}
              </span>
              <span className="text-lg font-semibold leading-none">{day.date.getDate()}</span>
              <span className="text-[11px] uppercase opacity-70">
                {MONTH_LABEL.format(day.date)}
              </span>
              <span
                className={[
                  "mt-1 flex items-center gap-1 text-[10px] font-medium leading-none",
                  isSelected
                    ? "text-white/90"
                    : day.status === "low"
                      ? "text-brand-amber"
                      : day.status === "full"
                        ? "text-zinc-300"
                        : "text-zinc-400",
                ].join(" ")}
              >
                {day.status === "low" && (
                  <span
                    aria-hidden
                    className={isSelected ? "h-1.5 w-1.5 rounded-full bg-white/90" : "h-1.5 w-1.5 rounded-full bg-brand-amber"}
                  />
                )}
                {statusLabel(day)}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDay.status === "low" && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-amber">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-amber" />
          Quedan pocos turnos este día — te conviene reservar pronto.
        </p>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-700">Horarios disponibles</p>
        {selectedDay.status === "ineligible" ? (
          <p className="mt-3 text-sm text-zinc-400">{ineligibilityReason}</p>
        ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {selectedDay.times.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className={[
                "flex flex-col items-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                !slot.available
                  ? "border-zinc-100 bg-zinc-50 text-zinc-300 line-through cursor-not-allowed"
                  : selectedTime === slot.time
                    ? "border-brand-violet bg-brand-violet text-white"
                    : "border-zinc-200 text-zinc-700 hover:border-brand-violet hover:bg-brand-violet/5",
              ].join(" ")}
            >
              {slot.time}
              {slot.capacity > 1 && (
                <span
                  className={[
                    "text-[10px] font-normal normal-case no-underline",
                    selectedTime === slot.time && slot.available ? "text-white/80" : "text-zinc-400",
                  ].join(" ")}
                >
                  {slot.available ? `${slot.freeSpots} lugares` : "sin lugares"}
                </span>
              )}
            </button>
          ))}
        </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button
          type="button"
          disabled={!selectedTime || selectedDay.status === "ineligible"}
          onClick={() => selectedTime && onSelect(selectedDay.date, selectedTime)}
          className="rounded-full bg-brand-violet px-6 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirmar turno
        </button>
      </div>
    </div>
  );
}
