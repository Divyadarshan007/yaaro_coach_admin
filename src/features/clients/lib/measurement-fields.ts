import type { ClientMeasurement } from "@/features/clients/types/measurement";

export type MeasurementFieldKey = Exclude<keyof ClientMeasurement, "id" | "date" | "image">;

// Body-order — matches the Log Measurement dialog's field order (and the reference
// screenshot's top-to-bottom body layout), not alphabetical.
export const MEASUREMENT_FIELDS: { key: MeasurementFieldKey; label: string }[] = [
  { key: "weight", label: "Body Weight" },
  { key: "bodyFat", label: "Body Fat" },
  { key: "neck", label: "Neck" },
  { key: "shoulder", label: "Shoulder" },
  { key: "chest", label: "Chest" },
  { key: "leftBiceps", label: "Left Bicep" },
  { key: "rightBiceps", label: "Right Bicep" },
  { key: "leftForearm", label: "Left Forearm" },
  { key: "rightForearm", label: "Right Forearm" },
  { key: "abdomen", label: "Abdomen" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "leftThigh", label: "Left Thigh" },
  { key: "rightThigh", label: "Right Thigh" },
  { key: "leftCalf", label: "Left Calf" },
  { key: "rightCalf", label: "Right Calf" },
];

export const MEASUREMENT_UNIT_BY_KEY: Record<MeasurementFieldKey, string> = {
  weight: "kg",
  bodyFat: "%",
  neck: "cm",
  shoulder: "cm",
  chest: "cm",
  leftBiceps: "cm",
  rightBiceps: "cm",
  leftForearm: "cm",
  rightForearm: "cm",
  abdomen: "cm",
  waist: "cm",
  hips: "cm",
  leftThigh: "cm",
  rightThigh: "cm",
  leftCalf: "cm",
  rightCalf: "cm",
};
