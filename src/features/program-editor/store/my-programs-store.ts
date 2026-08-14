import { create } from "zustand";

import { deleteProgramAction, duplicateProgramAction, updateProgramAction } from "@/features/program-editor/actions";
import type { Program, ProgramPatch } from "@/features/program-editor/types/program-editor";

function updateProgram(programs: Program[], programId: string, updater: (program: Program) => Program) {
  return programs.map((program) => (program.id === programId ? updater(program) : program));
}

// Local edits apply to the zustand store instantly (snappy editor UX); this debounces
// pushing the current program state to the backend so rapid edits (e.g. typing) don't
// each trigger a round trip.
const PERSIST_DEBOUNCE_MS = 600;
const persistTimers = new Map<string, ReturnType<typeof setTimeout>>();

type PersistAction = (id: string, patch: ProgramPatch) => Promise<Program>;

// Defaults every program to the coach's-own-library PATCH endpoint. A program fetched
// through a different route (e.g. a client-scoped program editor) registers its own
// persist target via registerPersistAction.
const persistActions = new Map<string, PersistAction>();
function getPersistAction(programId: string): PersistAction {
  return persistActions.get(programId) ?? updateProgramAction;
}

function schedulePersist(programId: string, getProgram: () => Program | undefined) {
  const existing = persistTimers.get(programId);
  if (existing) clearTimeout(existing);
  persistTimers.set(
    programId,
    setTimeout(() => {
      persistTimers.delete(programId);
      const program = getProgram();
      if (!program) return;
      void getPersistAction(programId)(programId, {
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
    }, PERSIST_DEBOUNCE_MS)
  );
}

type ProgramDetailsPatch = Partial<
  Pick<Program, "title" | "notes" | "image" | "duration" | "level" | "goal" | "equipment" | "visibility" | "isFeatured">
>;

type MyProgramsState = {
  programs: Program[];
  hydratePrograms: (programs: Program[]) => void;
  upsertProgram: (program: Program) => void;
  registerPersistAction: (programId: string, action: PersistAction) => void;
  getProgram: (id: string) => Program | undefined;
  duplicateProgram: (sourceProgramId: string) => Promise<string>;
  removeProgram: (id: string) => Promise<void>;
  updateProgramDetails: (id: string, patch: ProgramDetailsPatch) => void;
  addRoutineToProgram: (programId: string, routineId: string) => void;
  removeRoutineFromProgram: (programId: string, routineId: string) => void;
};

export const useMyProgramsStore = create<MyProgramsState>((set, get) => ({
  programs: [],

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
    set((state) => ({ programs: updateProgram(state.programs, id, (program) => ({ ...program, ...patch })) }));
    schedulePersist(id, () => get().getProgram(id));
  },

  addRoutineToProgram: (programId, routineId) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) => ({
        ...program,
        routineIds: [...program.routineIds, routineId],
      })),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  removeRoutineFromProgram: (programId, routineId) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) => ({
        ...program,
        routineIds: program.routineIds.filter((id) => id !== routineId),
      })),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },
}));
