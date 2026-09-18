"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateClientProfileAction } from "@/features/clients/actions";
import type { Client } from "@/features/clients/types/client";
import { getLeadSourcesAction } from "@/features/leads/actions";
import type { LeadSource } from "@/features/leads/types/lead";
import { GENDER_OPTIONS } from "@/lib/gender";
import { handleMutationError } from "@/lib/handle-mutation-error";
import { cn } from "@/lib/utils";

const NO_SOURCE = "__none__";

export function EditClientDialog({
  client,
  open,
  onOpenChange,
}: {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);
  const [gender, setGender] = useState(client.gender);
  const [sourceId, setSourceId] = useState(client.source?.id ?? "");
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  // Loaded lazily the first time the dialog opens, same as AddClientFormDialog.
  const sourcesLoadedRef = useRef(false);
  useEffect(() => {
    if (!open || sourcesLoadedRef.current) return;
    sourcesLoadedRef.current = true;
    getLeadSourcesAction()
      .then(setSources)
      .catch(() => setSources([]));
  }, [open]);

  function reset() {
    setName(client.name);
    setPhone(client.phone);
    setGender(client.gender);
    setSourceId(client.source?.id ?? "");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (isSaving) return;
    onOpenChange(next);
    if (!next) reset();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startSave(async () => {
      try {
        await updateClientProfileAction(client.id, {
          name: name.trim(),
          phone: phone.trim(),
          gender,
          sourceId: sourceId || null,
        });
        onOpenChange(false);
      } catch (err) {
        handleMutationError(err, setError);
      }
    });
  }

  const isDirty =
    name.trim() !== client.name ||
    phone.trim() !== client.phone ||
    gender !== client.gender ||
    sourceId !== (client.source?.id ?? "");
  const canSubmit = name.trim().length > 0 && isDirty && !isSaving;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {client.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogBody className="min-h-0 flex-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-client-name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="edit-client-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-client-phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                id="edit-client-phone"
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
                          : "border-input bg-background text-foreground hover:bg-muted",
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
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
