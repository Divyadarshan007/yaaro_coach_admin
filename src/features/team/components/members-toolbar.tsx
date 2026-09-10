"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { AddCoachQrDialog } from "@/features/team/components/add-coach-qr-dialog";
import { AddManagementDialog } from "@/features/team/components/add-management-dialog";
import type { Team } from "@/features/team/types/team";

type MembersToolbarProps = {
  team: Team;
  search: string;
  onSearchChange: (value: string) => void;
};

export function MembersToolbar({ team, search, onSearchChange }: MembersToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:w-64">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search members"
          className="h-9 w-full pl-9"
        />
      </div>
      {team.myRole === "owner" && (
        <div className="flex items-center gap-2">
          <AddManagementDialog />
          <AddCoachQrDialog joinCoachQrValue={team.joinCoachQrValue} studioName={team.name} />
        </div>
      )}
    </div>
  );
}
