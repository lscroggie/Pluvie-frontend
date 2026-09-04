"use client";

import { useMemo } from "react";
import { centers, INSTITUTION_CENTER_IDS, localities } from "@/lib/donor-booking/data";
import { getInstitutionCenters } from "@/lib/donor-booking/availability";
import { DONOR_LOCALITY_ID } from "@/lib/donor-profile/data";
import type { CenterResult } from "@/lib/donor-booking/types";

export function StepCenter({
  onSelect,
  onBack,
}: {
  onSelect: (center: CenterResult["center"]) => void;
  onBack: () => void;
}) {
  const results = useMemo(() => {
    const donorLocality = localities.find((l) => l.id === DONOR_LOCALITY_ID);
    return getInstitutionCenters(centers, INSTITUTION_CENTER_IDS, donorLocality);
  }, []);

  const isSingleCenter = results.length === 1;

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">
        {isSingleCenter ? "Tu centro de donación" : "¿Dónde querés donar?"}
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        {isSingleCenter
          ? "Este es el centro habilitado para tu institución."
          : "Elegí el centro de tu institución más conveniente."}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {results.map((result) => (
          <CenterCard
            key={result.center.id}
            result={result}
            showDistance={!isSingleCenter}
            onSelect={() => onSelect(result.center)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-8 text-sm font-medium text-zinc-500 hover:text-zinc-800"
      >
        ← Volver
      </button>
    </div>
  );
}

function CenterCard({
  result,
  showDistance,
  onSelect,
}: {
  result: CenterResult;
  showDistance: boolean;
  onSelect: () => void;
}) {
  const { center, distanceKm, isHome } = result;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col items-start gap-1 rounded-2xl border border-zinc-200 p-4 text-left transition-colors hover:border-brand-violet hover:bg-brand-violet/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-semibold text-zinc-900">{center.name}</p>
        <p className="text-sm text-zinc-500">{center.address}</p>
        {showDistance && !isHome && (
          <p className="mt-1 text-xs font-medium text-brand-violet">
            a {Math.max(1, Math.round(distanceKm))} km de tu localidad
          </p>
        )}
      </div>
      <span className="mt-2 inline-flex shrink-0 items-center rounded-full bg-brand-violet px-3 py-1.5 text-xs font-semibold text-white sm:mt-0">
        Elegir este centro
      </span>
    </button>
  );
}
