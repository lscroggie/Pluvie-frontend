"use client";

import { useState } from "react";
import { donationTypes } from "@/lib/donor-booking/data";
import type { DonationTypeId } from "@/lib/donor-booking/types";
import type { Donation } from "@/lib/donor-profile/types";
import { DonationTimeline } from "./DonationTimeline";

type FilterValue = "todas" | DonationTypeId;

export function DonationHistoryByYear({ donations }: { donations: Donation[] }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Set(donations.map((d) => new Date(d.date).getFullYear())),
  )
    .filter((year) => year === currentYear)
    .sort((a, b) => b - a);

  const [expandedYear, setExpandedYear] = useState<number | null>(currentYear);
  const [filter, setFilter] = useState<FilterValue>("todas");

  return (
    <div>
      <h2 className="text-lg font-semibold text-zinc-900">Historial de donaciones</h2>

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip label="Todas" active={filter === "todas"} onClick={() => setFilter("todas")} />
        {donationTypes.map((type) => (
          <FilterChip
            key={type.id}
            label={type.name}
            active={filter === type.id}
            onClick={() => setFilter(type.id)}
          />
        ))}
      </div>

      <div className="mt-4 divide-y divide-zinc-200">
        {years.map((year) => {
          const yearDonations = donations.filter(
            (d) => new Date(d.date).getFullYear() === year,
          );
          const filtered =
            filter === "todas"
              ? yearDonations
              : yearDonations.filter((d) => d.donationTypeId === filter);
          const isExpanded = expandedYear === year;

          return (
            <div key={year} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => setExpandedYear(isExpanded ? null : year)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-zinc-900">{year}</span>
                <span className="flex items-center gap-2 text-xs text-zinc-400">
                  {yearDonations.length} donaci{yearDonations.length === 1 ? "ón" : "ones"}
                  <span className="text-zinc-300">{isExpanded ? "−" : "+"}</span>
                </span>
              </button>

              {isExpanded && (
                <div className="mt-4">
                  {filtered.length > 0 ? (
                    <DonationTimeline
                      donations={filtered}
                      showHeading={false}
                      showType={filter === "todas"}
                    />
                  ) : (
                    <p className="text-xs text-zinc-400">
                      No hay donaciones de este tipo en {year}.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-brand-violet bg-brand-violet text-white"
          : "border-zinc-200 text-zinc-600 hover:border-brand-violet"
      }`}
    >
      {label}
    </button>
  );
}
