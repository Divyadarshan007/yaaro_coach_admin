import { avatarFromName } from "@/features/clients/lib/avatar";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { TeamView } from "@/features/team/components/team-view";
import { getTeam } from "@/lib/api/team";

export default async function TeamPage() {
  const team = await getTeam();
  const teamAvatar = avatarFromName(team.name, team.id);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <PersonAvatar avatar={teamAvatar} size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-medium text-foreground">{team.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Team &middot; {team.members.length} member{team.members.length === 1 ? "" : "s"}
            </p>
            <div className="flex -space-x-2">
              {team.members.slice(0, 5).map((member) => (
                <PersonAvatar
                  key={member.id}
                  avatar={avatarFromName(member.name, member.id)}
                  size="sm"
                  className="ring-2 ring-background"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <TeamView team={team} />
    </div>
  );
}
