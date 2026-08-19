import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientRow } from "@/features/clients/components/client-row";
import type { Client } from "@/features/clients/types/client";
import type { Program } from "@/features/program-editor/types/program-editor";
import type { TeamMember } from "@/features/team/types/team";

const headerCellClassName = "px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase";

export function ClientsTable({
  clients,
  libraryPrograms,
  teamMembers,
}: {
  clients: Client[];
  libraryPrograms: Program[];
  teamMembers: TeamMember[];
}) {
  if (clients.length === 0) {
    return (
      <div className="rounded-xl ring-1 ring-foreground/10">
        <EmptyState
          icon={Users}
          title="No clients found"
          description="Try a different search or coach filter, or invite a new client to get started."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={headerCellClassName}>Client</TableHead>
            <TableHead className={headerCellClassName}>Program</TableHead>
            <TableHead className={headerCellClassName}>Last 7 Days</TableHead>
            <TableHead className={headerCellClassName}>Coach</TableHead>
            <TableHead className={headerCellClassName}>Status</TableHead>
            <TableHead className={headerCellClassName} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <ClientRow key={client.id} client={client} libraryPrograms={libraryPrograms} teamMembers={teamMembers} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
