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
import { deleteMembershipPlanAction } from "@/features/membership-plan/actions";
import { formatPrice, planValidity } from "@/features/membership-plan/lib/format";
import type { MembershipPlan } from "@/features/membership-plan/types/membership-plan";

export function MembershipPlanRow({ plan }: { plan: MembershipPlan }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startDeleteTransition(async () => {
      try {
        await deleteMembershipPlanAction(plan.id);
        setIsDeleteOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete membership plan");
      }
    });
  }

  return (
    <TableRow>
      <TableCell className="px-4 py-3 text-sm font-medium text-foreground">{plan.title}</TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">{planValidity(plan)}</TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">{formatPrice(plan.price)}</TableCell>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/membership-plan/${plan.id}/edit`} />}
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
              <DialogTitle>Delete {plan.title}?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p className="text-sm text-muted-foreground">
                This will permanently remove this membership plan. This action cannot be undone.
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
                {isDeleting ? "Deleting..." : "Delete plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
