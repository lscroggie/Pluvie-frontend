import type { DashboardViewModel } from "@/lib/gerencial/types";
import { DonationsBarChart } from "./DonationsBarChart";
import { DonationTypeBreakdown } from "./DonationTypeBreakdown";

export function DonationsChartSection({
  chart,
  donationTypeBreakdown,
}: {
  chart: DashboardViewModel["chart"];
  donationTypeBreakdown: DashboardViewModel["donationTypeBreakdown"];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <DonationsBarChart title={chart.title} points={chart.points} trend={chart.trend} projection={chart.projection} />
      </div>
      <DonationTypeBreakdown items={donationTypeBreakdown} />
    </div>
  );
}
