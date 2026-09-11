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

type MyRoutinesState = {
  routines: Routine[];
  // Ids of routines with local edits not yet pushed to the backend — cleared on a
  // successful saveRoutine(). Drives the header's Save button / "All changes saved" state.
  dirty: Record<string, boolean>;
  saving: Record<string, boolean>;
  // Ids created via createRoutine() that have never had a successful saveRoutine() yet —
  // "Add Routine" creates the backend row immediately (so it can be navigated to and
  // edited), but if the coach leaves without ever saving it, discardIfUnsaved() deletes
  // that empty row rather than leaving an orphan "Untitled Routine" behind.
  neverSaved: Record<string, boolean>;
  hydrateRoutines: (routines: Routine[]) => void;
  upsertRoutine: (routine: Routine) => void;
  getRoutine: (id: string) => Routine | undefined;
  // `programId` attaches the routine to that program immediately at creation, instead
  // of leaving it standalone until the program itself gets saved — used by "Create New
  // Routine" from inside a program's Add Routine dialog, so it never shows up in "My
  // Routines" even transiently. Omit it for the standalone My Routines "Add Routine".
  createRoutine: (programId?: string) => Promise<string>;
  duplicateRoutine: (sourceRoutineId: string) => Promise<string>;
  removeRoutine: (id: string) => Promise<void>;
  // Returns true if the routine was actually discarded (i.e. it really was never
  // saved) — callers use that to also drop it from any program that referenced it.
  discardIfUnsaved: (id: string) => Promise<boolean>;
  updateRoutineDetails: (id: string, patch: Partial<Pick<Routine, "title" | "notes">>) => void;
  addExercise: (routineId: string, exerciseId: string, actions: ExerciseAction[]) => void;
  updateExercise: (routineId: string, exerciseId: string, patch: Partial<Omit<RoutineExercise, "id" | "sets">>) => void;
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
  saveRoutine: (id: string) => Promise<void>;
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
  dirty: {},
  saving: {},
  neverSaved: {},

  // A fresh server list is authoritative for *existence* — drop any local routine the
  // server no longer has (deleted since the last hydration) instead of leaving it stuck
  // around forever. Keep dirty (unsaved edits) or neverSaved (freshly created, program-
  // attached drafts — these are legitimately absent from the "mine" list since program-
  // attached routines don't show there) entries as-is rather than clobbering them.
  hydrateRoutines: (routines) =>
    set((state) => {
      const incomingIds = new Set(routines.map((routine) => routine.id));
      const preserved = state.routines.filter(
        (routine) => incomingIds.has(routine.id) || state.dirty[routine.id] || state.neverSaved[routine.id]
      );
      const byId = new Map(preserved.map((routine) => [routine.id, routine]));
      for (const routine of routines) {
        if (!state.dirty[routine.id]) byId.set(routine.id, routine);
      }
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

  createRoutine: async (programId) => {
    const routine = await createRoutineAction({ title: "Untitled Routine", programId });
    get().upsertRoutine(routine);
    set((state) => ({ neverSaved: { ...state.neverSaved, [routine.id]: true } }));
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

  discardIfUnsaved: async (id) => {
    if (!get().neverSaved[id]) return false;
    set((state) => ({
      routines: state.routines.filter((routine) => routine.id !== id),
      dirty: { ...state.dirty, [id]: false },
      neverSaved: { ...state.neverSaved, [id]: false },
    }));
    try {
      await deleteRoutineAction(id);
    } catch {
      // Best-effort cleanup of an empty draft — nothing meaningful to surface if it fails.
    }
    return true;
  },

  updateRoutineDetails: (id, patch) => {
    set((state) => ({
      routines: updateRoutine(state.routines, id, (routine) => ({ ...routine, ...patch })),
      dirty: { ...state.dirty, [id]: true },
    }));
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
            sets: [{ metrics: [] }],
          },
        ],
      })),
      dirty: { ...state.dirty, [routineId]: true },
    }));
  },

  updateExercise: (routineId, exerciseId, patch) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, ...patch } : exercise
        ),
      })),
      dirty: { ...state.dirty, [routineId]: true },
    }));
  },

  removeExercise: (routineId, exerciseId) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.filter((exercise) => exercise.id !== exerciseId),
      })),
      dirty: { ...state.dirty, [routineId]: true },
    }));
  },

  addExerciseSet: (routineId, exerciseId) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, sets: [...exercise.sets, { metrics: [] }] } : exercise
        ),
      })),
      dirty: { ...state.dirty, [routineId]: true },
    }));
  },

  removeExerciseSet: (routineId, exerciseId, setIndex) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
            : exercise
        ),
      })),
      dirty: { ...state.dirty, [routineId]: true },
    }));
  },

  updateExerciseSetMetric: (routineId, exerciseId, setIndex, metricType, value) => {
    set((state) => ({
      routines: updateRoutine(state.routines, routineId, (routine) => ({
        ...routine,
        exercises: routine.exercises.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((entry, index) =>
                  index === setIndex ? updateSetMetric(entry, metricType, value) : entry
                ),
              }
            : exercise
        ),
      })),
      dirty: { ...state.dirty, [routineId]: true },
    }));
  },

  saveRoutine: async (id) => {
    const routine = get().getRoutine(id);
    if (!routine) return;
    set((state) => ({ saving: { ...state.saving, [id]: true } }));
    try {
      // A routine's title is required backend-side — never PATCH a blank one. If the
      // title field is cleared, still save notes/exercises and just hold the title.
      const trimmedTitle = routine.title.trim();
      const updated = await updateRoutineAction(id, {
        ...(trimmedTitle ? { title: routine.title } : {}),
        notes: routine.notes,
        exercises: routine.exercises,
      });
      set((state) => ({
        routines: updateRoutine(state.routines, id, () => updated),
        dirty: { ...state.dirty, [id]: false },
        neverSaved: { ...state.neverSaved, [id]: false },
      }));
    } finally {
      set((state) => ({ saving: { ...state.saving, [id]: false } }));
    }
  },
}));
