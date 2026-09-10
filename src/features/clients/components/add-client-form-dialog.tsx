"use client";

import { Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

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
import { createClientAction } from "@/features/clients/actions";
import { getLeadSourcesAction } from "@/features/leads/actions";
import { cn } from "@/lib/utils";
import type { LeadSource } from "@/features/leads/types/lead";

const NO_SOURCE = "__none__";
const GENDER_OPTIONS = ["Male", "Female", "Other"];

// Uncontrolled by default (self-triggered), same contract as the old AddClientDialog —
// pass open/onOpenChange to drive it externally with a custom-styled trigger instead
// (see dashboard/components/add-client-button.tsx).
type AddClientFormDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddClientFormDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddClientFormDialogProps = {}) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    getLeadSourcesAction()
      .then(setSources)
      .catch(() => setSources([]));
  }, []);

  function reset() {
    setName("");
    setPhone("");
    setGender("");
    setSourceId("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (isSaving) return;
    if (isControlled) controlledOnOpenChange?.(next);
    else setUncontrolledOpen(next);
    if (!next) reset();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startSave(async () => {
      try {
        await createClientAction({
          name: name.trim(),
          phone: phone.trim() || undefined,
          gender: gender || undefined,
          sourceId: sourceId || undefined,
        });
        handleOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add client");
      }
    });
  }

  const canSubmit = name.trim().length > 0 && !isSaving;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger render={<Button size="lg" />}>
          <Plus />
          Add Client
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a client</DialogTitle>
          <DialogDescription>
            Add a client directly — they don&apos;t need a Yaaro account yet. They can link one later
            from their row in the clients list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="client-name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="client-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                autoFocus
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="client-phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                id="client-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Source</span>
              <Select<string>
                value={sourceId || NO_SOURCE}
                onValueChange={(value) => setSourceId(!value || value === NO_SOURCE ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {(value: string) =>
                      value === NO_SOURCE ? "No source" : (sources.find((s) => s.id === value)?.name ?? "No source")
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_SOURCE}>No source</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Gender</span>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((option) => {
                  const active = gender === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setGender(active ? "" : option)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted"
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>

          <DialogFooter className="flex-row justify-end">
            <Button type="button" variant="outline" size="lg" onClick={() => handleOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={!canSubmit}>
              {isSaving ? "Adding…" : "Add client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
