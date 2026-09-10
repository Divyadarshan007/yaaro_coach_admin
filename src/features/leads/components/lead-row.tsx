"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, UserRoundPlus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { AddClientFormDialog } from "@/features/clients/components/add-client-form-dialog";
import { deleteLeadAction, updateLeadAction } from "@/features/leads/actions";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import { formatLeadDate } from "@/features/leads/lib/format";
import type { CoachLead } from "@/features/leads/types/lead";

export function LeadRow({ lead }: { lead: CoachLead }) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const alreadyConverted = lead.status === "converted";

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

  // Mark the lead converted once the client has actually been created.
  async function handleConverted() {
    if (alreadyConverted) return;
    await updateLeadAction(lead.id, { status: "converted" });
  }

  return (
    <TableRow>
      <TableCell className="px-4 py-3 text-sm font-medium text-foreground">
        {lead.name}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">
        {lead.number}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">
        {lead.source?.name ?? "—"}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">
        {formatLeadDate(lead.date)}
      </TableCell>
      <TableCell className="px-4 py-3">
        <LeadStatusBadge status={lead.status} />
      </TableCell>
      <TableCell className="max-w-xs px-4 py-3 text-sm text-muted-foreground">
        <span className="line-clamp-2 wrap-break-word">
          {lead.notes || "—"}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Lead actions" />
            }
          >
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/leads/${lead.id}/edit`)}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
            {!alreadyConverted && (
              <DropdownMenuItem onClick={() => setIsConvertOpen(true)}>
                <UserRoundPlus />
                Convert to client
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AddClientFormDialog
          open={isConvertOpen}
          onOpenChange={setIsConvertOpen}
          initialValues={{
            name: lead.name,
            phone: lead.number,
            gender: lead.gender,
            sourceId: lead.sourceId,
          }}
          onCreated={handleConverted}
        />

        <Dialog
          open={isDeleteOpen}
          onOpenChange={(next) => !isDeleting && setIsDeleteOpen(next)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete {lead.name}?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-muted-foreground">
                This will permanently remove this lead. This action cannot be
                undone.
              </p>
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
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
              <Button
                variant="destructive"
                size="lg"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete lead"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
