"use client";

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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStudioMemberAction } from "@/features/team/actions";
import { TEAM_MEMBER_ROLE_OPTIONS, type TeamMember, type TeamMemberRole } from "@/features/team/types/team";
import { handleMutationError } from "@/lib/handle-mutation-error";

const labelClassName = "text-sm font-medium text-foreground";

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: {
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState<TeamMemberRole>(member.role);
  const [phone, setPhone] = useState(member.phone);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  // A studio always has exactly one owner — their role can't be reassigned here (the
  // backend rejects a role field on the owner's own row), so the Select below never
  // renders for them.
  const isOwner = member.role === "owner";

  function reset() {
    setName(member.name);
    setRole(member.role);
    setPhone(member.phone);
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (isSaving) return;
    onOpenChange(next);
    if (!next) reset();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startSave(async () => {
      try {
        await updateStudioMemberAction(member.id, {
          name: name.trim(),
          ...(isOwner ? {} : { role }),
          phone: phone.trim(),
        });
        onOpenChange(false);
      } catch (err) {
        handleMutationError(err, setError);
      }
    });
  }

  const isDirty =
    name.trim() !== member.name || (!isOwner && role !== member.role) || phone.trim() !== member.phone;
  const canSubmit = name.trim().length > 0 && isDirty && !isSaving;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {member.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogBody className="min-h-0 flex-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-member-name" className={labelClassName}>
                Name
              </label>
              <Input
                id="edit-member-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClassName}>Role</span>
              {isOwner ? (
                <Input value="Owner" disabled />
              ) : (
                <Select
                  items={TEAM_MEMBER_ROLE_OPTIONS}
                  value={role}
                  onValueChange={(value) => setRole(value as TeamMemberRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_MEMBER_ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-member-phone" className={labelClassName}>
                Phone <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="edit-member-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>

          <DialogFooter className="flex-row justify-end">
            <Button type="button" variant="outline" size="lg" onClick={() => handleOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={!canSubmit}>
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
