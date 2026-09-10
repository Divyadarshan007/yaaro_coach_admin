"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createLeadSourceAction,
  deleteLeadSourceAction,
  updateLeadSourceAction,
} from "@/features/leads/actions";
import type { LeadSource } from "@/features/leads/types/lead";

export function LeadSourcesDialog({
  open,
  onOpenChange,
  sources,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: LeadSource[];
}) {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function run(fn: () => Promise<unknown>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        after?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    run(
      () => createLeadSourceAction({ name }),
      () => {
        setNewName("");
        onOpenChange(false);
      },
    );
  }

  function handleRename(id: string) {
    const name = editingName.trim();
    if (!name) return;
    run(
      () => updateLeadSourceAction(id, { name }),
      () => setEditingId(null),
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage lead sources</DialogTitle>
          <DialogDescription>
            Sources appear in the dropdown when adding or editing a lead.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-input">
            {sources.length === 0 && (
              <p className="px-3 py-3 text-sm text-muted-foreground">
                No sources yet.
              </p>
            )}
            {sources.map((source) => {
              const isEditing = editingId === source.id;
              const isConfirming = confirmDeleteId === source.id;
              return (
                <div
                  key={source.id}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  {isEditing ? (
                    <>
                      <Input
                        autoFocus
                        value={editingName}
                        disabled={isPending}
                        onChange={(event) => setEditingName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleRename(source.id);
                          if (event.key === "Escape") setEditingId(null);
                        }}
                        className="h-8 flex-1"
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => handleRename(source.id)}
                        aria-label="Save"
                      >
                        <Check />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel"
                      >
                        <X />
                      </Button>
                    </>
                  ) : isConfirming ? (
                    <>
                      <span className="flex-1 truncate text-sm text-foreground">
                        Delete &ldquo;{source.name}&rdquo;?
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() =>
                          run(
                            () => deleteLeadSourceAction(source.id),
                            () => setConfirmDeleteId(null),
                          )
                        }
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 truncate text-sm text-foreground">
                        {source.name}
                      </span>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => {
                          setEditingId(source.id);
                          setEditingName(source.name);
                        }}
                        aria-label={`Edit ${source.name}`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={isPending}
                        onClick={() => setConfirmDeleteId(source.id)}
                        aria-label={`Delete ${source.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={newName}
              disabled={isPending}
              placeholder="New source name"
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleCreate();
              }}
            />
            <Button
              disabled={isPending || newName.trim().length === 0}
              onClick={handleCreate}
            >
              <Plus />
              Create source
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
