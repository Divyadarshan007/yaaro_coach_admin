import { create } from "zustand";

import {
  createBlankProgramAction,
  deleteProgramAction,
  duplicateProgramAction,
  updateProgramAction,
} from "@/features/program-editor/actions";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { Program, ProgramPatch } from "@/features/program-editor/types/program-editor";

function updateProgram(programs: Program[], programId: string, updater: (program: Program) => Program) {
  return programs.map((program) => (program.id === programId ? updater(program) : program));
}

type PersistAction = (id: string, patch: ProgramPatch) => Promise<Program>;

// Defaults every program to the coach's-own-library PATCH endpoint. A program fetched
// through a different route (e.g. a client-scoped program editor) registers its own
// persist target via registerPersistAction.
const persistActions = new Map<string, PersistAction>();
function getPersistAction(programId: string): PersistAction {
  return persistActions.get(programId) ?? updateProgramAction;
}

type ProgramDetailsPatch = Partial<
  Pick<Program, "title" | "notes" | "image" | "duration" | "level" | "goal" | "equipment" | "visibility" | "isFeatured">
>;

type MyProgramsState = {
  programs: Program[];
  // Ids of programs with local edits not yet pushed to the backend — cleared on a
  // successful saveProgram(). Drives the header's Save button / "All changes saved" state.
  dirty: Record<string, boolean>;
  saving: Record<string, boolean>;
  // Ids created via createProgram() that have never had a successful saveProgram() yet —
  // "Create Workout Program" creates the backend row immediately (so it can be navigated
  // to and edited), but if the coach leaves without ever saving it, discardIfUnsaved()
  // deletes that empty row rather than leaving an orphan "Untitled Program" behind.
  neverSaved: Record<string, boolean>;
  hydratePrograms: (programs: Program[]) => void;
  upsertProgram: (program: Program) => void;
  registerPersistAction: (programId: string, action: PersistAction) => void;
  getProgram: (id: string) => Program | undefined;
  createProgram: () => Promise<string>;
  duplicateProgram: (sourceProgramId: string) => Promise<string>;
  removeProgram: (id: string) => Promise<void>;
  // Returns true if the program was actually discarded (i.e. it really was never
  // saved) — callers use that to know it's really gone.
  discardIfUnsaved: (id: string) => Promise<boolean>;
  updateProgramDetails: (id: string, patch: ProgramDetailsPatch) => void;
  addRoutineToProgram: (programId: string, routineId: string) => void;
  removeRoutineFromProgram: (programId: string, routineId: string) => void;
  saveProgram: (id: string) => Promise<void>;
};

export const useMyProgramsStore = create<MyProgramsState>((set, get) => ({
  programs: [],
  dirty: {},
  saving: {},
  neverSaved: {},

  // A fresh server list is authoritative for *existence* — drop any local program the
  // server no longer has (e.g. deleted since the last hydration) instead of leaving it
  // stuck around forever, while still never clobbering a program with unsaved local
  // edits (dirty) or a freshly created draft (neverSaved) with the stale server copy.
  hydratePrograms: (programs) =>
    set((state) => {
      const incomingIds = new Set(programs.map((program) => program.id));
      const preserved = state.programs.filter(
        (program) => incomingIds.has(program.id) || state.dirty[program.id] || state.neverSaved[program.id]
      );
      const byId = new Map(preserved.map((program) => [program.id, program]));
      for (const program of programs) {
        if (!state.dirty[program.id]) byId.set(program.id, program);
      }
      return { programs: [...byId.values()] };
    }),

  upsertProgram: (program) =>
    set((state) => {
      const exists = state.programs.some((existing) => existing.id === program.id);
      return {
        programs: exists
          ? state.programs.map((existing) => (existing.id === program.id ? program : existing))
          : [...state.programs, program],
      };
    }),

  registerPersistAction: (programId, action) => persistActions.set(programId, action),

  getProgram: (id) => get().programs.find((program) => program.id === id),

  createProgram: async () => {
    const program = await createBlankProgramAction();
    get().upsertProgram(program);
    set((state) => ({ neverSaved: { ...state.neverSaved, [program.id]: true } }));
    return program.id;
  },

  duplicateProgram: async (sourceProgramId) => {
    const program = await duplicateProgramAction(sourceProgramId);
    get().upsertProgram(program);
    return program.id;
  },

  removeProgram: async (id) => {
    set((state) => ({ programs: state.programs.filter((program) => program.id !== id) }));
    await deleteProgramAction(id);
  },

  discardIfUnsaved: async (id) => {
    if (!get().neverSaved[id]) return false;
    set((state) => ({
      programs: state.programs.filter((program) => program.id !== id),
      dirty: { ...state.dirty, [id]: false },
      neverSaved: { ...state.neverSaved, [id]: false },
    }));
    try {
      await deleteProgramAction(id);
    } catch {
      // Best-effort cleanup of an empty draft — nothing meaningful to surface if it fails.
    }
    return true;
  },

  updateProgramDetails: (id, patch) => {
    set((state) => ({
      programs: updateProgram(state.programs, id, (program) => ({ ...program, ...patch })),
      dirty: { ...state.dirty, [id]: true },
    }));
  },

  addRoutineToProgram: (programId, routineId) => {
    // Program.routines is the backend-populated list the editor renders from — keep it
    // in sync with routineIds here, since the routine's full data already lives in the
    // "My Routines" store (either picked from the library or just created).
    const routine = useMyRoutinesStore.getState().getRoutine(routineId);
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) => ({
        ...program,
        routineIds: [...program.routineIds, routineId],
        routines: routine ? [...(program.routines ?? []), routine] : program.routines,
      })),
      dirty: { ...state.dirty, [programId]: true },
    }));
  },

  removeRoutineFromProgram: (programId, routineId) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) => ({
        ...program,
        routineIds: program.routineIds.filter((id) => id !== routineId),
        routines: program.routines?.filter((routine) => routine.id !== routineId),
      })),
      dirty: { ...state.dirty, [programId]: true },
    }));
  },

  saveProgram: async (id) => {
    const program = get().getProgram(id);
    if (!program) return;
    set((state) => ({ saving: { ...state.saving, [id]: true } }));
    try {
      const updated = await getPersistAction(id)(id, {
        title: program.title,
        notes: program.notes,
        image: program.image,
        duration: program.duration,
        level: program.level,
        goal: program.goal,
        equipment: program.equipment,
        visibility: program.visibility,
        routineIds: program.routineIds,
        isFeatured: program.isFeatured,
      });
      set((state) => ({
        programs: updateProgram(state.programs, id, () => updated),
        dirty: { ...state.dirty, [id]: false },
        neverSaved: { ...state.neverSaved, [id]: false },
      }));
    } finally {
      set((state) => ({ saving: { ...state.saving, [id]: false } }));
    }
  },
}));
