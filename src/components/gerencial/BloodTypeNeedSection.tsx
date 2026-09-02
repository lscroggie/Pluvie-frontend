"use client";

import { useEffect, useState } from "react";
import { BLOOD_TYPES, bloodTypeDonorCounts } from "@/lib/gerencial/bloodTypes";
import type { BloodType } from "@/lib/gerencial/types";

const TOAST_DURATION_MS = 4000;

export function BloodTypeNeedSection() {
  const [selectedType, setSelectedType] = useState<BloodType | "">("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const donorCount = selectedType ? bloodTypeDonorCounts[selectedType] : null;

  function handleNotify() {
    if (!selectedType || donorCount === null) return;
    // Placeholder: no dispara ningún envío real (ni SMS ni WhatsApp, para no
    // spamear al donante). Queda preparado para conectar a futuro con un
    // sistema de notificaciones in-app.
    setToastMessage(`Se notificó a ${donorCount} donantes ${selectedType}`);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Necesidad de tipo de sangre específico
      </h2>
      <p className="mt-1 text-xs text-zinc-400">
        Lo carga gerencial a mano — Pluvie no lo detecta ni lo predice.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value as BloodType | "")}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-charcoal"
        >
          <option value="">Seleccioná un tipo</option>
          {BLOOD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleNotify}
          disabled={!selectedType}
          className="rounded-lg bg-brand-violet px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Notificar donantes
        </button>
      </div>

      {selectedType && donorCount !== null && (
        <p className="mt-2.5 text-xs text-zinc-700">
          Tenés <span className="font-semibold">{donorCount}</span> donantes {selectedType} registrados.
        </p>
      )}

      {toastMessage && (
        <div className="mt-3 flex items-start justify-between gap-2.5 rounded-xl border border-brand-green/40 bg-brand-green/10 px-3 py-2.5">
          <p className="text-xs text-brand-charcoal">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Cerrar"
            className="text-zinc-400 hover:text-zinc-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
