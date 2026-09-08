"use client";

import { useState } from "react";
import type { Donation } from "@/lib/donor-profile/types";
import { DonationCalendarView } from "./DonationCalendarView";
import { DonationHistoryByYear } from "./DonationHistoryByYear";

type ViewMode = "calendario" | "lista";

export function DonationHistorySection({ donations }: { donations: Donation[] }) {
  const [view, setView] = useState<ViewMode>("calendario");

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Historial de donaciones</h2>
        <div className="flex rounded-full border border-zinc-200 p-0.5 text-xs font-medium">
          <ViewToggleButton label="Calendario" active={view === "calendario"} onClick={() => setView("calendario")} />
          <ViewToggleButton label="Lista" active={view === "lista"} onClick={() => setView("lista")} />
        </div>
      </div>

      <div className="mt-4">
        {view === "calendario" ? (
          <DonationCalendarView donations={donations} />
        ) : (
          <DonationHistoryByYear donations={donations} />
        )}
      </div>
    </div>
  );
}

function ViewToggleButton({
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
      className={`rounded-full px-3 py-1 transition-colors ${
        active ? "bg-brand-violet text-white" : "text-zinc-500 hover:text-zinc-800"
      }`}
    >
      {label}
    </button>
  );
}
