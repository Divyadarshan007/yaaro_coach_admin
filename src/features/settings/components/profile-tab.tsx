"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { updateCoachProfileAction, uploadCoachAvatarAction } from "@/features/settings/actions";
import type { ProfileFormValues } from "@/features/settings/types/settings";
import type { CoachProfile, CoachProfileUpdate } from "@/lib/api/coach";

function splitName(name: string | undefined): { firstName: string; lastName: string } {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

function joinName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

function formValuesFromProfile(coachProfile: CoachProfile | null): ProfileFormValues {
  const { firstName, lastName } = splitName(coachProfile?.name);
  return {
    username: coachProfile?.username ?? "",
    firstName,
    lastName,
    email: coachProfile?.email ?? "",
    avatarUrl: coachProfile?.avatar ?? "",
  };
}

export function ProfileTab({ coachProfile }: { coachProfile: CoachProfile | null }) {
  const [initialValues, setInitialValues] = useState(() => formValuesFromProfile(coachProfile));
  const [values, setValues] = useState(initialValues);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty =
    values.username !== initialValues.username ||
    values.firstName !== initialValues.firstName ||
    values.lastName !== initialValues.lastName ||
    avatarFile !== null;

  const avatar = avatarFromName(joinName(values.firstName, values.lastName) || values.email || "Coach", coachProfile?.id ?? "coach");

  function updateField<K extends keyof ProfileFormValues>(field: K, value: ProfileFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    updateField("avatarUrl", URL.createObjectURL(file));
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      const patch: CoachProfileUpdate = {};
      if (values.username.trim() !== initialValues.username) patch.userName = values.username.trim();
      const fullName = joinName(values.firstName, values.lastName);
      if (fullName !== joinName(initialValues.firstName, initialValues.lastName)) patch.fullName = fullName;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        patch.profileImage = await uploadCoachAvatarAction(formData);
      }

      const updated = await updateCoachProfileAction(patch);
      const nextValues = formValuesFromProfile(updated);
      setInitialValues(nextValues);
      setValues(nextValues);
      setAvatarFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-lg font-medium text-foreground">Profile</h2>

        <div className="mt-4 divide-y divide-border rounded-xl ring-1 ring-foreground/10">
          <Field label="Username">
            <Input value={values.username} onChange={(event) => updateField("username", event.target.value)} />
          </Field>

          <Field label="Name">
            <div className="flex flex-col gap-2">
              <Input
                value={values.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                placeholder="First name"
              />
              <Input
                value={values.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                placeholder="Last name"
              />
            </div>
          </Field>

          <Field label="Email address">
            <Input type="email" value={values.email} disabled />
          </Field>

          <Field label="Your profile photo">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                {values.avatarUrl && <AvatarImage src={values.avatarUrl} alt={avatar.name} />}
                <AvatarFallback className={avatar.colorClassName}>{avatar.initials}</AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Change photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 1000x1000px)</p>
              </div>
            </div>
          </Field>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button type="button" onClick={handleSave} disabled={!isDirty || isSaving}>
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>

      <Separator />

      <AccountSection />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-[minmax(140px,200px)_1fr] sm:items-start">
      <p className="text-sm text-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function AccountSection() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    // No delete-account endpoint exists for coaches yet — log out as the closest available action.
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div>
      <h2 className="font-heading text-lg font-medium text-foreground">Account</h2>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
          Log out
        </Button>
      </div>

      <Dialog>
        <DialogTrigger
          render={<button type="button" className="mt-4 text-sm font-medium text-destructive hover:underline" />}
        >
          Delete Account
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently remove your coach account and log you out. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogBody />
          <DialogFooter className="flex-row justify-end">
            <Button type="button" variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Deleting…" : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
