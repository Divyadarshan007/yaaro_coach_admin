"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateCoachProfileAction } from "@/features/settings/actions";
import type {
  DistanceUnit,
  MeasurementUnit,
  PreferencesFormValues,
  RepetitionOption,
  RestTimerOption,
  WeekStartDay,
  WeightUnit,
} from "@/features/settings/types/settings";
import type { CoachProfile } from "@/lib/api/coach";

const REST_TIMER_LABELS: Record<RestTimerOption, string> = {
  off: "Off",
  "30": "30 seconds",
  "60": "60 seconds",
  "90": "90 seconds",
  "120": "2 minutes",
  "180": "3 minutes",
};
const REST_TIMER_OPTIONS = Object.keys(REST_TIMER_LABELS) as RestTimerOption[];

const WEEK_START_LABELS: Record<WeekStartDay, string> = { sunday: "Sunday", monday: "Monday" };
const WEEK_START_OPTIONS = Object.keys(WEEK_START_LABELS) as WeekStartDay[];

function formValuesFromProfile(coachProfile: CoachProfile | null): PreferencesFormValues {
  return {
    restTimer: coachProfile?.restTimer ?? "off",
    weightUnit: coachProfile?.weight ?? "kg",
    distanceUnit: coachProfile?.distance ?? "kilometers",
    measurementUnit: coachProfile?.bodyMeasurements ?? "cm",
    weekStartDay: coachProfile?.weekStartDay ?? "sunday",
    repetitionOption: coachProfile?.repetitionOption ?? "reps",
  };
}

export function PreferencesTab({ coachProfile }: { coachProfile: CoachProfile | null }) {
  const [initialValues, setInitialValues] = useState(() => formValuesFromProfile(coachProfile));
  const [values, setValues] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  function updateField<K extends keyof PreferencesFormValues>(field: K, value: PreferencesFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateCoachProfileAction({
        restTimer: values.restTimer,
        weight: values.weightUnit,
        distance: values.distanceUnit,
        bodyMeasurements: values.measurementUnit,
        weekStartDay: values.weekStartDay,
        repetitionOption: values.repetitionOption,
      });
      const nextValues = formValuesFromProfile(updated);
      setInitialValues(nextValues);
      setValues(nextValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h2 className="font-heading text-lg font-medium text-foreground">Preferences</h2>

      <div className="mt-4 divide-y divide-border rounded-xl ring-1 ring-foreground/10">
        <Field label="Default Rest Timer" description="Set a predefined rest timer for routine creation.">
          <Select
            value={values.restTimer}
            onValueChange={(value) => updateField("restTimer", value as RestTimerOption)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{(value: RestTimerOption) => REST_TIMER_LABELS[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {REST_TIMER_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {REST_TIMER_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Units">
          <div className="flex flex-col gap-5">
            <UnitGroup
              label="Weight"
              options={[
                { value: "kg", label: "Kg" },
                { value: "lbs", label: "Lbs" },
              ]}
              value={values.weightUnit}
              onChange={(value) => updateField("weightUnit", value as WeightUnit)}
            />
            <UnitGroup
              label="Distance"
              options={[
                { value: "kilometers", label: "Kilometers" },
                { value: "miles", label: "Miles" },
              ]}
              value={values.distanceUnit}
              onChange={(value) => updateField("distanceUnit", value as DistanceUnit)}
            />
            <UnitGroup
              label="Measurements"
              options={[
                { value: "cm", label: "Cm" },
                { value: "in", label: "In" },
              ]}
              value={values.measurementUnit}
              onChange={(value) => updateField("measurementUnit", value as MeasurementUnit)}
            />
          </div>
        </Field>

        <Field
          label="First day of the week"
          description="This will change the calendar's first day of the week, as well as the graphs in the Dashboard and Client Profile"
        >
          <Select
            value={values.weekStartDay}
            onValueChange={(value) => updateField("weekStartDay", value as WeekStartDay)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{(value: WeekStartDay) => WEEK_START_LABELS[value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {WEEK_START_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {WEEK_START_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Default Repetition Option"
          description="Choose how you want to define the default repetition input type for your exercises."
        >
          <SegmentedControl
            options={[
              { value: "reps", label: "Reps" },
              { value: "rep-range", label: "Rep Range" },
            ]}
            value={values.repetitionOption}
            onChange={(value) => updateField("repetitionOption", value as RepetitionOption)}
          />
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[minmax(160px,280px)_1fr] sm:items-start">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="sm:max-w-md">{children}</div>
    </div>
  );
}

function UnitGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <SegmentedControl options={options} value={value} onChange={onChange} />
    </div>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-input">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 px-3 py-1.5 text-sm font-medium transition-colors",
            option.value === value
              ? "bg-primary text-primary-foreground"
              : "bg-background text-foreground hover:bg-muted"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
