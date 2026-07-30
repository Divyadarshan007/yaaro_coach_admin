import type { AvatarInfo } from "@/features/clients/types/client";

export type ActivitySegment = {
  text: string;
  emphasis?: boolean;
};

export type ActivityItem = {
  id: string;
  avatar: AvatarInfo;
  segments: ActivitySegment[];
  timestamp: string;
};

export type WeeklyStatPoint = {
  label: string;
  value: number;
};

export type StatSummary = {
  label: string;
  displayValue: string;
  subLabel: string;
  data: WeeklyStatPoint[];
};

export type BodyweightPoint = {
  label: string;
  value: number;
};

export type BodyweightSummary = {
  currentValue: number;
  unit: string;
  data: BodyweightPoint[];
};

export type ProgressPicture = {
  id: string;
  dateLabel: string;
  weightLabel: string;
};

export type WorkoutProgramSummary = {
  name: string;
  routineCount: number;
  startDateLabel: string;
};

export type ClientDetail = {
  id: string;
  avatar: AvatarInfo;
  name: string;
  email: string;
  coach: AvatarInfo;
  coachedSinceLabel: string;
  workoutProgram: WorkoutProgramSummary;
  activities: ActivityItem[];
  duration: StatSummary;
  volume: StatSummary;
  sets: StatSummary;
  bodyweight: BodyweightSummary;
  progressPictures: ProgressPicture[];
};
