"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTeamAction } from "@/features/team/actions";
import type { Team } from "@/features/team/types/team";

export function TeamSettingsTab({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOwner = team.myRole === "owner";
  const canSave = isOwner && name.trim().length > 0 && name.trim() !== team.name;

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateTeamAction(name.trim());
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update team");
      }
    });
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
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
