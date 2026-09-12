"use client";

import { useMemo, useState } from "react";

import { MembersTable } from "@/features/team/components/members-table";
import { MembersToolbar } from "@/features/team/components/members-toolbar";
import type { Team } from "@/features/team/types/team";

export function MembersTab({ team }: { team: Team }) {
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return team.members;
    return team.members.filter(
      (member) => member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
    );
  }, [team.members, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground">Invite and manage your team</p>
        </div>
        <MembersToolbar team={team} search={search} onSearchChange={setSearch} />
      </div>

      <MembersTable members={filteredMembers} myRole={team.myRole} studioName={team.name} />
    </div>
  );
}
