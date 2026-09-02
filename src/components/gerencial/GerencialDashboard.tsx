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
import { BloodTypeNeedSection } from "./BloodTypeNeedSection";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardHeader } from "./DashboardHeader";
import { DonationsBarChart } from "./DonationsBarChart";
import { DonationTypeBreakdown } from "./DonationTypeBreakdown";
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
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      <DashboardHeader
        periodLabel={viewModel.periodLabel}
        periodOptions={periodOptions}
        periodValue={serializePeriod(period)}
        onPeriodChange={(value) => setPeriod(parsePeriod(value))}
        viewModel={viewModel}
        institutionName={INSTITUTION_NAME}
      />

      <div className="mt-4">
        <KpiGrid
          kpis={viewModel.kpis}
          periodKind={period.kind}
          donationTypeBreakdown={viewModel.donationTypeBreakdown}
          peopleHelpedBreakdown={viewModel.peopleHelpedBreakdown}
          attendance={viewModel.attendance}
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DonationsBarChart
            title={viewModel.chart.title}
            points={viewModel.chart.points}
            projection={viewModel.chart.projection}
          />
        </div>
        <div className="flex flex-col gap-3">
          <AlertsSection alerts={viewModel.alerts} />
          <SuggestionsSection suggestions={viewModel.suggestions} />
          <DonationTypeBreakdown items={viewModel.donationTypeBreakdown} />
        </div>
      </div>

      <div className="mt-4">
        <BloodTypeNeedSection />
      </div>

      <section className="mt-4">
        <AttendanceSection data={viewModel.attendance} notEligibleReasons={viewModel.notEligibleReasons} />
      </section>

      <section className="mt-4">
        <SegmentationAndImpactSection
          donorSegmentation={viewModel.donorSegmentation}
          newDonorDetail={viewModel.newDonorDetail}
          recurringDonorLevelBreakdown={viewModel.recurringDonorLevelBreakdown}
          impact={viewModel.impact}
        />
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-2">
        <DonorLevelsSection visible={period.kind === "historic"} items={donorLevelCounts} />
        <RetentionCohortsSection visible={period.kind === "historic"} cohorts={retentionCohorts} />
      </section>

      <section className="mt-4">
        <DonorRiskSection
          visible={period.kind === "historic"}
          thresholdMonths={HIGH_LEVEL_INACTIVITY_THRESHOLD_MONTHS}
          oroTotal={donorLevelCounts.find((item) => item.id === "oro")?.count ?? 0}
          diamanteTotal={donorLevelCounts.find((item) => item.id === "diamante")?.count ?? 0}
          oroInactive={donorLevelInactivityCounts.oro}
          diamanteInactive={donorLevelInactivityCounts.diamante}
        />
      </section>

      <div className="mt-6">
        <DashboardFooter lastSyncedLabel={formatLastSyncedAt(lastSyncedAt)} />
      </div>
    </div>
  );
}
