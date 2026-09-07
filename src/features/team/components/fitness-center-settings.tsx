"use client";

import { Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { updateTeamAction, uploadTeamLogoAction } from "@/features/team/actions";
import { AddTimeSlotDialog } from "@/features/team/components/add-time-slot-dialog";
import { DAYS_OF_WEEK, DAY_LABELS, type Team, type TimeSlot } from "@/features/team/types/team";

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

export function FitnessCenterSettings({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [address, setAddress] = useState(team.address);
  const [contactNumber, setContactNumber] = useState(team.contactNumber);
  const [logoUrl, setLogoUrl] = useState(team.logo);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>(sortSlots(team.timeSlots));
  const [error, setError] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [slotPending, startSlotTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwner = team.myRole === "owner";
  const teamAvatar = avatarFromName(team.name, team.id);
  const isDirty =
    name.trim() !== team.name ||
    address.trim() !== team.address ||
    contactNumber.trim() !== team.contactNumber ||
    logoFile !== null;
  const canSave =
    isOwner && name.trim().length > 0 && contactNumber.trim().length > 0 && isDirty;

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
        const patch: {
          name?: string;
          logo?: string;
          address?: string;
          contactNumber?: string;
        } = {};
        if (name.trim() !== team.name) patch.name = name.trim();
        if (address.trim() !== team.address) patch.address = address.trim();
        if (contactNumber.trim() !== team.contactNumber) patch.contactNumber = contactNumber.trim();
        if (logoFile) {
          const formData = new FormData();
          formData.append("logo", logoFile);
          patch.logo = await uploadTeamLogoAction(formData);
        }
        await updateTeamAction(patch);
        setLogoFile(null);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update fitness center");
      }
    });
  }

  // Time slots persist immediately (own Save button in the dialog / delete icon),
  // independent of the name/photo/contact Save button. The array is replaced whole.
  function persistSlots(next: TimeSlot[]) {
    return updateTeamAction({
      timeSlots: next.map((s) => ({ day: s.day, startTime: s.startTime, endTime: s.endTime })),
    }).then((updated) => {
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
      } catch (err) {
        setSlotError(err instanceof Error ? err.message : "Failed to remove time slot");
      }
    });
  }

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Fitness center photo</label>
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
          Fitness center name
        </label>
        {isOwner ? (
          <Input id="team-name" value={name} onChange={(event) => setName(event.target.value)} />
        ) : (
          <p className="text-sm text-muted-foreground">{team.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-address" className="text-sm font-medium text-foreground">
          Address <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        {isOwner ? (
          <Input
            id="team-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Street, area, city"
          />
        ) : (
          <p className="text-sm text-muted-foreground">{team.address || "—"}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-number" className="text-sm font-medium text-foreground">
          Contact number
        </label>
        {isOwner ? (
          <Input
            id="team-number"
            type="tel"
            inputMode="tel"
            value={contactNumber}
            onChange={(event) => setContactNumber(event.target.value)}
            placeholder="Phone number"
          />
        ) : (
          <p className="text-sm text-muted-foreground">{team.contactNumber || "—"}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Time slots</span>
          {isOwner && <AddTimeSlotDialog onAdd={handleAddSlot} />}
        </div>
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No time slots added yet.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {slots.map((slot, index) => (
              <li
                key={slot.id ?? `${slot.day}-${slot.startTime}-${index}`}
                className="flex items-center justify-between rounded-lg border border-input px-3 py-2 text-sm"
              >
                <span className="text-foreground">
                  <span className="font-medium">{DAY_LABELS[slot.day]}</span>
                  <span className="text-muted-foreground">
                    {" · "}
                    {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                  </span>
                </span>
                {isOwner && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={slotPending}
                    onClick={() => handleDeleteSlot(index)}
                    aria-label={`Remove ${DAY_LABELS[slot.day]} ${formatTime12(slot.startTime)}–${formatTime12(slot.endTime)} slot`}
                  >
                    <Trash2 />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
        {slotError && <p className="text-sm text-destructive">{slotError}</p>}
      </div>

      {!isOwner && (
        <p className="text-sm text-muted-foreground">Only the team owner can change these settings.</p>
      )}

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
