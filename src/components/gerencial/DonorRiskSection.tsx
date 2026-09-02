import { KpiCard } from "./KpiCard";

export function DonorRiskSection({
  visible,
  thresholdMonths,
  oroTotal,
  diamanteTotal,
  oroInactive,
  diamanteInactive,
}: {
  visible: boolean;
  thresholdMonths: number;
  oroTotal: number;
  diamanteTotal: number;
  oroInactive: number;
  diamanteInactive: number;
}) {
  if (!visible) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
        Donantes de nivel alto en riesgo de inactividad
      </h2>
      <p className="mt-1 text-xs text-zinc-400">
        Sin donar hace más de {thresholdMonths} meses. No modifica su nivel Donate, que es permanente.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <KpiCard
          label="Oro en riesgo"
          value={String(oroInactive)}
          sublabel={`${oroInactive} de ${oroTotal} donantes Oro`}
          accent="coral"
        />
        <KpiCard
          label="Diamante en riesgo"
          value={String(diamanteInactive)}
          sublabel={`${diamanteInactive} de ${diamanteTotal} donantes Diamante`}
          accent="coral"
        />
      </div>
    </div>
  );
}
