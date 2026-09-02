import type { DashboardViewModel, PeriodOption } from "@/lib/gerencial/types";
import { ExportMenu } from "./ExportMenu";
import { PeriodSelector } from "./PeriodSelector";

export function DashboardHeader({
  periodLabel,
  periodOptions,
  periodValue,
  onPeriodChange,
  viewModel,
  institutionName,
}: {
  periodLabel: string;
  periodOptions: PeriodOption[];
  periodValue: string;
  onPeriodChange: (value: string) => void;
  viewModel: DashboardViewModel;
  institutionName: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1
          className="text-xl font-semibold text-brand-charcoal"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-zinc-500">Vista general · {periodLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <PeriodSelector options={periodOptions} value={periodValue} onChange={onPeriodChange} />
        <ExportMenu viewModel={viewModel} institutionName={institutionName} />
      </div>
    </div>
  );
}
