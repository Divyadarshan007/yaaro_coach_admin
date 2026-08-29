"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteClubAction,
  joinClubAction,
  leaveClubAction,
  updateClubAction,
} from "@/features/clubs/actions";
import {
  ClubForm,
  clubToForm,
  formToInput,
  isClubFormValid,
} from "@/features/clubs/components/club-form";
import {
  CLUB_PURPOSE_TAG_LABELS,
  CLUB_SPORT_TYPE_LABELS,
} from "@/features/clubs/types/club";
import type { Club, ClubFormValues, ClubPurposeTag, ClubSportType } from "@/features/clubs/types/club";

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function MemberView({ club }: { club: Club }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const locationText =
    club.locationType === "city"
      ? [club.location.city, club.location.state, club.location.country].filter(Boolean).join(", ")
      : "Global";

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ReadOnlyRow label="Activity" value={CLUB_SPORT_TYPE_LABELS[club.sportType as ClubSportType] ?? club.sportType} />
        <ReadOnlyRow label="Visibility" value={club.visibility === "private" ? "Private" : "Public"} />
        <ReadOnlyRow label="Location" value={locationText} />
        <ReadOnlyRow label="Members" value={String(club.memberCount)} />
      </div>
      {club.description && <ReadOnlyRow label="Description" value={club.description} />}
      {club.purposeTags.length > 0 && (
        <ReadOnlyRow
          label="Purpose"
          value={club.purposeTags
            .map((tag) => CLUB_PURPOSE_TAG_LABELS[tag as ClubPurposeTag] ?? tag)
            .join(", ")}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        {club.isMember ? (
          <Button variant="outline" disabled={isPending} onClick={() => run(() => leaveClubAction(club.id))}>
            {isPending ? "Leaving..." : "Leave club"}
          </Button>
        ) : club.membershipStatus === "pending" ? (
          <Button variant="outline" disabled>
            Request pending
          </Button>
        ) : (
          <Button disabled={isPending} onClick={() => run(() => joinClubAction(club.id))}>
            {isPending ? "Joining..." : club.visibility === "private" ? "Request to join" : "Join club"}
          </Button>
        )}
      </div>
    </div>
  );
}

function OwnerView({ club }: { club: Club }) {
  const router = useRouter();
  const initial = useMemo(() => clubToForm(club), [club]);
  const [values, setValues] = useState<ClubFormValues>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const isDirty = JSON.stringify(values) !== JSON.stringify(initial);

  function handleChange(patch: Partial<ClubFormValues>) {
    setSaved(false);
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleSave() {
    setError(null);
    setSaved(false);
    startSaving(async () => {
      try {
        await updateClubAction(club.id, formToInput(values));
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save changes");
      }
    });
  }

  function handleDelete() {
    startDeleting(async () => {
      try {
        await deleteClubAction(club.id);
        router.push("/clubs");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete club");
        setConfirmDelete(false);
      }
    });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <ClubForm values={values} onChange={handleChange} disabled={isSaving} />

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && !error && <p className="text-sm text-emerald-600 dark:text-emerald-400">Saved.</p>}

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button onClick={handleSave} disabled={!isDirty || isSaving || !isClubFormValid(values)}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
        <Button variant="destructive" onClick={() => setConfirmDelete(true)} disabled={isDeleting}>
          Delete club
        </Button>
      </div>

      <Dialog open={confirmDelete} onOpenChange={(next) => !isDeleting && setConfirmDelete(next)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {club.title}?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This removes the club for all {club.memberCount} member{club.memberCount === 1 ? "" : "s"}. This
              can&apos;t be undone.
            </p>
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete club"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ClubOverviewTab({ club }: { club: Club }) {
  return club.isOwner ? <OwnerView club={club} /> : <MemberView club={club} />;
}
