"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { assignProgramToClientsAction } from "@/features/program-editor/actions";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { ClientSummary } from "@/features/clients/types/client";

export function AssignProgramDialog({
  programId,
  clients,
  open,
  onOpenChange,
}: {
  programId: string;
  clients: ClientSummary[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(new Set());
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) return clients;
    return clients.filter((client) => client.name.toLowerCase().includes(query));
  }, [clients, search]);

  function reset() {
    setSearch("");
    setSelectedClientIds(new Set());
    setScheduleEnabled(false);
    setStartDate("");
  }

  function toggleClient(clientId: string) {
    setSelectedClientIds((previous) => {
      const next = new Set(previous);
      if (next.has(clientId)) next.delete(clientId);
      else next.add(clientId);
      return next;
    });
  }

  async function handleCopy() {
    setIsSubmitting(true);
    try {
      await assignProgramToClientsAction(
        programId,
        Array.from(selectedClientIds),
        scheduleEnabled ? startDate : null
      );
      reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit = selectedClientIds.size > 0 && (!scheduleEnabled || startDate.length > 0) && !isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Copy Workout Program to Clients</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Client"
              className="h-9 pl-9"
            />
          </div>

          <div className="flex flex-col gap-2">
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No clients found.</p>
            )}
            {filtered.map((client) => (
              <label
                key={client.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  checked={selectedClientIds.has(client.id)}
                  onChange={() => toggleClient(client.id)}
                  className="size-4 shrink-0 accent-primary"
                />
                <PersonAvatar avatar={avatarFromName(client.name || client.email, client.id)} size="sm" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">{client.name}</span>
                  {client.currentProgram && (
                    <span className="truncate text-xs text-muted-foreground">{client.currentProgram.title}</span>
                  )}
                </div>
              </label>
            ))}
          </div>

          <label className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">Schedule</span>
            <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
          </label>

          {scheduleEnabled && (
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          )}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button size="lg" disabled={!canSubmit} onClick={handleCopy}>
            Copy Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
