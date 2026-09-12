"use client";

import { useMemo, useState } from "react";

import { ClientsTable } from "@/features/clients/components/clients-table";
import { ClientsToolbar } from "@/features/clients/components/clients-toolbar";
import type { Client } from "@/features/clients/types/client";
import type { Program } from "@/features/program-editor/types/program-editor";
import type { TeamMember } from "@/features/team/types/team";

export function ClientsView({
  clients,
  libraryPrograms,
  teamMembers,
  joinQrValue,
  studioName,
}: {
  clients: Client[];
  libraryPrograms: Program[];
  teamMembers: TeamMember[];
  joinQrValue: string;
  studioName: string;
}) {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) =>
      client.avatar.name.toLowerCase().includes(query),
    );
  }, [clients, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Invite and manage your clients
          </p>
        </div>
        <ClientsToolbar
          search={search}
          onSearchChange={setSearch}
          joinQrValue={joinQrValue}
          studioName={studioName}
        />
      </div>

      <ClientsTable
        clients={filteredClients}
        libraryPrograms={libraryPrograms}
        teamMembers={teamMembers}
      />
    </div>
  );
}
