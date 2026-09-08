"use client";

import { useState } from "react";
import { ToastStack, useToasts } from "@/components/ui/Toast";
import { DONOR_BLOOD_TYPE, DONOR_DNI } from "@/lib/donor-profile/data";
import { savePersonalData } from "@/lib/donor-profile/personalData";
import { usePersonalData } from "@/lib/donor-profile/usePersonalData";
import type { DonorEditablePersonalData } from "@/lib/donor-profile/types";

const FIELDS: { key: keyof DonorEditablePersonalData; label: string }[] = [
  { key: "phone", label: "Teléfono" },
  { key: "email", label: "Email" },
  { key: "address", label: "Dirección" },
  { key: "emergencyContactName", label: "Contacto de emergencia (nombre)" },
  { key: "emergencyContactPhone", label: "Contacto de emergencia (teléfono)" },
];

export function PersonalDataSection() {
  const data = usePersonalData();
  const { toasts, showToast } = useToasts();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<DonorEditablePersonalData>(data);

  function startEditing() {
    setForm(data);
    setIsEditing(true);
  }

  function handleSave() {
    savePersonalData(form);
    setIsEditing(false);
    showToast("Tus datos se guardaron correctamente.", "success");
  }

  return (
    <div>
      <ToastStack toasts={toasts} />

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Mis datos</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="text-sm font-medium text-brand-violet hover:underline"
          >
            Editar
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-500">DNI</p>
          <p className="mt-1 text-sm font-medium text-zinc-900">{DONOR_DNI}</p>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-500">Grupo y factor sanguíneo</p>
          <p className="mt-1 text-sm font-medium text-zinc-900">{DONOR_BLOOD_TYPE}</p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Este dato es verificado por el centro de salud y no puede modificarse acá.
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs font-medium text-zinc-500">{label}</label>
            {isEditing ? (
              <input
                type={key === "email" ? "email" : "text"}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-brand-violet"
              />
            ) : (
              <p className="mt-1 rounded-2xl bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-900">
                {data[key]}
              </p>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-brand-violet px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
}
