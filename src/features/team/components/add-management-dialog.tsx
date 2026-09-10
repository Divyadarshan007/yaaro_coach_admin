"use client";

import { Plus } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addStudioMemberAction } from "@/features/team/actions";
import { TEAM_MEMBER_ROLE_OPTIONS, type TeamMemberRole } from "@/features/team/types/team";

const labelClassName = "text-sm font-medium text-foreground";

export function AddManagementDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<TeamMemberRole>("coach");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  function reset() {
    setName("");
    setRole("coach");
    setPhone("");
    setEmail("");
    setPassword("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (isSaving) return;
    setOpen(next);
    if (!next) reset();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startSave(async () => {
      try {
        await addStudioMemberAction({
          email: email.trim().toLowerCase(),
          role,
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          password: password.trim() ? password : undefined,
        });
        setOpen(false);
        reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add member");
      }
    });
  }

  const canSubmit = email.trim().length > 0 && !isSaving;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" variant="outline" />}>
        <Plus />
        Add Management
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a team member</DialogTitle>
          <DialogDescription>
            The person must already have a Yaaro account. Enter their account email and pick a role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-name" className={labelClassName}>
                Name
              </label>
              <Input
                id="member-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClassName}>Role</span>
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
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-phone" className={labelClassName}>
                Phone
              </label>
              <Input
                id="member-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-email" className={labelClassName}>
                Email
              </label>
              <Input
                id="member-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="account@email.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-password" className={labelClassName}>
                Password <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="member-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Set a coach panel login password"
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>

          <DialogFooter className="flex-row justify-end">
            <Button type="button" variant="outline" size="lg" onClick={() => handleOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={!canSubmit}>
              {isSaving ? "Adding…" : "Add member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
