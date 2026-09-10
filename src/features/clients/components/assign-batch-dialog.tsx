"use client";

import { useEffect, useState, useTransition } from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBatchesAction } from "@/features/batch/actions";
import { formatTime } from "@/features/batch/lib/format";
import type { Batch } from "@/features/batch/types/batch";
import { assignClientBatchAction } from "@/features/clients/actions";

const NO_BATCH = "__none__";

export function AssignBatchDialog({
  clientId,
  clientName,
  currentBatchId,
  open,
  onOpenChange,
}: {
  clientId: string;
  clientName: string;
  currentBatchId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [batches, setBatches] = useState<Batch[]>([]);
  // null = untouched, follow currentBatchId; "" = explicitly "No batch".
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = draft ?? currentBatchId ?? "";

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getBatchesAction()
      .then((list) => {
        if (!cancelled) setBatches(list);
      })
      .catch(() => {
        if (!cancelled) setBatches([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function close(next: boolean) {
    if (isPending) return;
    if (!next) {
      setDraft(null);
      setError(null);
    }
    onOpenChange(next);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await assignClientBatchAction(clientId, selected || null);
        setDraft(null);
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to assign batch");
      }
    });
  }

  // A full "limited" batch can still be picked if the client is already in it.
  function isBatchDisabled(batch: Batch): boolean {
    if (batch.id === currentBatchId) return false;
    return (
      batch.limitType === "limited" &&
      batch.maxMembers != null &&
      batch.memberCount >= batch.maxMembers
    );
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign batch for {clientName}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Select<string>
            value={selected || NO_BATCH}
            onValueChange={(value) =>
              setDraft(!value || value === NO_BATCH ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string) =>
                  value === NO_BATCH
                    ? "No batch"
                    : (batches.find((b) => b.id === value)?.title ?? "No batch")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_BATCH}>No batch</SelectItem>
              {batches.map((batch) => {
                const disabled = isBatchDisabled(batch);
                return (
                  <SelectItem
                    key={batch.id}
                    value={batch.id}
                    disabled={disabled}
                  >
                    {batch.title} · {formatTime(batch.startTime)}–
                    {formatTime(batch.endTime)}
                    {disabled ? " (full)" : ""}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button
            variant="outline"
            size="lg"
            onClick={() => close(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button size="lg" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
