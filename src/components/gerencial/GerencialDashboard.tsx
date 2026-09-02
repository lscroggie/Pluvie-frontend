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
  retentionCohorts,
  serializePeriod,
} from "@/lib/gerencial/data";
import {
  donorLevelCounts,
  donorLevelInactivityCounts,
  HIGH_LEVEL_INACTIVITY_THRESHOLD_MONTHS,
} from "@/lib/gerencial/donorLevels";
import type { Period } from "@/lib/gerencial/types";
import { AlertsSection } from "./AlertsSection";
import { AttendanceSection } from "./AttendanceSection";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardHeader } from "./DashboardHeader";
import { DonationsChartSection } from "./DonationsChartSection";
import { DonorLevelsSection } from "./DonorLevelsSection";
import { DonorRiskSection } from "./DonorRiskSection";
import { KpiGrid } from "./KpiGrid";
import { RetentionCohortsSection } from "./RetentionCohortsSection";
import { SegmentationAndImpactSection } from "./SegmentationAndImpactSection";
import { SuggestionsSection } from "./SuggestionsSection";

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

      <SuggestionsSection suggestions={viewModel.suggestions} />

      <div className="mt-6">
        <KpiGrid kpis={viewModel.kpis} periodKind={period.kind} />
      </div>

      <div className="mt-6">
        <DonationsChartSection chart={viewModel.chart} donationTypeBreakdown={viewModel.donationTypeBreakdown} />
      </div>

      <section className="mt-6">
        <AttendanceSection data={viewModel.attendance} notEligibleReasons={viewModel.notEligibleReasons} />
      </section>

      <section className="mt-6">
        <SegmentationAndImpactSection donorSegmentation={viewModel.donorSegmentation} impact={viewModel.impact} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <DonorLevelsSection visible={period.kind === "historic"} items={donorLevelCounts} />
        <RetentionCohortsSection visible={period.kind === "historic"} cohorts={retentionCohorts} />
      </section>

      <section className="mt-6">
        <DonorRiskSection
          visible={period.kind === "historic"}
          thresholdMonths={HIGH_LEVEL_INACTIVITY_THRESHOLD_MONTHS}
          oroTotal={donorLevelCounts.find((item) => item.id === "oro")?.count ?? 0}
          diamanteTotal={donorLevelCounts.find((item) => item.id === "diamante")?.count ?? 0}
          oroInactive={donorLevelInactivityCounts.oro}
          diamanteInactive={donorLevelInactivityCounts.diamante}
        />
      </section>

      <div className="mt-8">
        <DashboardFooter lastSyncedLabel={formatLastSyncedAt(lastSyncedAt)} />
      </div>
    </div>
  );
}
