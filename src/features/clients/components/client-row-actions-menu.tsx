"use client";

import { MoreVertical, RefreshCw, UserCog, X } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ReplaceProgramDialog } from "@/features/clients/components/detail/replace-program-dialog";
import { removeClientAction } from "@/features/clients/actions";
import type { Client } from "@/features/clients/types/client";
import type { Program } from "@/features/program-editor/types/program-editor";

export function ClientRowActionsMenu({ client, libraryPrograms }: { client: Client; libraryPrograms: Program[] }) {
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isRemoving, startRemoveTransition] = useTransition();

  function handleRemove() {
    startRemoveTransition(async () => {
      await removeClientAction(client.id);
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Client actions" />}>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            <UserCog />
            Change Client&apos;s Coach
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsReplaceOpen(true)}>
            <RefreshCw />
            Replace Program
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setIsRemoveOpen(true)}>
            <X />
            Remove client
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReplaceProgramDialog
        clientId={client.id}
        currentProgramName={client.programName}
        programs={libraryPrograms}
        open={isReplaceOpen}
        onOpenChange={setIsReplaceOpen}
      />

      <Dialog open={isRemoveOpen} onOpenChange={(next) => !isRemoving && setIsRemoveOpen(next)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove {client.avatar.name}?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This will remove {client.avatar.name} from your client list. Their workout history and
              account are not affected, and this action cannot be undone from here.
            </p>
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button variant="outline" size="lg" onClick={() => setIsRemoveOpen(false)} disabled={isRemoving}>
              Cancel
            </Button>
            <Button variant="destructive" size="lg" onClick={handleRemove} disabled={isRemoving}>
              {isRemoving ? "Removing..." : "Remove client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
