"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { reassignClientCoachAction } from "@/features/clients/actions";
import type { TeamMember } from "@/features/team/types/team";

const ROLE_LABEL: Record<TeamMember["role"], string> = {
  owner: "Owner",
  member: "Member",
};

export function ChangeCoachDialog({
  clientId,
  clientName,
  teamMembers,
  open,
  onOpenChange,
}: {
  clientId: string;
  clientName: string;
  teamMembers: TeamMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setSelectedCoachId(null);
  }

  function handleReassign() {
    if (!selectedCoachId) return;
    startTransition(async () => {
      await reassignClientCoachAction(clientId, selectedCoachId);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Coach for {clientName}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <p className="text-sm text-muted-foreground">
            Pick a teammate to take over this client. You&apos;ll no longer have access to them once reassigned.
          </p>

          <div className="flex flex-col gap-2">
            {teamMembers.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No other active teammates yet — invite one from the Team page first.
              </p>
            )}
            {teamMembers.map((member) => (
              <label
                key={member.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <input
                  type="radio"
                  name="change-coach"
                  checked={selectedCoachId === member.userId}
                  onChange={() => setSelectedCoachId(member.userId)}
                  className="size-4 shrink-0 accent-primary"
                />
                <PersonAvatar avatar={avatarFromName(member.name, member.id)} />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{member.name}</span>
                  <span className="text-xs text-muted-foreground">{ROLE_LABEL[member.role]}</span>
                </div>
              </label>
            ))}
          </div>
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button size="lg" disabled={!selectedCoachId || isPending} onClick={handleReassign}>
            {isPending ? "Reassigning..." : "Change Coach"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
