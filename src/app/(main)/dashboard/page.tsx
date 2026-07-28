import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { coachDisplayName, statCards, weeklyChartAxis } from "@/features/dashboard/data/dashboard-mock-data";

export default function DashboardPage() {
  return (
    <DashboardView coachName={coachDisplayName} stats={statCards} weeklyChartAxis={weeklyChartAxis} />
  );
}
