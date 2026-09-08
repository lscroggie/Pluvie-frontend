"use client";

import { useState } from "react";
import type { Donation } from "@/lib/donor-profile/types";
import { DonationTimeline } from "./DonationTimeline";

const MONTH_LABELS = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat("es-AR", { month: "short" }).format(new Date(2026, month, 1)).replace(".", ""),
);

function intensityClass(count: number): string {
  if (count === 0) return "bg-[#F8F9FA]";
  if (count === 1) return "bg-brand-violet/25";
  if (count === 2) return "bg-brand-violet/55";
  return "bg-brand-violet";
}

function textClass(count: number): string {
  return count >= 2 ? "text-white" : "text-zinc-500";
}

export function DonationCalendarView({ donations }: { donations: Donation[] }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Set(donations.map((d) => new Date(d.date).getFullYear()))).sort((a, b) => a - b);

  const [year, setYear] = useState(years.includes(currentYear) ? currentYear : (years.at(-1) ?? currentYear));
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const yearIndex = years.indexOf(year);
  const canGoBack = yearIndex > 0;
  const canGoForward = yearIndex !== -1 && yearIndex < years.length - 1;

  const countsByMonth = Array(12).fill(0) as number[];
  for (const donation of donations) {
    const date = new Date(donation.date);
    if (date.getFullYear() === year) countsByMonth[date.getMonth()] += 1;
  }

  const monthDonations =
    selectedMonth === null
      ? []
      : donations.filter((d) => {
          const date = new Date(d.date);
          return date.getFullYear() === year && date.getMonth() === selectedMonth;
        });

  function changeYear(nextYear: number) {
    setYear(nextYear);
    setSelectedMonth(null);
  }

  return (
    <div>
      {years.length > 1 && (
        <div className="mb-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => canGoBack && changeYear(years[yearIndex - 1])}
            disabled={!canGoBack}
            className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
            aria-label="Año anterior"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-zinc-900">{year}</span>
          <button
            type="button"
            onClick={() => canGoForward && changeYear(years[yearIndex + 1])}
            disabled={!canGoForward}
            className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
            aria-label="Año siguiente"
          >
            →
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {MONTH_LABELS.map((label, month) => {
          const count = countsByMonth[month];
          const isSelected = selectedMonth === month;

          return (
            <button
              key={label}
              type="button"
              disabled={count === 0}
              onClick={() => setSelectedMonth(isSelected ? null : month)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-transform ${count > 0 ? "cursor-pointer hover:scale-[1.03]" : "cursor-default"}`}
            >
              <span
                className={`flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold ${intensityClass(count)} ${textClass(count)} ${isSelected ? "ring-2 ring-brand-violet ring-offset-2" : ""}`}
              >
                {count > 0 ? count : ""}
              </span>
              <span className="text-xs text-zinc-500">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
        <span>Menos</span>
        <span className={`h-3 w-3 rounded-full ${intensityClass(0)}`} />
        <span className={`h-3 w-3 rounded-full ${intensityClass(1)}`} />
        <span className={`h-3 w-3 rounded-full ${intensityClass(2)}`} />
        <span className={`h-3 w-3 rounded-full ${intensityClass(3)}`} />
        <span>Más</span>
      </div>

      {selectedMonth !== null && monthDonations.length > 0 && (
        <div className="mt-6 border-t border-zinc-200 pt-4">
          <DonationTimeline donations={monthDonations} showHeading={false} showType />
        </div>
      )}
    </div>
  );
}
