"use client";

import { Check, Link2, Plus } from "lucide-react";
import { useState } from "react";

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

const INVITE_LINK = "https://coach.yaaro.fit/h1gyms/accept";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Uncontrolled by default (self-triggered via the "Add Client" button, as used in
// clients-toolbar.tsx). Pass open/onOpenChange to drive it externally instead — e.g.
// Grow's "Invite" action opens it prefilled with a lead's email, with no visible trigger.
type AddClientDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultEmail?: string;
};

export function AddClientDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultEmail = "",
}: AddClientDialogProps = {}) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const [email, setEmail] = useState(defaultEmail);
  const [copied, setCopied] = useState(false);

  // Reset the prefilled email whenever the dialog transitions to open, without a
  // setState-in-effect cascade — see https://react.dev/learn/you-might-not-need-an-effect.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setEmail(defaultEmail);
  }

  const isValidEmail = EMAIL_PATTERN.test(email.trim());

  function handleOpenChange(next: boolean) {
    if (isControlled) {
      controlledOnOpenChange?.(next);
    } else {
      setUncontrolledOpen(next);
    }
    if (!next) setCopied(false);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(INVITE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger render={<Button size="lg" />}>
          <Plus />
          Add Client
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite new clients</DialogTitle>
          <DialogDescription>
            Invite one or more clients. They will receive a link to accept your invitation and be
            guided to download the Yaaro app to be coached.{" "}
            <span className="cursor-pointer text-primary hover:underline">Learn More</span>
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
            <span className="flex-1 truncate text-sm text-muted-foreground">{INVITE_LINK}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          </div>

          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="client@example.com"
          />
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button size="lg" disabled={!isValidEmail} onClick={() => handleOpenChange(false)}>
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
