import type {
  AbsentMember,
  CurrentSubscription,
  Renewal,
  StatCardData,
  UpcomingBirthday,
  WeeklyActiveClients,
} from "@/features/dashboard/types/dashboard";
import { AbsentMembersPanel } from "@/features/dashboard/components/absent-members-panel";
import { DashboardGreeting } from "@/features/dashboard/components/dashboard-greeting";
import { RenewalsPanel } from "@/features/dashboard/components/renewals-panel";
import { StatCardRow } from "@/features/dashboard/components/stat-card-row";
import { SubscriptionBanner } from "@/features/dashboard/components/subscription-banner";
// import { LatestActivitiesPanel } from "@/features/dashboard/components/latest-activities-panel";
import { UpcomingBirthdaysPanel } from "@/features/dashboard/components/upcoming-birthdays-panel";
import { WeeklyActiveClientsPanel } from "@/features/dashboard/components/weekly-active-clients-panel";

type DashboardViewProps = {
  coachName: string;
  stats: StatCardData[];
  weeklyActiveClients: WeeklyActiveClients;
  upcomingBirthdays: UpcomingBirthday[];
  absentMembers: AbsentMember[];
  renewals: Renewal[];
  currentSubscription: CurrentSubscription | null;
};

export function DashboardView({
  coachName,
  stats,
  weeklyActiveClients,
  upcomingBirthdays,
  absentMembers,
  renewals,
  currentSubscription,
}: DashboardViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardGreeting name={coachName} />
      <SubscriptionBanner subscription={currentSubscription} />
      <StatCardRow stats={stats} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* <LatestActivitiesPanel /> — hidden for now, no real activity-feed data source yet */}
        <div className="lg:col-span-2">
          <WeeklyActiveClientsPanel data={weeklyActiveClients} />
        </div>
        <UpcomingBirthdaysPanel birthdays={upcomingBirthdays} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AbsentMembersPanel members={absentMembers} />
        <RenewalsPanel renewals={renewals} />
      </div>
    </div>
  );
}
