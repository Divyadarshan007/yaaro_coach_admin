"use client";

import { MoreVertical, RefreshCw, Trash2 } from "lucide-react";
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

export function ProgramActionsMenu({
  client,
  libraryPrograms,
  programName,
  hideReplace,
}: {
  client: ClientDetail;
  libraryPrograms: Program[];
  programName: string;
  // Set when the caller already renders its own direct "Replace Program" button
  // (see WorkoutProgramCard) — keeps this menu to just Remove instead of offering
  // the same replace action two ways.
  hideReplace?: boolean;
}) {
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [isRemoving, startRemoveTransition] = useTransition();

  function handleRemove() {
    startRemoveTransition(async () => {
      await removeClientProgramAction(client.id);
      setIsRemoveOpen(false);
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
        onOpenChange={(next) => !isRemoving && setIsRemoveOpen(next)}
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
