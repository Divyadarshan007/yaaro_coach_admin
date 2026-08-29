import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { ClubMember } from "@/features/clubs/types/club";

function locationOf(member: ClubMember): string {
  return [member.city, member.state, member.country].filter(Boolean).join(", ");
}

export function ClubMembersTab({ members }: { members: ClubMember[] }) {
  if (members.length === 0) {
    return (
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          className="min-h-64 justify-center"
          icon={Users}
          title="No members yet"
          description="Members who join this club from the yaaro app will appear here."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
      {members.map((member) => {
        const name = member.fullName || member.userName || "Member";
        const avatar = avatarFromName(name, member.id);
        const location = locationOf(member);
        return (
          <div key={member.id} className="flex items-center gap-3 px-4 py-3">
            <Avatar>
              {member.profileImage && <AvatarImage src={member.profileImage} alt={name} />}
              <AvatarFallback className={avatar.colorClassName}>{avatar.initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">{name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {member.userName ? `@${member.userName}` : ""}
                {member.userName && location ? " · " : ""}
                {location}
              </span>
            </div>
            {member.role === "owner" && (
              <Badge variant="secondary" className="ml-auto">
                Owner
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
