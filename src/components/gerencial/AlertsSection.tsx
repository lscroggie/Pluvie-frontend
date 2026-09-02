"use client";

import { useState } from "react";
import type { Alert } from "@/lib/gerencial/types";
import { DonationsBarChart } from "./DonationsBarChart";

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M8 1.5 14.5 13h-13L8 1.5Z" strokeLinejoin="round" />
      <path d="M8 6v3.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M4.5 6 8 9.5 11.5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AlertsSection({ alerts }: { alerts: Alert[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (alerts.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Alertas
      </h2>
      <div className="mt-4 space-y-2">
        {alerts.map((alert) => {
          const isExpanded = expandedId === alert.id;
          return (
            <div key={alert.id} className="rounded-2xl border border-brand-coral/50 bg-brand-coral/10">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                aria-expanded={isExpanded}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral" />
                <p className="flex-1 text-sm text-brand-charcoal">{alert.message}</p>
                <ChevronIcon
                  className={`mt-0.5 h-4 w-4 shrink-0 text-brand-coral transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <DonationsBarChart title={alert.detailTitle} points={alert.breakdown} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
