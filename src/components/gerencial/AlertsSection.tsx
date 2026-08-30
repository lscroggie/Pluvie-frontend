import type { Alert } from "@/lib/gerencial/types";

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M8 1.5 14.5 13h-13L8 1.5Z" strokeLinejoin="round" />
      <path d="M8 6v3.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AlertsSection({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Alertas
      </h2>
      <div className="mt-4 space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-2xl border border-brand-coral/30 bg-brand-coral/5 px-4 py-3"
          >
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral" />
            <p className="text-sm text-brand-charcoal">{alert.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
