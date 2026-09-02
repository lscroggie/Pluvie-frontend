import type { DonorSegmentation, SocialImpact } from "@/lib/gerencial/types";
import { KpiCard } from "./KpiCard";

export function SegmentationAndImpactSection({
  donorSegmentation,
  impact,
}: {
  donorSegmentation: DonorSegmentation;
  impact: SocialImpact;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          Segmentación de donantes
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <KpiCard label="Donantes nuevos" value={String(donorSegmentation.newDonors)} accent="violet" />
          <KpiCard label="Donantes recurrentes" value={String(donorSegmentation.recurringDonors)} accent="charcoal" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          Impacto social
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <KpiCard label="Litros de sangre donados" value={`${impact.litersOfBlood.toLocaleString("es-AR")} L`} accent="green" />
          <KpiCard
            label="Vidas ayudadas"
            value={impact.livesHelped.toLocaleString("es-AR")}
            sublabel="Multiplicador 3x"
            highlighted
          />
        </div>
      </div>
    </div>
  );
}
