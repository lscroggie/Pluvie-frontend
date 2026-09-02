import type { DonorSegmentation, SocialImpact } from "@/lib/gerencial/types";
import { DropIcon, HeartIcon } from "./icons";
import { KpiCard } from "./KpiCard";

export function SegmentationAndImpactSection({
  donorSegmentation,
  impact,
}: {
  donorSegmentation: DonorSegmentation;
  impact: SocialImpact;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          Segmentación de donantes
        </h2>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <KpiCard label="Donantes nuevos" value={String(donorSegmentation.newDonors)} accent="violet" />
          <KpiCard label="Donantes recurrentes" value={String(donorSegmentation.recurringDonors)} accent="charcoal" />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          Impacto social
        </h2>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <KpiCard
            label="Litros de sangre donados"
            value={`${impact.litersOfBlood.toLocaleString("es-AR")} L`}
            accent="coral"
            icon={<DropIcon className="h-3.5 w-3.5 text-brand-coral" />}
          />
          <KpiCard
            label="Vidas ayudadas"
            value={impact.livesHelped.toLocaleString("es-AR")}
            sublabel="Multiplicador 3x"
            icon={<HeartIcon className="h-3.5 w-3.5 text-white/80" />}
            highlighted
          />
        </div>
      </div>
    </div>
  );
}
