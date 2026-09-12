"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClubAction } from "@/features/clubs/actions";
import {
  ClubForm,
  emptyClubForm,
  formToInput,
  isClubFormValid,
} from "@/features/clubs/components/club-form";
import type { ClubFormValues } from "@/features/clubs/types/club";

export function CreateClubView() {
  const router = useRouter();
  const [values, setValues] = useState<ClubFormValues>(emptyClubForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(patch: Partial<ClubFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      try {
        const club = await createClubAction(formToInput(values));
        router.push(`/clubs/${club.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create club");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/clubs"
            aria-label="Back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Create a club</h1>
            <p className="text-sm text-muted-foreground">
              You&apos;ll be the owner. Members join from the yaaro app.
            </p>
          </div>
        </div>
      </div>

      <ClubForm values={values} onChange={handleChange} disabled={isPending} />
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-row justify-end gap-2">
        <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/clubs" />}>
          Cancel
        </Button>
        <Button size="lg" onClick={handleCreate} disabled={isPending || !isClubFormValid(values)}>
          {isPending ? "Creating..." : "Create club"}
        </Button>
      </div>
    </div>
  );
}
