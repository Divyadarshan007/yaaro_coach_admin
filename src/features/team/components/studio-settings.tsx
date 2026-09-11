"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrentSubscriptionCard } from "@/features/studio-subscription/components/current-subscription-card";
import type { StudioSubscriptionTransaction } from "@/features/studio-subscription/types/studio-subscription";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { updateTeamAction } from "@/features/team/actions";
import { AddTimeSlotDialog } from "@/features/team/components/add-time-slot-dialog";
import { EditStudioDialog } from "@/features/team/components/edit-studio-dialog";
import { EditTimeSlotDialog } from "@/features/team/components/edit-time-slot-dialog";
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type Team,
  type TimeSlot,
} from "@/features/team/types/team";

// "06:00" -> "6:00 AM", "22:00" -> "10:00 PM". Stored/sent as 24h "HH:mm".
function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function sortSlots(slots: TimeSlot[]): TimeSlot[] {
  return [...slots].sort(
    (a, b) =>
      DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day) ||
      a.startTime.localeCompare(b.startTime),
  );
}

type SlotEntry = { slot: TimeSlot; index: number };
type SlotDayGroup = { day: TimeSlot["day"]; entries: SlotEntry[] };

// Groups consecutive same-day entries so a day with a break (e.g. 5 AM–12 PM,
// then 5 PM–10 PM) renders as one "Monday" card with two shifts, not two
// unrelated-looking cards. Assumes `slots` is already day-sorted (sortSlots).
function groupSlotsByDay(slots: TimeSlot[]): SlotDayGroup[] {
  const groups: SlotDayGroup[] = [];
  slots.forEach((slot, index) => {
    const last = groups[groups.length - 1];
    if (last && last.day === slot.day) {
      last.entries.push({ slot, index });
    } else {
      groups.push({ day: slot.day, entries: [{ slot, index }] });
    }
  });
  return groups;
}

export function StudioSettings({
  team: initialTeam,
  subscription,
}: {
  team: Team;
  subscription: StudioSubscriptionTransaction | null;
}) {
  const [team, setTeam] = useState(initialTeam);
  const [slots, setSlots] = useState<TimeSlot[]>(
    sortSlots(initialTeam.timeSlots),
  );
  const [slotError, setSlotError] = useState<string | null>(null);
  const [slotPending, startSlotTransition] = useTransition();
  const [deleteSlotIndex, setDeleteSlotIndex] = useState<number | null>(null);
  const [editSlotIndex, setEditSlotIndex] = useState<number | null>(null);

  const isOwner = team.myRole === "owner";
  const teamAvatar = avatarFromName(team.name, team.id);

  function handleStudioSaved(updated: Team) {
    setTeam(updated);
    setSlots(sortSlots(updated.timeSlots));
  }

  // Time slots persist immediately (own Save button in the dialog / delete icon).
  // The array is replaced whole.
  function persistSlots(next: TimeSlot[]) {
    return updateTeamAction({
      timeSlots: next.map((s) => ({
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    }).then((updated) => {
      setTeam(updated);
      setSlots(sortSlots(updated.timeSlots));
    });
  }

  async function handleAddSlot(slot: TimeSlot) {
    setSlotError(null);
    await persistSlots([...slots, slot]);
  }

  function handleDeleteSlot(index: number) {
    setSlotError(null);
    startSlotTransition(async () => {
      try {
        await persistSlots(slots.filter((_, i) => i !== index));
        setDeleteSlotIndex(null);
      } catch (err) {
        setSlotError(
          err instanceof Error ? err.message : "Failed to remove time slot",
        );
      }
    });
  }

  async function handleEditSlot(index: number, updatedSlot: TimeSlot) {
    setSlotError(null);
    await persistSlots(slots.map((s, i) => (i === index ? updatedSlot : s)));
  }

  const slotToDelete =
    deleteSlotIndex !== null ? (slots[deleteSlotIndex] ?? null) : null;
  const slotToEdit = editSlotIndex !== null ? (slots[editSlotIndex] ?? null) : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Studio identity */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {team.logo && <AvatarImage src={team.logo} alt={team.name} />}
            <AvatarFallback className={teamAvatar.colorClassName}>
              {teamAvatar.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="font-heading text-lg font-medium text-foreground">
              {team.name}
            </p>
            {team.address && (
              <p className="text-sm text-muted-foreground">{team.address}</p>
            )}
            {team.contactNumber && (
              <p className="text-sm text-muted-foreground">
                {team.contactNumber}
              </p>
            )}
          </div>
        </div>
        {isOwner && (
          <EditStudioDialog team={team} onSaved={handleStudioSaved} />
        )}
      </div>

      {/* Current plan */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-foreground">Current plan</h2>
        <CurrentSubscriptionCard subscription={subscription} />
      </div>

      {/* Time slots */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Time slots</h2>
          {isOwner && <AddTimeSlotDialog onAdd={handleAddSlot} />}
        </div>
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No time slots added yet.
          </p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {groupSlotsByDay(slots).map((group) => {
              const actions = (slot: TimeSlot, index: number) =>
                isOwner && (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={slotPending}
                      onClick={() => setEditSlotIndex(index)}
                      aria-label={`Edit ${DAY_LABELS[slot.day]} ${formatTime12(slot.startTime)}–${formatTime12(slot.endTime)} slot`}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={slotPending}
                      onClick={() => setDeleteSlotIndex(index)}
                      aria-label={`Remove ${DAY_LABELS[slot.day]} ${formatTime12(slot.startTime)}–${formatTime12(slot.endTime)} slot`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                );

              if (group.entries.length === 1) {
                const { slot, index } = group.entries[0];
                return (
                  <div
                    key={group.day}
                    className="flex items-center justify-between rounded-lg border border-input px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">
                      <span className="font-medium">{DAY_LABELS[slot.day]}</span>
                      <span className="text-muted-foreground">
                        {" · "}
                        {formatTime12(slot.startTime)} –{" "}
                        {formatTime12(slot.endTime)}
                      </span>
                    </span>
                    {actions(slot, index)}
                  </div>
                );
              }

              return (
                <div
                  key={group.day}
                  className="rounded-lg border border-input"
                >
                  <p className="px-3 pt-2 text-sm font-medium text-foreground">
                    {DAY_LABELS[group.day]}
                  </p>
                  <ul className="flex flex-col">
                    {group.entries.map(({ slot, index }) => (
                      <li
                        key={slot.id ?? `${slot.day}-${slot.startTime}-${index}`}
                        className="flex items-center justify-between px-3 py-1.5 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {formatTime12(slot.startTime)} –{" "}
                          {formatTime12(slot.endTime)}
                        </span>
                        {actions(slot, index)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        {slotError && <p className="text-sm text-destructive">{slotError}</p>}
      </div>

      <Dialog
        open={deleteSlotIndex !== null}
        onOpenChange={(next) => !slotPending && !next && setDeleteSlotIndex(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {slotToDelete
                ? `Remove ${DAY_LABELS[slotToDelete.day]} ${formatTime12(slotToDelete.startTime)}–${formatTime12(slotToDelete.endTime)} slot?`
                : "Remove time slot?"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This will remove this time slot. This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDeleteSlotIndex(null)}
              disabled={slotPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={() =>
                deleteSlotIndex !== null && handleDeleteSlot(deleteSlotIndex)
              }
              disabled={slotPending}
            >
              {slotPending ? "Removing..." : "Remove slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditTimeSlotDialog
        slot={slotToEdit}
        open={editSlotIndex !== null}
        onOpenChange={(next) => !next && setEditSlotIndex(null)}
        onSave={(updatedSlot) =>
          editSlotIndex !== null
            ? handleEditSlot(editSlotIndex, updatedSlot)
            : Promise.resolve()
        }
      />

      {!isOwner && (
        <p className="text-sm text-muted-foreground">
          Only the studio owner can change these settings.
        </p>
      )}
    </div>
  );
}
