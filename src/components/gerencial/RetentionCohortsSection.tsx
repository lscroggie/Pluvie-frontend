import type { RetentionCohort } from "@/lib/gerencial/types";

export function RetentionCohortsSection({
  visible,
  cohorts,
}: {
  visible: boolean;
  cohorts: RetentionCohort[];
}) {
  if (!visible || cohorts.length === 0) return null;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          Retención de donantes nuevos
        </h2>
        <span className="text-xs text-zinc-400">% que volvió a donar dentro de 3 meses</span>
      </div>

      <ul className="mt-5 space-y-3">
        {cohorts.map((cohort) => (
          <li key={cohort.monthKey}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-700">{cohort.monthLabel}</span>
              <span className="font-semibold text-zinc-700">
                {cohort.returnedWithin3Months} de {cohort.firstTimeDonors} · {cohort.returnRatePct}%
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-zinc-100">
              <div className="h-2 rounded-full bg-brand-violet" style={{ width: `${cohort.returnRatePct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
