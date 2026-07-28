import type { StatCardData, WeeklyChartAxis } from "@/features/dashboard/types/dashboard";
import { OnboardingCard } from "@/features/dashboard/components/onboarding-card";
import { DashboardGreeting } from "@/features/dashboard/components/dashboard-greeting";
import { StatCardRow } from "@/features/dashboard/components/stat-card-row";
import { LatestActivitiesPanel } from "@/features/dashboard/components/latest-activities-panel";
import { WeeklyActiveClientsPanel } from "@/features/dashboard/components/weekly-active-clients-panel";

type DashboardViewProps = {
  coachName: string;
  stats: StatCardData[];
  weeklyChartAxis: WeeklyChartAxis;
};

export function DashboardView({ coachName, stats, weeklyChartAxis }: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <OnboardingCard />
      <DashboardGreeting name={coachName} />
      <StatCardRow stats={stats} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LatestActivitiesPanel />
        <WeeklyActiveClientsPanel axis={weeklyChartAxis} />
      </div>
    </div>
  );
}
