import { ClientsView } from "@/features/clients/components/clients-view";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { toClient } from "@/features/clients/lib/to-client";
import { getClients } from "@/lib/api/clients";
import { getCoachProfile } from "@/lib/api/coach";
import { getPrograms } from "@/lib/api/programs";

export default async function ClientsPage() {
  const [summaries, coachProfile, libraryPrograms] = await Promise.all([
    getClients(),
    getCoachProfile(),
    getPrograms(),
  ]);
  const coachAvatar = avatarFromName(coachProfile?.name || coachProfile?.email || "Coach", coachProfile?.id ?? "coach");
  const clients = summaries.map((summary) => toClient(summary, coachAvatar));

  return <ClientsView clients={clients} coachSlug={coachProfile?.slug ?? ""} libraryPrograms={libraryPrograms} />;
}
