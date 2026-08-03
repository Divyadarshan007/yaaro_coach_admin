import { notFound } from "next/navigation";

import { ClientDetailView } from "@/features/clients/components/detail/client-detail-view";
import { getClientDetailMockStats } from "@/features/clients/data/client-detail-mock-data";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import { getClient, getClientFeeds, getClientMeasurements, getClientProgram } from "@/lib/api/clients";
import { getCoachProfile } from "@/lib/api/coach";
import { getExerciseCatalog } from "@/lib/api/exercises";
import { getPrograms } from "@/lib/api/programs";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [summary, coachProfile, libraryPrograms, activeProgram, initialFeeds, exerciseCatalog, initialMeasurements] =
    await Promise.all([
      getClient(id),
      getCoachProfile(),
      getPrograms(),
      getClientProgram(id),
      getClientFeeds(id, 1),
      getExerciseCatalog(),
      getClientMeasurements(id),
    ]);

  if (!summary) {
    notFound();
  }

  const coachAvatar = avatarFromName(coachProfile?.name || coachProfile?.email || "Coach", coachProfile?.id ?? "coach");
  const stats = getClientDetailMockStats(id);

  const client: ClientDetail = {
    id: summary.id,
    avatar: avatarFromName(summary.name || summary.email || "Client", summary.id),
    name: summary.name,
    email: summary.email,
    coach: coachAvatar,
    coachedSinceLabel: `Coached since ${new Date(summary.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    coachedSince: summary.createdAt,
    notes: summary.notes,
    workoutProgram: summary.currentProgram
      ? {
          id: summary.currentProgram.id,
          name: summary.currentProgram.title,
          routineCount: summary.currentProgram.routineCount ?? 0,
          programStartDate: summary.programStartDate,
        }
      : null,
    ...stats,
  };

  return (
    <ClientDetailView
      client={client}
      libraryPrograms={libraryPrograms}
      activeProgram={activeProgram}
      initialFeeds={initialFeeds}
      exerciseCatalog={exerciseCatalog}
      initialMeasurements={initialMeasurements}
    />
  );
}
