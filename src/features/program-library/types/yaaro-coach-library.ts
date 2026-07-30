export type YaaroCoachProgramCategory =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "muscle-growth"
  | "strength"
  | "home-training";

export type YaaroCoachLibraryCategoryId = "all" | YaaroCoachProgramCategory;

export type YaaroCoachCategoryOption = {
  id: YaaroCoachLibraryCategoryId;
  label: string;
};

export type YaaroCoachExercise = {
  sets: number;
  name: string;
  rest: string;
  muscleId: string | null;
};

export type YaaroCoachRoutine = {
  name: string;
  exercises: YaaroCoachExercise[];
};

export type YaaroCoachProgram = {
  id: string;
  title: string;
  description: string;
  categories: YaaroCoachProgramCategory[];
  routines: YaaroCoachRoutine[];
};
