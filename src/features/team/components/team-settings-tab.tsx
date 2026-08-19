"use client";

import { useRef, useState, useTransition } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { updateTeamAction, uploadTeamLogoAction } from "@/features/team/actions";
import type { Team } from "@/features/team/types/team";

export function TeamSettingsTab({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [logoUrl, setLogoUrl] = useState(team.logo);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwner = team.myRole === "owner";
  const teamAvatar = avatarFromName(team.name, team.id);
  const isDirty = name.trim() !== team.name || logoFile !== null;
  const canSave = isOwner && name.trim().length > 0 && isDirty;

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));
  }

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const patch: { name?: string; logo?: string } = {};
        if (name.trim() !== team.name) patch.name = name.trim();
        if (logoFile) {
          const formData = new FormData();
          formData.append("logo", logoFile);
          patch.logo = await uploadTeamLogoAction(formData);
        }
        await updateTeamAction(patch);
        setLogoFile(null);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update team");
      }
    });
  }

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Team photo</label>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {logoUrl && <AvatarImage src={logoUrl} alt={team.name} />}
            <AvatarFallback className={teamAvatar.colorClassName}>{teamAvatar.initials}</AvatarFallback>
          </Avatar>
          {isOwner && (
            <div>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Change photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={handleLogoChange}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 1000x1000px)</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-name" className="text-sm font-medium text-foreground">
          Team name
        </label>
        {isOwner ? (
          <Input id="team-name" value={name} onChange={(event) => setName(event.target.value)} />
        ) : (
          <p className="text-sm text-muted-foreground">{team.name}</p>
        )}
        {!isOwner && <p className="text-sm text-muted-foreground">Only the team owner can change these settings.</p>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && !error && <p className="text-sm text-emerald-600 dark:text-emerald-400">Saved.</p>}

      {isOwner && (
        <div>
          <Button onClick={handleSave} disabled={!canSave || isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
