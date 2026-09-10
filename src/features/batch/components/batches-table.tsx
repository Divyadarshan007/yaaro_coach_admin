import { CalendarClock } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BatchRow } from "@/features/batch/components/batch-row";
import type { Batch } from "@/features/batch/types/batch";

const headerCellClassName =
  "px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase";

export function BatchesTable({ batches }: { batches: Batch[] }) {
  if (batches.length === 0) {
    return (
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          className="min-h-64 justify-center"
          icon={CalendarClock}
          title="No batches yet"
          description="Create a batch to schedule a group training slot for your clients."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={headerCellClassName}>Title</TableHead>
            <TableHead className={headerCellClassName}>Start</TableHead>
            <TableHead className={headerCellClassName}>End</TableHead>
            <TableHead className={headerCellClassName}>Limit</TableHead>
            <TableHead className={headerCellClassName}>Members</TableHead>
            <TableHead className={headerCellClassName}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <BatchRow key={batch.id} batch={batch} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
