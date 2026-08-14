"use client";

import { Check, Link2, Plus } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { inviteTeamMemberAction } from "@/features/team/actions";
import { PUBLIC_APP_URL } from "@/lib/api/config";
import type { InvitedTeamMember } from "@/features/team/types/team";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invitedMember, setInvitedMember] = useState<InvitedTeamMember | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isValidEmail = EMAIL_PATTERN.test(email.trim());

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setEmail("");
      setError(null);
      setInvitedMember(null);
      setCopied(false);
    }
  }

  function handleSendInvitation() {
    setError(null);
    startTransition(async () => {
      try {
        const member = await inviteTeamMemberAction(email.trim());
        setInvitedMember(member);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send invitation");
      }
    });
  }

  async function handleCopyLink() {
    if (!invitedMember) return;
    await navigator.clipboard.writeText(`${PUBLIC_APP_URL}/team/invites/${invitedMember.inviteToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus />
        Add Member
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{invitedMember ? "Invitation sent" : "Invite a team member"}</DialogTitle>
          {!invitedMember && (
            <DialogDescription>
              Invite a coach to join your team. They&apos;ll need to log in to their own coach account and open
              the link below to accept.
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogBody>
          {invitedMember ? (
            <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
              <span className="flex-1 truncate text-sm text-muted-foreground">
                {`${PUBLIC_APP_URL}/team/invites/${invitedMember.inviteToken}`}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
            </div>
          ) : (
            <>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="coach@example.com"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </>
          )}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          {invitedMember ? (
            <Button size="lg" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          ) : (
            <Button size="lg" disabled={!isValidEmail || isPending} onClick={handleSendInvitation}>
              {isPending ? "Sending..." : "Send Invitation"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
