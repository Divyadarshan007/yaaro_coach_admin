"use client";

import { HelpCircle, Mail } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { removeClientAction, updateClientNotesAction } from "@/features/clients/actions";
import type { ClientDetail } from "@/features/clients/types/client-detail";

function SettingsRow({
  label,
  labelExtra,
  children,
}: {
  label: string;
  labelExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-2 sm:items-center sm:gap-6">
      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {labelExtra}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function ClientSettingsTab({ client }: { client: ClientDetail }) {
  const [notes, setNotes] = useState(client.notes);
  const [savedNotes, setSavedNotes] = useState(client.notes);
  const [isSavingNotes, startSaveNotesTransition] = useTransition();
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isRemoving, startRemoveTransition] = useTransition();

  const coachedSinceLabel = new Date(client.coachedSince).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function handleNotesBlur() {
    if (notes === savedNotes) return;
    startSaveNotesTransition(async () => {
      await updateClientNotesAction(client.id, notes);
      setSavedNotes(notes);
    });
  }

  function handleRemove() {
    startRemoveTransition(async () => {
      await removeClientAction(client.id);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Profile</h2>

      <Card>
        <CardContent>
          <SettingsRow label="Client Email">
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={client.email} disabled className="h-9 pl-9" />
            </div>
          </SettingsRow>

          <SettingsRow label="Client Name">
            <Input value={client.name} disabled className="h-9" />
          </SettingsRow>

          <SettingsRow
            label="Notes"
            labelExtra={
              <Tooltip>
                <TooltipTrigger className="text-muted-foreground">
                  <HelpCircle className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Notes are only visible to you and your team.</TooltipContent>
              </Tooltip>
            }
          >
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Add notes about this client"
              className="min-h-20"
            />
            {isSavingNotes && <p className="mt-1 text-xs text-muted-foreground">Saving...</p>}
          </SettingsRow>

          <SettingsRow label="Status">
            <div className="flex items-center gap-1.5 text-sm text-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              Currently Coached
              <span className="text-muted-foreground">(Since {coachedSinceLabel})</span>
            </div>
          </SettingsRow>
        </CardContent>
      </Card>

      <div>
        <Button variant="destructive" size="lg" onClick={() => setIsRemoveOpen(true)}>
          Remove Client
        </Button>
      </div>

      <Dialog open={isRemoveOpen} onOpenChange={(next) => !isRemoving && setIsRemoveOpen(next)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove {client.name}?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This will remove {client.name} from your client list. Their workout history and
              account are not affected, and this action cannot be undone from here.
            </p>
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button variant="outline" size="lg" onClick={() => setIsRemoveOpen(false)} disabled={isRemoving}>
              Cancel
            </Button>
            <Button variant="destructive" size="lg" onClick={handleRemove} disabled={isRemoving}>
              {isRemoving ? "Removing..." : "Remove Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
