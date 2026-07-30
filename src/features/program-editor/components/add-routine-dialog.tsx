"use client";

import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";

export function AddRoutineDialog({
  programId,
  open,
  onOpenChange,
}: {
  programId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const programs = useMyProgramsStore((state) => state.programs);
  const addRoutine = useMyProgramsStore((state) => state.addRoutine);
  const addRoutineCopy = useMyProgramsStore((state) => state.addRoutineCopy);

  const [search, setSearch] = useState("");
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<Set<string>>(new Set());

  const importable = useMemo(() => {
    const query = search.trim().toLowerCase();
    return programs
      .flatMap((program) => program.routines.map((routine) => ({ program, routine })))
      .filter(({ program, routine }) => {
        if (query.length === 0) return true;
        return routine.name.toLowerCase().includes(query) || program.title.toLowerCase().includes(query);
      });
  }, [programs, search]);

  function reset() {
    setSearch("");
    setSelectedRoutineIds(new Set());
  }

  function toggleRoutine(routineId: string) {
    setSelectedRoutineIds((previous) => {
      const next = new Set(previous);
      if (next.has(routineId)) next.delete(routineId);
      else next.add(routineId);
      return next;
    });
  }

  function handleCreateNew() {
    const routineId = addRoutine(programId);
    reset();
    onOpenChange(false);
    router.push(`/program/${programId}/routine/${routineId}`);
  }

  function handleCopy() {
    for (const { routine } of importable) {
      if (selectedRoutineIds.has(routine.id)) addRoutineCopy(programId, routine);
    }
    reset();
    onOpenChange(false);
  }

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
          <DialogTitle>Routines</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium text-foreground">Create New Routine From Scratch</p>
            <Button size="lg" onClick={handleCreateNew}>
              <Plus />
              Create New Routine
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Or import from library</p>

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search routine"
              className="h-9 pl-9"
            />
          </div>

          <div className="flex flex-col gap-2">
            {importable.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No routines found.</p>
            )}
            {importable.map(({ program, routine }) => (
              <label
                key={routine.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  checked={selectedRoutineIds.has(routine.id)}
                  onChange={() => toggleRoutine(routine.id)}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">From: My Programs / {program.title}</span>
                  <span className="text-sm font-semibold text-foreground">{routine.name}</span>
                </div>
              </label>
            ))}
          </div>
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button size="lg" disabled={selectedRoutineIds.size === 0} onClick={handleCopy}>
            Copy Routine to Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
