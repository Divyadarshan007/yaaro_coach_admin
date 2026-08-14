import { create } from "zustand";

import {
  createRoutineAction,
  deleteRoutineAction,
  duplicateRoutineAction,
  updateRoutineAction,
} from "@/features/program-editor/routine-actions";
import type { ExerciseAction, ExerciseSetEntry, Routine, RoutineExercise } from "@/features/program-editor/types/program-editor";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function updateRoutine(routines: Routine[], routineId: string, updater: (routine: Routine) => Routine) {
  return routines.map((routine) => (routine.id === routineId ? updater(routine) : routine));
}

// Same instant-local-edit + debounced-backend-PATCH pattern as my-programs-store — a
// routine is now edited independently of any program that references it, since it's a
// first-class collection of its own.
const PERSIST_DEBOUNCE_MS = 600;
const persistTimers = new Map<string, ReturnType<typeof setTimeout>>();

function schedulePersist(routineId: string, getRoutine: () => Routine | undefined) {
  const existing = persistTimers.get(routineId);
  if (existing) clearTimeout(existing);
  persistTimers.set(
    routineId,
    setTimeout(() => {
      persistTimers.delete(routineId);
      const routine = getRoutine();
      if (!routine) return;
      void updateRoutineAction(routineId, { title: routine.title, notes: routine.notes, exercises: routine.exercises });
    }, PERSIST_DEBOUNCE_MS)
  );
}

type MyRoutinesState = {
  routines: Routine[];
  hydrateRoutines: (routines: Routine[]) => void;
  upsertRoutine: (routine: Routine) => void;
  getRoutine: (id: string) => Routine | undefined;
  createRoutine: () => Promise<string>;
  duplicateRoutine: (sourceRoutineId: string) => Promise<string>;
  removeRoutine: (id: string) => Promise<void>;
  updateRoutineDetails: (id: string, patch: Partial<Pick<Routine, "title" | "notes">>) => void;
  addExercise: (routineId: string, exerciseId: string, actions: ExerciseAction[]) => void;
  updateExercise: (routineId: string, exerciseId: string, patch: Partial<Omit<RoutineExercise, "id" | "set">>) => void;
  removeExercise: (routineId: string, exerciseId: string) => void;
  addExerciseSet: (routineId: string, exerciseId: string) => void;
  removeExerciseSet: (routineId: string, exerciseId: string, setIndex: number) => void;
  updateExerciseSetMetric: (
    routineId: string,
    exerciseId: string,
    setIndex: number,
    metricType: string,
    value: number | null
  ) => void;
};

function updateSetMetric(set: ExerciseSetEntry, metricType: string, value: number | null): ExerciseSetEntry {
  const exists = set.metrics.some((metric) => metric.type === metricType);
  if (value === null) {
    return { metrics: set.metrics.filter((metric) => metric.type !== metricType) };
  }
  if (!exists) {
    return { metrics: [...set.metrics, { type: metricType, value }] };
  }
  return { metrics: set.metrics.map((metric) => (metric.type === metricType ? { ...metric, value } : metric)) };
}

export const useMyRoutinesStore = create<MyRoutinesState>((set, get) => ({
  routines: [],

  hydrateRoutines: (routines) =>
    set((state) => {
      const byId = new Map(state.routines.map((routine) => [routine.id, routine]));
      for (const routine of routines) byId.set(routine.id, routine);
      return { routines: [...byId.values()] };
    }),

  upsertRoutine: (routine) =>
    set((state) => {
      const exists = state.routines.some((existing) => existing.id === routine.id);
      return {
        routines: exists
          ? state.routines.map((existing) => (existing.id === routine.id ? routine : existing))
          : [...state.routines, routine],
      };
    }),

  getRoutine: (id) => get().routines.find((routine) => routine.id === id),

  createRoutine: async () => {
    const routine = await createRoutineAction({ title: "Untitled Routine" });
    get().upsertRoutine(routine);
    return routine.id;
  },

  duplicateRoutine: async (sourceRoutineId) => {
    const routine = await duplicateRoutineAction(sourceRoutineId);
    get().upsertRoutine(routine);
    return routine.id;
  },

  removeRoutine: async (id) => {
    set((state) => ({ routines: state.routines.filter((routine) => routine.id !== id) }));
    await deleteRoutineAction(id);
  },

  updateRoutineDetails: (id, patch) => {
    set((state) => ({ routines: updateRoutine(state.routines, id, (routine) => ({ ...routine, ...patch })) }));
    schedulePersist(id, () => get().getRoutine(id));
  },

  addExercise: (routineId, exerciseId, actions) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: [
          ...routine.exercises,
          {
            id: createId("exercise"),
            exerciseId,
            notes: "",
            restSeconds: 0,
            actions,
            set: [{ metrics: [] }],
          },
        ],
      })),
    }));
    schedulePersist(routineId, () => get().getRoutine(routineId));
  },

  updateExercise: (routineId, exerciseId, patch) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, ...patch } : exercise
        ),
      })),
    }));
    schedulePersist(routineId, () => get().getRoutine(routineId));
  },

  removeExercise: (routineId, exerciseId) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.filter((exercise) => exercise.id !== exerciseId),
      })),
    }));
    schedulePersist(routineId, () => get().getRoutine(routineId));
  },

  addExerciseSet: (routineId, exerciseId) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, set: [...exercise.set, { metrics: [] }] } : exercise
        ),
      })),
    }));
    schedulePersist(routineId, () => get().getRoutine(routineId));
  },

  removeExerciseSet: (routineId, exerciseId, setIndex) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? { ...exercise, set: exercise.set.filter((_, index) => index !== setIndex) }
            : exercise
        ),
      })),
    }));
    schedulePersist(routineId, () => get().getRoutine(routineId));
  },

  updateExerciseSetMetric: (routineId, exerciseId, setIndex, metricType, value) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                set: exercise.set.map((entry, index) =>
                  index === setIndex ? updateSetMetric(entry, metricType, value) : entry
                ),
              }
            : exercise
        ),
      })),
    }));
    schedulePersist(routineId, () => get().getRoutine(routineId));
  },
}));
