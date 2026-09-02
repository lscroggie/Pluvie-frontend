import type { DonorLevelBreakdownItem, DonorSegmentation, NewDonorDetail, SocialImpact } from "@/lib/gerencial/types";
import { DONOR_LEVEL_COLOR } from "./donorLevelColors";
import { DropIcon, HeartIcon } from "./icons";
import { KpiCard } from "./KpiCard";
import { MiniBreakdownList } from "./MiniBreakdownList";

function newDonorDetailContent(detail: NewDonorDetail) {
  return (
    <div className="space-y-2.5">
      <MiniBreakdownList
        title="Estado"
        items={[
          { label: "Ya donó (primera donación)", count: detail.activatedCount, dotClassName: "bg-brand-green" },
          { label: "Registrado, todavía no donó", count: detail.pendingCount, dotClassName: "bg-zinc-400" },
        ]}
      />
      <MiniBreakdownList
        title="Por tipo de sangre"
        items={detail.byBloodType.map((item) => ({ label: item.bloodType, count: item.count }))}
      />
    </div>
  );
}

function recurringDonorLevelContent(items: DonorLevelBreakdownItem[]) {
  return (
    <MiniBreakdownList
      title="Por nivel Donate"
      items={items.map((item) => ({ label: item.label, count: item.count, dotClassName: DONOR_LEVEL_COLOR[item.id].dot }))}
    />
  );
}

export function SegmentationAndImpactSection({
  donorSegmentation,
  newDonorDetail,
  recurringDonorLevelBreakdown,
  impact,
}: {
  donorSegmentation: DonorSegmentation;
  newDonorDetail: NewDonorDetail;
  recurringDonorLevelBreakdown: DonorLevelBreakdownItem[];
  impact: SocialImpact;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div>
        <h2 className="text-sm font-semibold text-brand-charcoal" style={{ fontFamily: "var(--font-poppins)" }}>
          Segmentación de donantes
        </h2>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <KpiCard
            label="Donantes nuevos"
            value={String(donorSegmentation.newDonors)}
            accent="violet"
            detail={newDonorDetailContent(newDonorDetail)}
          />
          <KpiCard
            label="Donantes recurrentes"
            value={String(donorSegmentation.recurringDonors)}
            accent="charcoal"
            detail={recurringDonorLevelContent(recurringDonorLevelBreakdown)}
          />
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
            icon={<HeartIcon className="h-3.5 w-3.5 text-brand-violet" />}
            accent="violet"
          />
        </div>
      </div>
    </div>
  );
}
