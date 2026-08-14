import { CoachedCard } from "@/features/clients/components/detail/coached-card";
// import { LatestActivitiesCard } from "@/features/clients/components/detail/latest-activities-card";
import { NotesCard } from "@/features/clients/components/detail/notes-card";
import { StatisticsSection } from "@/features/clients/components/detail/statistics-section";
import { WorkoutProgramCard } from "@/features/clients/components/detail/workout-program-card";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import type { Program } from "@/features/program-editor/types/program-editor";
import type { TeamMember } from "@/features/team/types/team";

export function ClientOverviewTab({
  client,
  libraryPrograms,
  teamMembers,
}: {
  client: ClientDetail;
  libraryPrograms: Program[];
  teamMembers: TeamMember[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4">
        <CoachedCard client={client} teamMembers={teamMembers} />
        <WorkoutProgramCard client={client} libraryPrograms={libraryPrograms} />
        <NotesCard />
        {/* <LatestActivitiesCard activities={client.activities} /> — hidden for now, no real activity-feed data source yet */}
      </div>
      <StatisticsSection client={client} />
    </div>
  );
}
