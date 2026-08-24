import type {
  ProgramDurationOption,
  ProgramEquipment,
  ProgramGoal,
  ProgramLevel,
} from "@/features/program-editor/types/program-editor";

export const PROGRAM_DURATION_OPTIONS: ProgramDurationOption[] = [
  { value: "unlimited", label: "Unlimited" },
  { value: "4-weeks", label: "4 Weeks" },
  { value: "6-weeks", label: "6 Weeks" },
  { value: "8-weeks", label: "8 Weeks" },
  { value: "12-weeks", label: "12 Weeks" },
];

export const PROGRAM_LEVEL_OPTIONS: { value: ProgramLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const PROGRAM_GOAL_OPTIONS: { value: ProgramGoal; label: string }[] = [
  { value: "muscleGain", label: "Muscle Gain" },
  { value: "strength", label: "Strength" },
  { value: "weightLose", label: "Weight Loss" },
];

export const PROGRAM_EQUIPMENT_OPTIONS: { value: ProgramEquipment; label: string }[] = [
  { value: "gym", label: "Full Gym" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "none", label: "No Equipment" },
];
