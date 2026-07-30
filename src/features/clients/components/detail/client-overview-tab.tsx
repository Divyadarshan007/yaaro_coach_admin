import { CoachedCard } from "@/features/clients/components/detail/coached-card";
import { LatestActivitiesCard } from "@/features/clients/components/detail/latest-activities-card";
import { NotesCard } from "@/features/clients/components/detail/notes-card";
import { StatisticsSection } from "@/features/clients/components/detail/statistics-section";
import { WorkoutProgramCard } from "@/features/clients/components/detail/workout-program-card";
import type { ClientDetail } from "@/features/clients/types/client-detail";

export function ClientOverviewTab({ client }: { client: ClientDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <CoachedCard client={client} />
          <WorkoutProgramCard client={client} />
          <NotesCard />
        </div>
        <LatestActivitiesCard activities={client.activities} />
      </div>
      <StatisticsSection client={client} />
    </div>
  );
}
