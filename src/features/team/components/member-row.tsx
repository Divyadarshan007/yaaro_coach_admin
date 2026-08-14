"use client";

import { MoreVertical, X } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { removeTeamMemberAction } from "@/features/team/actions";
import { cn } from "@/lib/utils";
import type { Team, TeamMember } from "@/features/team/types/team";

const ROLE_LABEL: Record<TeamMember["role"], string> = {
  owner: "Owner",
  member: "Member",
};

const STATUS_LABEL: Record<TeamMember["status"], string> = {
  active: "Active",
  pending: "Pending",
};

export function MemberRow({ member, myRole }: { member: TeamMember; myRole: Team["myRole"] }) {
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isRemoving, startRemoveTransition] = useTransition();

  const canRemove = myRole === "owner" && member.role !== "owner";

  function handleRemove() {
    startRemoveTransition(async () => {
      await removeTeamMemberAction(member.id);
      setIsRemoveOpen(false);
    });
  }

  return (
    <TableRow>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <PersonAvatar avatar={avatarFromName(member.name, member.id)} />
          <span className="max-w-48 truncate text-sm font-medium text-foreground">
            {member.name}
            {member.isMe && <span className="text-muted-foreground"> (You)</span>}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-sm text-foreground">{ROLE_LABEL[member.role]}</TableCell>

      <TableCell className="px-4 py-3 text-sm text-foreground">{member.clientCount}</TableCell>

      <TableCell className="px-4 py-3">
        <Badge
          variant="secondary"
          className={cn(
            "h-auto whitespace-normal rounded-md px-3 py-1.5 text-center leading-tight",
            member.status === "active" && "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
          )}
        >
          {STATUS_LABEL[member.status]}
        </Badge>
      </TableCell>

      <TableCell className="px-4 py-3">
        {canRemove && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Member actions" />}>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" onClick={() => setIsRemoveOpen(true)}>
                  <X />
                  Remove member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isRemoveOpen} onOpenChange={(next) => !isRemoving && setIsRemoveOpen(next)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Remove {member.name}?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p className="text-sm text-muted-foreground">
                    This will remove {member.name} from your team. This action cannot be undone from here.
                  </p>
                </DialogBody>
                <DialogFooter className="flex-row justify-end">
                  <Button variant="outline" size="lg" onClick={() => setIsRemoveOpen(false)} disabled={isRemoving}>
                    Cancel
                  </Button>
                  <Button variant="destructive" size="lg" onClick={handleRemove} disabled={isRemoving}>
                    {isRemoving ? "Removing..." : "Remove member"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
