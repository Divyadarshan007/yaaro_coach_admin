"use client";

import { ClipboardList, Folder, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { replaceClientProgramAction } from "@/features/program-editor/actions";
import type { Program } from "@/features/program-editor/types/program-editor";

export function ReplaceProgramDialog({
  clientId,
  currentProgramName,
  programs,
  open,
  onOpenChange,
}: {
  clientId: string;
  currentProgramName: string;
  programs: Program[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) return programs;
    return programs.filter((program) => program.title.toLowerCase().includes(query));
  }, [programs, search]);

  const selectedProgram = programs.find((program) => program.id === selectedProgramId) ?? null;

  function reset() {
    setSearch("");
    setSelectedProgramId(null);
  }

  function handleReplace() {
    if (!selectedProgramId) return;
    startTransition(async () => {
      await replaceClientProgramAction(clientId, selectedProgramId);
      reset();
      onOpenChange(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Replace &quot;{currentProgramName}&quot; with...</DialogTitle>
        </DialogHeader>

        <DialogBody className="gap-0 p-0">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search programs"
                className="h-9 pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto p-4">
              <div className="flex items-center gap-2 pb-1 text-sm font-medium text-foreground">
                <Folder className="size-4 text-muted-foreground" />
                My Programs
              </div>
              {filtered.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No programs found.</p>
              )}
              {filtered.map((program) => (
                <label
                  key={program.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
                >
                  <input
                    type="radio"
                    name="replace-program"
                    checked={selectedProgramId === program.id}
                    onChange={() => setSelectedProgramId(program.id)}
                    className="mt-1 size-4 shrink-0 accent-primary"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-foreground">{program.title}</span>
                    <div className="flex flex-wrap gap-1">
                      {program.routines.map((routine) => (
                        <span
                          key={routine.id}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {routine.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
              <ClipboardList className="size-8 text-muted-foreground" />
              {selectedProgram ? (
                <>
                  <p className="text-sm font-medium text-foreground">{selectedProgram.title}</p>
                  <p className="text-sm text-muted-foreground">{selectedProgram.routines.length} routines</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select a Program</p>
              )}
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex-row justify-between">
          <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/program-library" />}>
            Create New Program
          </Button>
          <Button size="lg" disabled={!selectedProgramId || isPending} onClick={handleReplace}>
            {isPending ? "Replacing..." : "Copy Program to Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
