"use client";

import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";

export function AddRoutineDialog({
  programId,
  basePath = `/program/${programId}`,
  open,
  onOpenChange,
}: {
  programId: string;
  basePath?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const program = useMyProgramsStore((state) => state.getProgram(programId));
  const routines = useMyRoutinesStore((state) => state.routines);
  const createRoutine = useMyRoutinesStore((state) => state.createRoutine);
  const addRoutineToProgram = useMyProgramsStore((state) => state.addRoutineToProgram);
  const [isCreating, startCreateTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const alreadyInProgram = new Set(program?.routineIds ?? []);
  const available = useMemo(() => {
    const query = search.trim().toLowerCase();
    return routines.filter((routine) => {
      if (alreadyInProgram.has(routine.id)) return false;
      if (query.length === 0) return true;
      return routine.title.toLowerCase().includes(query);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routines, search, program?.routineIds]);

  function reset() {
    setSearch("");
    setSelectedIds(new Set());
  }

  function toggleRoutine(id: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCreateNew() {
    startCreateTransition(async () => {
      const routineId = await createRoutine();
      addRoutineToProgram(programId, routineId);
      reset();
      onOpenChange(false);
      router.push(`${basePath}/routine/${routineId}`);
    });
  }

  function handleAdd() {
    for (const id of selectedIds) addRoutineToProgram(programId, id);
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
            <Button size="lg" onClick={handleCreateNew} disabled={isCreating}>
              <Plus />
              Create New Routine
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Or add from your routine library</p>

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
            {available.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No routines found.</p>
            )}
            {available.map((routine) => (
              <label
                key={routine.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(routine.id)}
                  onChange={() => toggleRoutine(routine.id)}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">
                    {routine.visibility === "public" ? "Public routine" : "My Routines"}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{routine.title}</span>
                </div>
              </label>
            ))}
          </div>
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button size="lg" disabled={selectedIds.size === 0} onClick={handleAdd}>
            Add to Program
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
