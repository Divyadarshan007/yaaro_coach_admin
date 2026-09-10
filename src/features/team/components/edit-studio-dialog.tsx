"use client";

import { Pencil } from "lucide-react";
import { useRef, useState, useTransition } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { avatarFromName } from "@/features/clients/lib/avatar";
import {
  updateTeamAction,
  uploadTeamLogoAction,
} from "@/features/team/actions";
import type { Team } from "@/features/team/types/team";

type EditStudioDialogProps = {
  team: Team;
  onSaved: (team: Team) => void;
};

export function EditStudioDialog({ team, onSaved }: EditStudioDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(team.name);
  const [address, setAddress] = useState(team.address);
  const [contactNumber, setContactNumber] = useState(team.contactNumber);
  const [logoUrl, setLogoUrl] = useState(team.logo);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const teamAvatar = avatarFromName(name || team.name, team.id);
  const isDirty =
    name.trim() !== team.name ||
    address.trim() !== team.address ||
    contactNumber.trim() !== team.contactNumber ||
    logoFile !== null;
  const canSave =
    name.trim().length > 0 && contactNumber.trim().length > 0 && isDirty;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setName(team.name);
      setAddress(team.address);
      setContactNumber(team.contactNumber);
      setLogoUrl(team.logo);
      setLogoFile(null);
      setError(null);
    }
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoUrl(URL.createObjectURL(file));
  }

  function handleSave() {
    setError(null);
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
        if (contactNumber.trim() !== team.contactNumber)
          patch.contactNumber = contactNumber.trim();
        if (logoFile) {
          const formData = new FormData();
          formData.append("logo", logoFile);
          patch.logo = await uploadTeamLogoAction(formData);
        }
        const updated = await updateTeamAction(patch);
        onSaved(updated);
        setOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update studio",
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        <Pencil />
        Edit
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit studio</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Studio photo
            </span>
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                {logoUrl && <AvatarImage src={logoUrl} alt={name} />}
                <AvatarFallback className={teamAvatar.colorClassName}>
                  {teamAvatar.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  SVG, PNG, JPG or GIF (max. 1000x1000px)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-studio-name"
              className="text-sm font-medium text-foreground"
            >
              Studio name
            </label>
            <Input
              id="edit-studio-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-studio-address"
              className="text-sm font-medium text-foreground"
            >
              Address{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <Input
              id="edit-studio-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Street, area, city"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-studio-number"
              className="text-sm font-medium text-foreground"
            >
              Contact number
            </label>
            <Input
              id="edit-studio-number"
              type="tel"
              inputMode="tel"
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
              placeholder="Phone number"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <DialogClose
            render={<Button type="button" variant="outline" size="lg" />}
          >
            Cancel
          </DialogClose>
          <Button
            size="lg"
            disabled={!canSave || isPending}
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
