import { ActiveProgramPanel } from "@/features/clients/components/detail/active-program-panel";
import { WorkoutHistoryColumn } from "@/features/clients/components/detail/workout-history-column";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import type { Program } from "@/features/program-editor/types/program-editor";

export function ClientWorkoutProgramTab({
  client,
  libraryPrograms,
  activeProgram,
  initialFeeds,
}: {
  client: ClientDetail;
  libraryPrograms: Program[];
  activeProgram: Program | null;
  initialFeeds: FeedItem[];
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <WorkoutHistoryColumn
          clientId={client.id}
          clientName={client.name}
          clientAvatar={client.avatar}
          initialFeeds={initialFeeds}
        />
      </div>
      <ActiveProgramPanel client={client} libraryPrograms={libraryPrograms} activeProgram={activeProgram} />
    </div>
  );
}
