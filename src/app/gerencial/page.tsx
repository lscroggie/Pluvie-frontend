import { AttendanceSection } from "@/components/gerencial/AttendanceSection";
import { DonationTypeBreakdown } from "@/components/gerencial/DonationTypeBreakdown";
import { DownloadIcon } from "@/components/gerencial/icons";
import { KpiCard } from "@/components/gerencial/KpiCard";
import { WeeklyDonationsChart } from "@/components/gerencial/WeeklyDonationsChart";
import {
  attendance,
  donationTypeBreakdown,
  peopleHelpedThisMonth,
  summary,
  weeklyDonations,
} from "@/lib/gerencial/data";

export const metadata = {
  title: "Dashboard gerencial · Pluvie",
  description: "Panel gerencial de donaciones de Pluvie",
};

export default function GerencialPage() {
  const period = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const periodLabel = period.charAt(0).toUpperCase() + period.slice(1);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-semibold text-brand-charcoal"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Vista general · {periodLabel}</p>
        </div>
        <span className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-500">
          <DownloadIcon className="h-4 w-4" />
          Exportar reporte
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Donaciones este mes"
          value={String(summary.donationsThisMonth)}
          delta="↑ 12% vs mes anterior"
          accent="charcoal"
        />
        <KpiCard
          label="Personas ayudadas"
          value={peopleHelpedThisMonth.toLocaleString("es-AR")}
          sublabel="Multiplicador 3x"
          highlighted
        />
        <KpiCard
          label="Turnos programados"
          value={String(summary.scheduledAppointments)}
          delta="↑ 6% vs mes anterior"
          accent="charcoal"
        />
        <KpiCard
          label="Tasa de asistencia"
          value={`${Math.round(summary.attendanceRate * 100)}%`}
          delta="↑ 3pp vs mes anterior"
          accent="charcoal"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyDonationsChart data={weeklyDonations} />
        </div>
        <DonationTypeBreakdown items={donationTypeBreakdown} />
      </div>

      <section className="mt-6">
        <AttendanceSection data={attendance} />
      </section>
    </div>
  );
}
