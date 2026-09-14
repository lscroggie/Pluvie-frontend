import { DONOR_LEVEL_LABELS, type DonorLevelId } from "@/lib/donor-levels";
import { DONOR_LEVEL_COLOR } from "@/components/gerencial/donorLevelColors";

export function DonorLevelBadge({ level, className }: { level: DonorLevelId; className?: string }) {
  const color = DONOR_LEVEL_COLOR[level];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white ${className ?? ""}`}
      style={{ backgroundColor: color }}
    >
      <span
        className="text-base font-semibold leading-none"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {DONOR_LEVEL_LABELS[level]}
      </span>
    </span>
  );
}
