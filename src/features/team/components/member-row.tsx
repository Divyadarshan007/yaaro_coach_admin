"use client";

import { Link2Off, MoreVertical, Pencil, QrCode, X } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { removeTeamMemberAction, unlinkTeamMemberAction } from "@/features/team/actions";
import { EditMemberDialog } from "@/features/team/components/edit-member-dialog";
import { LinkCoachQrDialog } from "@/features/team/components/link-coach-qr-dialog";
import { cn } from "@/lib/utils";
import { TEAM_MEMBER_ROLE_LABEL, type Team, type TeamMember } from "@/features/team/types/team";
import { handleMutationError } from "@/lib/handle-mutation-error";

const STATUS_LABEL: Record<TeamMember["status"], string> = {
  active: "Active",
  pending: "Pending",
};

export function MemberRow({
  member,
  allMembers,
  myRole,
  studioName,
}: {
  member: TeamMember;
  allMembers: TeamMember[];
  myRole: Team["myRole"];
  studioName: string;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isRemoving, startRemoveTransition] = useTransition();
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [replacementRequiredMessage, setReplacementRequiredMessage] = useState<string | null>(null);
  const [selectedReplacementId, setSelectedReplacementId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isUnlinkOpen, setIsUnlinkOpen] = useState(false);
  const [isUnlinking, startUnlinkTransition] = useTransition();
  const [unlinkError, setUnlinkError] = useState<string | null>(null);

  // Only the studio owner can manage rows — including editing/unlinking their own row
  // (the backend allows both; role just can't be changed away from "owner", which the
  // edit dialog itself never offers). Removing a row is different: a studio always
  // needs exactly one owner, so that action stays excluded for the owner's own row.
  const canManageMember = myRole === "owner";
  const canRemoveMember = canManageMember && member.role !== "owner";

  // Other active, linked members this member's clients could be handed off to — only
  // someone with a userId can be assigned as a client's coachId (see reassignCoach).
  const replacementCandidates = allMembers.filter(
    (candidate) => candidate.status === "active" && candidate.userId && candidate.userId !== member.userId
  );

  function resetRemoveState() {
    setReplacementRequiredMessage(null);
    setSelectedReplacementId(null);
    setRemoveError(null);
  }

  function handleRemove() {
    setRemoveError(null);
    startRemoveTransition(async () => {
      try {
        const result = await removeTeamMemberAction(
          member.id,
          replacementRequiredMessage ? (selectedReplacementId ?? undefined) : undefined
        );
        if (result.ok) {
          setIsRemoveOpen(false);
          resetRemoveState();
          return;
        }
        setReplacementRequiredMessage(result.message);
      } catch (err) {
        handleMutationError(err, setRemoveError);
      }
    });
  }

  function handleUnlink() {
    setUnlinkError(null);
    startUnlinkTransition(async () => {
      try {
        await unlinkTeamMemberAction(member.id);
        setIsUnlinkOpen(false);
      } catch (err) {
        handleMutationError(err, setUnlinkError);
      }
    });
  }

  return (
    <TableRow>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <PersonAvatar avatar={avatarFromName(member.name, member.id)} imageUrl={member.avatar} />
          <span className="max-w-48 truncate text-sm font-medium text-foreground">
            {member.name}
            {member.isMe && <span className="text-muted-foreground"> (You)</span>}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-sm text-foreground">{TEAM_MEMBER_ROLE_LABEL[member.role]}</TableCell>

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
        {member.userId ? (
          <Badge
            variant="secondary"
            className="h-auto whitespace-normal rounded-md bg-blue-500/10 px-3 py-1.5 text-center leading-tight text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
          >
            Linked
          </Badge>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsLinkOpen(true)}>
              <QrCode />
              Link now
            </Button>
            <LinkCoachQrDialog
              memberName={member.name}
              joinTeamQrValue={member.joinTeamQrValue}
              studioName={studioName}
              open={isLinkOpen}
              onOpenChange={setIsLinkOpen}
            />
          </>
        )}
      </TableCell>

      <TableCell className="px-4 py-3">
        {canManageMember && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Member actions" />}>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Pencil />
                  Edit member
                </DropdownMenuItem>
                {member.userId && (
                  <DropdownMenuItem onClick={() => setIsUnlinkOpen(true)}>
                    <Link2Off />
                    Unlink member
                  </DropdownMenuItem>
                )}
                {canRemoveMember && (
                  <DropdownMenuItem variant="destructive" onClick={() => setIsRemoveOpen(true)}>
                    <X />
                    Remove member
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <EditMemberDialog member={member} open={isEditOpen} onOpenChange={setIsEditOpen} />

            <Dialog
              open={isUnlinkOpen}
              onOpenChange={(next) => {
                if (isUnlinking) return;
                setIsUnlinkOpen(next);
                if (!next) setUnlinkError(null);
              }}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Unlink {member.name}?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p className="text-sm text-muted-foreground">
                    This detaches {member.name}&apos;s Yaaro app account from this team
                    row. They&apos;ll stay on your team, but their photo will disappear
                    until they (or someone else) scan their &quot;Link now&quot; QR again.
                  </p>
                  {unlinkError && <p className="text-sm text-destructive">{unlinkError}</p>}
                </DialogBody>
                <DialogFooter className="flex-row justify-end">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsUnlinkOpen(false)}
                    disabled={isUnlinking}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleUnlink}
                    disabled={isUnlinking}
                  >
                    {isUnlinking ? "Unlinking..." : "Unlink member"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isRemoveOpen}
              onOpenChange={(next) => {
                if (isRemoving) return;
                setIsRemoveOpen(next);
                if (!next) resetRemoveState();
              }}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Are you sure you want to remove {member.name}?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  {replacementRequiredMessage ? (
                    <>
                      <p className="text-sm text-muted-foreground">{replacementRequiredMessage}</p>
                      {replacementCandidates.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                          No other active, linked teammates to reassign them to — link a teammate&apos;s
                          account first.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {replacementCandidates.map((candidate) => (
                            <label
                              key={candidate.id}
                              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
                            >
                              <input
                                type="radio"
                                name="replacement-coach"
                                checked={selectedReplacementId === candidate.userId}
                                onChange={() => setSelectedReplacementId(candidate.userId)}
                                className="size-4 shrink-0 accent-primary"
                              />
                              <PersonAvatar
                                avatar={avatarFromName(candidate.name, candidate.id)}
                                imageUrl={candidate.avatar}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground">{candidate.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {TEAM_MEMBER_ROLE_LABEL[candidate.role]}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This will remove {member.name} from your team. This action cannot be undone from here.
                    </p>
                  )}
                  {removeError && <p className="text-sm text-destructive">{removeError}</p>}
                </DialogBody>
                <DialogFooter className="flex-row justify-end">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setIsRemoveOpen(false);
                      resetRemoveState();
                    }}
                    disabled={isRemoving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleRemove}
                    disabled={
                      isRemoving ||
                      (replacementRequiredMessage
                        ? !selectedReplacementId || replacementCandidates.length === 0
                        : false)
                    }
                  >
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
