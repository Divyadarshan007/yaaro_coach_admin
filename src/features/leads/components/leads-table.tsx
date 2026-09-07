import { UserPlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadRow } from "@/features/leads/components/lead-row";
import type { CoachLead } from "@/features/leads/types/lead";

const headerCellClassName =
  "px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase";

export function LeadsTable({ leads, isFiltered }: { leads: CoachLead[]; isFiltered: boolean }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          className="min-h-64 justify-center"
          icon={UserPlus}
          title={isFiltered ? "No leads match your filters" : "No leads yet"}
          description={
            isFiltered
              ? "Try a different search or status filter."
              : "Add a lead to start tracking prospects and where they came from."
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={headerCellClassName}>Name</TableHead>
            <TableHead className={headerCellClassName}>Number</TableHead>
            <TableHead className={headerCellClassName}>Source</TableHead>
            <TableHead className={headerCellClassName}>Date</TableHead>
            <TableHead className={headerCellClassName}>Status</TableHead>
            <TableHead className={headerCellClassName}>Notes</TableHead>
            <TableHead className={headerCellClassName}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
