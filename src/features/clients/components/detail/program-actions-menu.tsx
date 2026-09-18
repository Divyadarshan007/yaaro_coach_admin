"use client";

import { MoreVertical, Pencil, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { ReplaceProgramDialog } from "@/features/clients/components/detail/replace-program-dialog";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import { removeClientProgramAction } from "@/features/program-editor/actions";
import type { Program } from "@/features/program-editor/types/program-editor";
import { handleMutationError } from "@/lib/handle-mutation-error";

export function ProgramActionsMenu({
  client,
  libraryPrograms,
  programName,
  hideReplace,
  hideEdit,
}: {
  client: ClientDetail;
  libraryPrograms: Program[];
  programName: string;
  // Set when the caller already renders its own direct "Replace Program" button
  // (see WorkoutProgramCard) — keeps this menu to just Remove instead of offering
  // the same replace action two ways.
  hideReplace?: boolean;
  // Same idea for a caller that already renders its own "Edit program" link
  // (see WorkoutProgramCard).
  hideEdit?: boolean;
}) {
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [isRemoving, startRemoveTransition] = useTransition();
  const [removeError, setRemoveError] = useState<string | null>(null);

  function handleRemove() {
    setRemoveError(null);
    startRemoveTransition(async () => {
      try {
        await removeClientProgramAction(client.id);
        setIsRemoveOpen(false);
      } catch (err) {
        handleMutationError(err, setRemoveError);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Workout program options"
            />
          }
        >
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!hideEdit && (
            <DropdownMenuItem render={<Link href={`/clients/${client.id}/program`} />}>
              <Pencil />
              Edit Program
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsRemoveOpen(true)}
          >
            <Trash2 />
            Remove Program
          </DropdownMenuItem>
          {!hideReplace && (
            <DropdownMenuItem onClick={() => setIsReplaceOpen(true)}>
              <RefreshCw />
              Replace Program
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isRemoveOpen}
        onOpenChange={(next) => {
          if (isRemoving) return;
          setIsRemoveOpen(next);
          if (!next) setRemoveError(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Program?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This will remove &quot;{programName}&quot; from {client.name}.
              This action cannot be undone.
            </p>
            {removeError && <p className="text-sm text-destructive">{removeError}</p>}
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsRemoveOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "Remove Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!hideReplace && (
        <ReplaceProgramDialog
          clientId={client.id}
          currentProgramName={programName}
          programs={libraryPrograms}
          open={isReplaceOpen}
          onOpenChange={setIsReplaceOpen}
        />
      )}
    </>
  );
}
