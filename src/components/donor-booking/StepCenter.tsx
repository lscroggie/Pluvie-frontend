"use client";

import { useMemo, useState } from "react";
import { centers, localities } from "@/lib/donor-booking/data";
import { findCentersForLocality } from "@/lib/donor-booking/availability";
import type { Center, CenterResult, Locality } from "@/lib/donor-booking/types";

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function StepCenter({
  onSelect,
  onBack,
}: {
  onSelect: (locality: Locality, center: Center) => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null);

  const suggestions = useMemo(() => {
    if (selectedLocality || query.trim().length === 0) return [];
    const q = normalize(query);
    return localities.filter((l) => normalize(l.name).includes(q)).slice(0, 6);
  }, [query, selectedLocality]);

  const lookup = useMemo(() => {
    if (!selectedLocality) return null;
    return findCentersForLocality(selectedLocality, centers);
  }, [selectedLocality]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900">¿Dónde querés donar?</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Buscá tu localidad y te mostramos los centros disponibles.
      </p>

      <div className="relative mt-6">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedLocality(null);
          }}
          placeholder="Buscar localidad (ej. Chascomús, Rosario...)"
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
            {suggestions.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLocality(l);
                    setQuery(l.name);
                  }}
                  className="flex w-full flex-col px-4 py-2.5 text-left text-sm hover:bg-zinc-50"
                >
                  <span className="font-medium text-zinc-900">{l.name}</span>
                  <span className="text-xs text-zinc-500">{l.province}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {lookup && (
        <div className="mt-6">
          {lookup.hasHomeCenter ? (
            <p className="text-sm font-medium text-zinc-700">
              Centros en {selectedLocality?.name}
            </p>
          ) : (
            <p className="text-sm font-medium text-zinc-700">
              No tenemos un centro propio en{" "}
              <span className="text-zinc-900">{selectedLocality?.name}</span>, pero estos son
              los más cercanos:
            </p>
          )}

          <div className="mt-3 flex flex-col gap-3">
            {lookup.results.map((result) => (
              <CenterCard
                key={result.center.id}
                result={result}
                localityName={selectedLocality!.name}
                onSelect={() => onSelect(selectedLocality!, result.center)}
              />
            ))}
          </div>
        </div>
      )}

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
  localityName,
  onSelect,
}: {
  result: CenterResult;
  localityName: string;
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
        {!isHome && (
          <p className="mt-1 text-xs font-medium text-brand-violet">
            a {Math.max(1, Math.round(distanceKm))} km de {localityName}
          </p>
        )}
      </div>
      <span className="mt-2 inline-flex shrink-0 items-center rounded-full bg-brand-violet px-3 py-1.5 text-xs font-semibold text-white sm:mt-0">
        Elegir este centro
      </span>
    </button>
  );
}
