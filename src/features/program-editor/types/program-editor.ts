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

export type ProgramExerciseSet = {
  lbs: number | null;
  reps: number | null;
};

export type ProgramExercise = {
  id: string;
  sets: ProgramExerciseSet[];
  name: string;
  note: string;
  rest: string;
  actions: string[];
  muscleId: string | null;
};

export type ProgramRoutine = {
  id: string;
  name: string;
  note: string;
  exercises: ProgramExercise[];
};

export type Program = {
  id: string;
  templateId: string | null;
  title: string;
  duration: string;
  note: string;
  routines: ProgramRoutine[];
};
