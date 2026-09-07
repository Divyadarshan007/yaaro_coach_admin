"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteLeadAction } from "@/features/leads/actions";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { formatLeadDate } from "@/features/leads/lib/format";
import type { CoachLead } from "@/features/leads/types/lead";

export function LeadRow({ lead }: { lead: CoachLead }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startDeleteTransition(async () => {
      try {
        await deleteLeadAction(lead.id);
        setIsDeleteOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete lead");
      }
    });
  }

  return (
    <TableRow>
      <TableCell className="px-4 py-3 text-sm font-medium text-foreground">{lead.name}</TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">{lead.number}</TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">{lead.source?.name ?? "—"}</TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">{formatLeadDate(lead.date)}</TableCell>
      <TableCell className="px-4 py-3">
        <LeadStatusBadge status={lead.status} />
      </TableCell>
      <TableCell className="max-w-xs px-4 py-3 text-sm text-muted-foreground">
        <span className="line-clamp-2 wrap-break-word">{lead.notes || "—"}</span>
      </TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/leads/${lead.id}/edit`} />}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 />
            Delete
          </Button>
        </div>

        <Dialog open={isDeleteOpen} onOpenChange={(next) => !isDeleting && setIsDeleteOpen(next)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete {lead.name}?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-muted-foreground">
                This will permanently remove this lead. This action cannot be undone.
              </p>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </DialogBody>
            <DialogFooter className="flex-row justify-end">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" size="lg" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete lead"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
