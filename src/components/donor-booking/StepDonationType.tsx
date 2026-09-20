"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { donationTypes } from "@/lib/donor-booking/data";
import type { DonationTypeId } from "@/lib/donor-booking/types";
import { DonationDropIcon } from "./DonationDropIcon";
import { DonationHoursLegend } from "./DonationHoursLegend";

// Colores propios de este paso: no salen de los tokens compartidos de marca.
const DROP_COLOR: Record<DonationTypeId, string> = {
  "sangre-entera": "#C1272D",
  plaquetas: "#E8A838",
  plasma: "#7F77DD",
};

export function StepDonationType({
  onSelect,
}: {
  onSelect: (typeId: DonationTypeId) => void;
}) {
  const [selectedId, setSelectedId] = useState<DonationTypeId | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-xl font-semibold text-zinc-900">¿Qué querés donar?</h2>
        <Link
          href="/requisitos"
          className="whitespace-nowrap text-sm font-medium text-brand-violet hover:text-brand-violet-dark hover:underline"
        >
          Ver requisitos de donación
        </Link>
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        Elegí el tipo de donación para ver los centros y turnos disponibles.
      </p>

      <div className="mt-4">
        <DonationHoursLegend />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {donationTypes.map((type) => {
          const isSelected = selectedId === type.id;
          return (
            <button
              key={type.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedId(type.id);
                onSelect(type.id);
              }}
              style={
                {
                  "--drop-color": DROP_COLOR[type.id],
                  ...(isSelected ? { borderColor: DROP_COLOR[type.id] } : {}),
                } as CSSProperties
              }
              className="group flex flex-col items-start gap-2 rounded-2xl border border-zinc-200 p-5 text-left transition-colors motion-reduce:transition-none hover:border-[var(--drop-color)] hover:bg-brand-violet/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center">
                <DonationDropIcon color={DROP_COLOR[type.id]} filled={isSelected} />
              </span>
              <span className="font-semibold text-zinc-900">{type.name}</span>
              <span className="text-sm text-zinc-500">{type.description}</span>
              <span className="text-xs font-medium text-brand-violet">{type.durationLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
