import { create } from "zustand";

import { createProgramFromTemplateAction, deleteProgramAction, updateProgramAction } from "@/features/program-editor/actions";
import type {
  Program,
  ProgramExercise,
  ProgramExerciseSet,
  ProgramRoutine,
} from "@/features/program-editor/types/program-editor";
import type { YaaroCoachProgram } from "@/features/program-library/types/yaaro-coach-library";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function updateProgram(programs: Program[], programId: string, updater: (program: Program) => Program) {
  return programs.map((program) => (program.id === programId ? updater(program) : program));
}

function updateRoutine(program: Program, routineId: string, updater: (routine: ProgramRoutine) => ProgramRoutine) {
  return {
    ...program,
    routines: program.routines.map((routine) => (routine.id === routineId ? updater(routine) : routine)),
  };
}

// Local edits apply to the zustand store instantly (snappy editor UX); this debounces
// pushing the current program state to the backend so rapid edits (e.g. typing) don't
// each trigger a round trip. Ids returned by the backend on the next persisted save can
// differ from the client's locally-generated ones — that's fine since every mutation
// here operates on local ids only; it self-heals the next time the page is loaded and
// re-hydrated from the server.
const PERSIST_DEBOUNCE_MS = 600;
const persistTimers = new Map<string, ReturnType<typeof setTimeout>>();

function schedulePersist(programId: string, getProgram: () => Program | undefined) {
  const existing = persistTimers.get(programId);
  if (existing) clearTimeout(existing);
  persistTimers.set(
    programId,
    setTimeout(() => {
      persistTimers.delete(programId);
      const program = getProgram();
      if (!program) return;
      void updateProgramAction(programId, {
        title: program.title,
        duration: program.duration,
        note: program.note,
        routines: program.routines,
      });
    }, PERSIST_DEBOUNCE_MS)
  );
}

type MyProgramsState = {
  programs: Program[];
  hydratePrograms: (programs: Program[]) => void;
  upsertProgram: (program: Program) => void;
  getProgram: (id: string) => Program | undefined;
  isTemplateAdded: (templateId: string) => boolean;
  addFromTemplate: (template: YaaroCoachProgram) => Promise<string>;
  removeProgram: (id: string) => Promise<void>;
  updateProgramDetails: (id: string, patch: Partial<Pick<Program, "title" | "duration" | "note">>) => void;
  addRoutine: (programId: string) => string;
  addRoutineCopy: (programId: string, routine: ProgramRoutine) => void;
  removeRoutine: (programId: string, routineId: string) => void;
  renameRoutine: (programId: string, routineId: string, name: string) => void;
  updateRoutineNote: (programId: string, routineId: string, note: string) => void;
  addExercise: (
    programId: string,
    routineId: string,
    exercise: { name: string; muscleId: string | null; actions: string[] }
  ) => void;
  updateExercise: (
    programId: string,
    routineId: string,
    exerciseId: string,
    patch: Partial<Omit<ProgramExercise, "id" | "sets">>
  ) => void;
  removeExercise: (programId: string, routineId: string, exerciseId: string) => void;
  addExerciseSet: (programId: string, routineId: string, exerciseId: string) => void;
  updateExerciseSet: (
    programId: string,
    routineId: string,
    exerciseId: string,
    setIndex: number,
    patch: Partial<ProgramExerciseSet>
  ) => void;
  removeExerciseSet: (programId: string, routineId: string, exerciseId: string, setIndex: number) => void;
};

export const useMyProgramsStore = create<MyProgramsState>((set, get) => ({
  programs: [],

  hydratePrograms: (programs) => set({ programs }),

  upsertProgram: (program) =>
    set((state) => {
      const exists = state.programs.some((existing) => existing.id === program.id);
      return {
        programs: exists
          ? state.programs.map((existing) => (existing.id === program.id ? program : existing))
          : [...state.programs, program],
      };
    }),

  getProgram: (id) => get().programs.find((program) => program.id === id),

  isTemplateAdded: (templateId) => get().programs.some((program) => program.templateId === templateId),

  addFromTemplate: async (template) => {
    const program = await createProgramFromTemplateAction(template.id);
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

  addRoutine: (programId) => {
    const routineId = createId("routine");
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) => ({
        ...program,
        routines: [...program.routines, { id: routineId, name: "Untitled Routine", note: "", exercises: [] }],
      })),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
    return routineId;
  },

  addRoutineCopy: (programId, routine) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) => ({
        ...program,
        routines: [
          ...program.routines,
          {
            id: createId("routine"),
            name: routine.name,
            note: routine.note,
            exercises: routine.exercises.map((exercise) => ({ ...exercise, id: createId("exercise") })),
          },
        ],
      })),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  removeRoutine: (programId, routineId) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) => ({
        ...program,
        routines: program.routines.filter((routine) => routine.id !== routineId),
      })),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  renameRoutine: (programId, routineId, name) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({ ...routine, name }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  updateRoutineNote: (programId, routineId, note) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({ ...routine, note }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  addExercise: (programId, routineId, exercise) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({
          ...routine,
          exercises: [
            ...routine.exercises,
            {
              id: createId("exercise"),
              sets: [{ lbs: null, reps: null }],
              name: exercise.name,
              note: "",
              rest: "Off",
              actions: exercise.actions,
              muscleId: exercise.muscleId,
            },
          ],
        }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  updateExercise: (programId, routineId, exerciseId, patch) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({
          ...routine,
          exercises: routine.exercises.map((exercise) =>
            exercise.id === exerciseId ? { ...exercise, ...patch } : exercise
          ),
        }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  removeExercise: (programId, routineId, exerciseId) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({
          ...routine,
          exercises: routine.exercises.filter((exercise) => exercise.id !== exerciseId),
        }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  addExerciseSet: (programId, routineId, exerciseId) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({
          ...routine,
          exercises: routine.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? { ...exercise, sets: [...exercise.sets, { lbs: null, reps: null }] }
              : exercise
          ),
        }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  updateExerciseSet: (programId, routineId, exerciseId, setIndex, patch) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({
          ...routine,
          exercises: routine.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set, index) => (index === setIndex ? { ...set, ...patch } : set)),
                }
              : exercise
          ),
        }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },

  removeExerciseSet: (programId, routineId, exerciseId, setIndex) => {
    set((state) => ({
      programs: updateProgram(state.programs, programId, (program) =>
        updateRoutine(program, routineId, (routine) => ({
          ...routine,
          exercises: routine.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
              : exercise
          ),
        }))
      ),
    }));
    schedulePersist(programId, () => get().getProgram(programId));
  },
}));
