"use client";

import { useMemo, useState } from "react";
import {
  CURRENT_MONTH_KEY,
  formatLastSyncedAt,
  getDashboardViewModel,
  getLastSyncedAt,
  getPeriodOptions,
  INSTITUTION_NAME,
  parsePeriod,
  serializePeriod,
} from "@/lib/gerencial/data";
import { donorLevelCounts } from "@/lib/gerencial/donorLevels";
import type { Period } from "@/lib/gerencial/types";
import { AlertsSection } from "./AlertsSection";
import { AttendanceSection } from "./AttendanceSection";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardHeader } from "./DashboardHeader";
import { DonationsChartSection } from "./DonationsChartSection";
import { DonorLevelsSection } from "./DonorLevelsSection";
import { KpiGrid } from "./KpiGrid";

const periodOptions = getPeriodOptions();

export function GerencialDashboard() {
  const [period, setPeriod] = useState<Period>({ kind: "month", monthKey: CURRENT_MONTH_KEY });
  const [lastSyncedAt] = useState(() => getLastSyncedAt());
  const viewModel = useMemo(() => getDashboardViewModel(period), [period]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <DashboardHeader
        periodLabel={viewModel.periodLabel}
        periodOptions={periodOptions}
        periodValue={serializePeriod(period)}
        onPeriodChange={(value) => setPeriod(parsePeriod(value))}
        viewModel={viewModel}
        institutionName={INSTITUTION_NAME}
      />

      <AlertsSection alerts={viewModel.alerts} />

      <div className="mt-6">
        <KpiGrid kpis={viewModel.kpis} periodKind={period.kind} />
      </div>

      <div className="mt-6">
        <DonationsChartSection chart={viewModel.chart} donationTypeBreakdown={viewModel.donationTypeBreakdown} />
      </div>

      <section className="mt-6">
        <AttendanceSection data={viewModel.attendance} />
      </section>

      <section className="mt-6">
        <DonorLevelsSection visible={period.kind === "historic"} items={donorLevelCounts} />
      </section>

      <div className="mt-8">
        <DashboardFooter lastSyncedLabel={formatLastSyncedAt(lastSyncedAt)} />
      </div>
    </div>
  );
}
