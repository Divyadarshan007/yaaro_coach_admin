"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { AddMemberDialog } from "@/features/team/components/add-member-dialog";
import { MembersTable } from "@/features/team/components/members-table";
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members"
            className="h-9 w-full pl-9"
          />
        </div>
        <AddMemberDialog />
      </div>

      <MembersTable members={filteredMembers} myRole={team.myRole} />
    </div>
  );
}
