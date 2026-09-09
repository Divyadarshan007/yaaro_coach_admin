"use client";

import { useMemo, useState } from "react";

import { ALL_COACHES, ClientsScopeBar } from "@/features/clients/components/clients-scope-bar";
import { ClientsTable } from "@/features/clients/components/clients-table";
import { ClientsToolbar } from "@/features/clients/components/clients-toolbar";
import { PendingJoinRequests } from "@/features/clients/components/pending-join-requests";
import type { Client } from "@/features/clients/types/client";
import type { Program } from "@/features/program-editor/types/program-editor";
import type { TeamMember } from "@/features/team/types/team";
import type { StudioJoinRequest } from "@/lib/api/studio-join-requests";

export function ClientsView({
  clients,
  coachSlug,
  libraryPrograms,
  teamMembers,
  joinRequests,
  joinQrValue,
  studioName,
  isOwner,
}: {
  clients: Client[];
  coachSlug: string;
  libraryPrograms: Program[];
  teamMembers: TeamMember[];
  joinRequests: StudioJoinRequest[];
  joinQrValue: string;
  studioName: string;
  isOwner: boolean;
}) {
  const [search, setSearch] = useState("");
  const [coachFilter, setCoachFilter] = useState(ALL_COACHES);

  const coachNames = useMemo(
    () => Array.from(new Set(clients.map((client) => client.coach.name))),
    [clients]
  );

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesSearch = !query || client.avatar.name.toLowerCase().includes(query);
      const matchesCoach = coachFilter === ALL_COACHES || client.coach.name === coachFilter;
      return matchesSearch && matchesCoach;
    });
  }, [clients, search, coachFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground">Invite and manage your clients</p>
        </div>
        <ClientsToolbar
          search={search}
          onSearchChange={setSearch}
          coachSlug={coachSlug}
          joinQrValue={joinQrValue}
          studioName={studioName}
        />
      </div>

      {isOwner && joinRequests.length > 0 && <PendingJoinRequests requests={joinRequests} />}

      <ClientsScopeBar coachFilter={coachFilter} onCoachFilterChange={setCoachFilter} coachNames={coachNames} />

      <ClientsTable clients={filteredClients} libraryPrograms={libraryPrograms} teamMembers={teamMembers} />
    </div>
  );
}
