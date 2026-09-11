import { create } from "zustand";

import { deleteProgramAction, duplicateProgramAction, updateProgramAction } from "@/features/program-editor/actions";
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
  hydratePrograms: (programs: Program[]) => void;
  upsertProgram: (program: Program) => void;
  registerPersistAction: (programId: string, action: PersistAction) => void;
  getProgram: (id: string) => Program | undefined;
  duplicateProgram: (sourceProgramId: string) => Promise<string>;
  removeProgram: (id: string) => Promise<void>;
  updateProgramDetails: (id: string, patch: ProgramDetailsPatch) => void;
  addRoutineToProgram: (programId: string, routineId: string) => void;
  removeRoutineFromProgram: (programId: string, routineId: string) => void;
  saveProgram: (id: string) => Promise<void>;
};

export const useMyProgramsStore = create<MyProgramsState>((set, get) => ({
  programs: [],
  dirty: {},
  saving: {},

  hydratePrograms: (programs) =>
    set((state) => {
      const byId = new Map(state.programs.map((program) => [program.id, program]));
      for (const program of programs) byId.set(program.id, program);
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

  duplicateProgram: async (sourceProgramId) => {
    const program = await duplicateProgramAction(sourceProgramId);
    get().upsertProgram(program);
    return program.id;
  },

  removeProgram: async (id) => {
    set((state) => ({ programs: state.programs.filter((program) => program.id !== id) }));
    await deleteProgramAction(id);
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
      }));
    } finally {
      set((state) => ({ saving: { ...state.saving, [id]: false } }));
    }
  },
}));
