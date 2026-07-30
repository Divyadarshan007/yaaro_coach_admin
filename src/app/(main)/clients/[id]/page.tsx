import { notFound } from "next/navigation";

import { ClientDetailView } from "@/features/clients/components/detail/client-detail-view";
import { getClientDetailMockStats } from "@/features/clients/data/client-detail-mock-data";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import { getClient } from "@/lib/api/clients";
import { getCoachProfile } from "@/lib/api/coach";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [summary, coachProfile] = await Promise.all([getClient(id), getCoachProfile()]);

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

  return <ClientDetailView client={client} />;
}
