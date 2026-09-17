import { ClientsView } from "@/features/clients/components/clients-view";
import { toClient } from "@/features/clients/lib/to-client";
import { getClients } from "@/lib/api/clients";
import { getPrograms } from "@/lib/api/programs";
import { getTeam } from "@/lib/api/team";

export default async function ClientsPage() {
  const [summaries, libraryPrograms, team] = await Promise.all([
    getClients(),
    getPrograms("mine"),
    getTeam(),
  ]);
  const clients = summaries.map((summary) => toClient(summary));
  // Only other active teammates can be reassigned to — see clients/[id]/page.tsx for the same rule.
  const reassignableTeamMembers = team.members.filter((member) => member.status === "active" && !member.isMe);

  return (
    <ClientsView
      clients={clients}
      libraryPrograms={libraryPrograms}
      teamMembers={reassignableTeamMembers}
      joinQrValue={team.joinQrValue}
      studioName={team.name}
    />
  );
}
