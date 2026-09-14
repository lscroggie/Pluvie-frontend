import { DropIcon } from "./DropIcon";

/** Chip informativo discreto, no un botón/CTA — baja intensidad visual a propósito. */
export function BloodTypeBadge({ bloodType, className }: { bloodType: string; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-[20px] bg-[#EEEDFE] px-3 py-[5px] text-[13px] font-medium text-[#3C3489] ${className ?? ""}`}
    >
      <DropIcon className="h-3.5 w-3.5 shrink-0 text-[#7F77DD]" />
      {bloodType}
    </span>
  );
}
