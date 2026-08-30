"use client";

import { useEffect, useRef, useState } from "react";
import { exportToExcel, exportToPdf } from "@/lib/gerencial/export";
import type { DashboardViewModel } from "@/lib/gerencial/types";
import { DownloadIcon } from "./icons";

export function ExportMenu({
  viewModel,
  institutionName,
}: {
  viewModel: DashboardViewModel;
  institutionName: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-brand-charcoal hover:bg-zinc-50"
      >
        <DownloadIcon className="h-4 w-4" />
        Exportar reporte
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              exportToExcel(viewModel, institutionName);
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-brand-charcoal hover:bg-zinc-50"
          >
            Excel (.xlsx)
          </button>
          <button
            type="button"
            onClick={() => {
              exportToPdf(viewModel, institutionName);
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-sm text-brand-charcoal hover:bg-zinc-50"
          >
            PDF
          </button>
        </div>
      )}
    </div>
  );
}
