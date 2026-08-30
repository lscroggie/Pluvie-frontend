"use client";

import { useMemo, useState } from "react";
import {
  buildExecutiveSummary,
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
import { DonationsBarChart } from "./DonationsBarChart";
import { DonationTypeBreakdown } from "./DonationTypeBreakdown";
import { DonorLevelsChart } from "./DonorLevelsChart";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { ExportMenu } from "./ExportMenu";
import { KpiCard } from "./KpiCard";
import { PeriodSelector } from "./PeriodSelector";

const periodOptions = getPeriodOptions();

export function GerencialDashboard() {
  const [period, setPeriod] = useState<Period>({ kind: "month", monthKey: CURRENT_MONTH_KEY });
  const [lastSyncedAt] = useState(() => getLastSyncedAt());
  const viewModel = useMemo(() => getDashboardViewModel(period), [period]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-brand-charcoal"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Vista general · {viewModel.periodLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector
            options={periodOptions}
            value={serializePeriod(period)}
            onChange={(value) => setPeriod(parsePeriod(value))}
          />
          <ExportMenu viewModel={viewModel} institutionName={INSTITUTION_NAME} />
        </div>
      </div>

      {period.kind !== "historic" && <ExecutiveSummary text={buildExecutiveSummary(viewModel, period)} />}

      <AlertsSection alerts={viewModel.alerts} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={
            period.kind === "month"
              ? "Donaciones este mes"
              : period.kind === "year"
                ? "Donaciones este año"
                : "Donaciones totales"
          }
          value={String(viewModel.kpis.donationsThisMonth.value)}
          delta={viewModel.kpis.donationsThisMonth.delta}
          accent="charcoal"
        />
        <KpiCard
          label="Personas ayudadas"
          value={viewModel.kpis.peopleHelped.value.toLocaleString("es-AR")}
          delta={viewModel.kpis.peopleHelped.delta}
          sublabel="Multiplicador 3x"
          highlighted
        />
        <KpiCard
          label="Turnos programados"
          value={String(viewModel.kpis.scheduledAppointments.value)}
          delta={viewModel.kpis.scheduledAppointments.delta}
          accent="charcoal"
        />
        <KpiCard
          label="Tasa de asistencia"
          value={`${viewModel.kpis.attendanceRate.value}%`}
          delta={viewModel.kpis.attendanceRate.delta}
          accent="charcoal"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DonationsBarChart title={viewModel.chart.title} points={viewModel.chart.points} />
        </div>
        <DonationTypeBreakdown items={viewModel.donationTypeBreakdown} />
      </div>

      <section className="mt-6">
        <AttendanceSection data={viewModel.attendance} />
      </section>

      {period.kind === "historic" && (
        <section className="mt-6">
          <DonorLevelsChart items={donorLevelCounts} />
        </section>
      )}

      <footer className="mt-8 text-xs text-zinc-400">
        Datos actualizados al {formatLastSyncedAt(lastSyncedAt)}
      </footer>
    </div>
  );
}
