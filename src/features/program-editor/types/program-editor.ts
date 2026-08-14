export type ProgramDurationOption = {
  value: string;
  label: string;
};

export type MuscleDistributionAxis = {
  id: string;
  label: string;
  sets: number;
};

export type MuscleGroupSetCount = {
  id: string;
  muscleGroup: string;
  sets: number;
};

export type Visibility = "public" | "private";

export type ProgramLevel = "beginner" | "intermediate" | "advanced";
export type ProgramGoal = "muscleGain" | "strength" | "weightLose";
export type ProgramEquipment = "gym" | "dumbbells" | "none";

export type ExerciseAction = {
  key: string;
};

// `type` is intentionally a free-form string, not a closed union — new metric types
// (duration, distance, RPE, ...) shouldn't require a frontend type change either.
export type ExerciseMetric = {
  type: string;
  value: number;
};

export type ExerciseSetEntry = {
  metrics: ExerciseMetric[];
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  notes: string;
  restSeconds: number;
  actions: ExerciseAction[];
  set: ExerciseSetEntry[];
};

export type Routine = {
  id: string;
  title: string;
  notes: string;
  createdById: string;
  visibility: Visibility;
  exercises: RoutineExercise[];
};

export type Program = {
  id: string;
  title: string;
  notes: string;
  image: string;
  duration: string;
  level: ProgramLevel | null;
  goal: ProgramGoal | null;
  equipment: ProgramEquipment | null;
  createdById: string;
  visibility: Visibility;
  routineIds: string[];
  isFeatured: boolean;
  // Server-incremented only (cloned via "Add to My Library" or assigned to a client) —
  // never sent in a write payload.
  clonedCount: number;
  // Populated by the backend on read responses (GET/PATCH) — absent on plain write payloads.
  routines?: Routine[];
};

export type ProgramPatch = Partial<
  Pick<
    Program,
    "title" | "notes" | "image" | "duration" | "level" | "goal" | "equipment" | "visibility" | "routineIds" | "isFeatured"
  >
>;

export type RoutinePatch = Partial<Pick<Routine, "title" | "notes" | "visibility" | "exercises">>;
