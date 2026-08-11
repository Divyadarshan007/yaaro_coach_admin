export type ProfileFormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
};

export type EmailNotificationId =
  | "workoutCompleted"
  | "measurementAdded"
  | "messageReceived"
  | "programFinishing";

export type RestTimerOption = "off" | "30" | "60" | "90" | "120" | "180";
export type WeightUnit = "kg" | "lbs";
export type DistanceUnit = "kilometers" | "miles";
export type MeasurementUnit = "cm" | "in";
export type WeekStartDay = "sunday" | "monday";
export type RepetitionOption = "reps" | "rep-range";

export type PreferencesFormValues = {
  restTimer: RestTimerOption;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  measurementUnit: MeasurementUnit;
  weekStartDay: WeekStartDay;
  repetitionOption: RepetitionOption;
};
