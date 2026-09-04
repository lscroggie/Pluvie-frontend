"use client";

import { useMemo, useState } from "react";
import { getActiveAppointment } from "@/lib/donor-booking/appointments";
import { getDaySlots, getUpcomingDays } from "@/lib/donor-booking/availability";
import type { Center, DaySlots, DonationTypeId } from "@/lib/donor-booking/types";
import { BackButton } from "./BackButton";

const DAY_LABEL = new Intl.DateTimeFormat("es-AR", { weekday: "short" });
const MONTH_LABEL = new Intl.DateTimeFormat("es-AR", { month: "short" });

function statusLabel(day: DaySlots): string {
  if (day.status === "closed") return "Cerrado";
  if (day.status === "full") return "Completo";
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
  const days = useMemo(() => {
    const activeAppointment = getActiveAppointment();
    return getUpcomingDays(14).map((date) =>
      getDaySlots(center, date, donationTypeId, activeAppointment),
    );
  }, [center, donationTypeId]);

  const firstOpenIndex = days.findIndex((d) => d.status !== "closed" && d.status !== "full");
  const [selectedDayIndex, setSelectedDayIndex] = useState(Math.max(0, firstOpenIndex));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDay = days[selectedDayIndex];

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">Elegí día y horario</h2>
      <p className="mt-1 text-sm text-zinc-500">{center.name}</p>

      <div className="mt-6 -mx-1 flex snap-x gap-2 overflow-x-auto pb-2 px-1">
        {days.map((day, i) => {
          const disabled = day.status === "closed" || day.status === "full";
          const isSelected = i === selectedDayIndex;
          return (
            <button
              key={day.dateStr}
              type="button"
              disabled={disabled}
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
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {selectedDay.times.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                !slot.available
                  ? "border-zinc-100 bg-zinc-50 text-zinc-300 line-through cursor-not-allowed"
                  : selectedTime === slot.time
                    ? "border-brand-violet bg-brand-violet text-white"
                    : "border-zinc-200 text-zinc-700 hover:border-brand-violet hover:bg-brand-violet/5",
              ].join(" ")}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button
          type="button"
          disabled={!selectedTime}
          onClick={() => selectedTime && onSelect(selectedDay.date, selectedTime)}
          className="rounded-full bg-brand-violet px-6 py-2.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirmar turno
        </button>
      </div>
    </div>
  );
}
