import type { DonorLevelBreakdownItem } from "@/lib/gerencial/types";
import { DonorLevelsChart } from "./DonorLevelsChart";

export function DonorLevelsSection({
  visible,
  items,
}: {
  visible: boolean;
  items: DonorLevelBreakdownItem[];
}) {
  if (!visible) return null;

  return <DonorLevelsChart items={items} />;
}
