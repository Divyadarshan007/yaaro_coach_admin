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
import { Separator } from "@/components/ui/separator";
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

    const trimmedEmail = email.trim();
    if (Boolean(trimmedEmail) !== Boolean(password)) {
      setError("Enter both email and password to set up a login, or leave both blank");
      return;
    }

    startSave(async () => {
      try {
        await addStudioMemberAction({
          name: name.trim(),
          role,
          phone: phone.trim() || undefined,
          email: trimmedEmail || undefined,
          password: password || undefined,
        });
        setOpen(false);
        reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add member");
      }
    });
  }

  const canSubmit = name.trim().length > 0 && !isSaving;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus />
        Add Management
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a team member</DialogTitle>
          <DialogDescription>
            Add them by name and pick a role. They&apos;ll claim this row later by
            scanning its &quot;Link now&quot; QR from the Yaaro app.
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
                required
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
                Phone <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="member-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <div>
                <p className={labelClassName}>Login details (optional)</p>
                <p className="text-sm text-muted-foreground">
                  Let them log into yaaro coach directly with an email and password.
                </p>
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
                  placeholder="Email address"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="member-password" className={labelClassName}>
                  Password
                </label>
                <Input
                  id="member-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                />
              </div>
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
