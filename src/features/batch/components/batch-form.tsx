"use client";

import { Input } from "@/components/ui/input";
import { TimeField } from "@/features/batch/components/time-field";
import { cn } from "@/lib/utils";
import type {
  Batch,
  BatchFormValues,
  BatchLimitType,
  CreateBatchInput,
} from "@/features/batch/types/batch";

const LIMIT_TYPE_OPTIONS: { value: BatchLimitType; label: string }[] = [
  { value: "unlimited", label: "Unlimited" },
  { value: "limited", label: "Set limit" },
];

export function emptyBatchForm(): BatchFormValues {
  return {
    title: "",
    startTime: "",
    endTime: "",
    limitType: "unlimited",
    maxMembers: "",
  };
}

export function batchToForm(batch: Batch): BatchFormValues {
  return {
    title: batch.title,
    startTime: batch.startTime,
    endTime: batch.endTime,
    limitType: batch.limitType,
    maxMembers: batch.maxMembers != null ? String(batch.maxMembers) : "",
  };
}

export function formToInput(values: BatchFormValues): CreateBatchInput {
  const base: CreateBatchInput = {
    title: values.title.trim(),
    startTime: values.startTime,
    endTime: values.endTime,
    limitType: values.limitType,
  };
  if (values.limitType === "limited") {
    base.maxMembers = Number(values.maxMembers);
  }
  return base;
}

// Both are "HH:mm" 24h strings, so a lexical compare is also a chronological one.
export function isEndAfterStart(values: BatchFormValues): boolean {
  return (
    !values.startTime || !values.endTime || values.endTime > values.startTime
  );
}

export function isBatchFormValid(values: BatchFormValues): boolean {
  if (values.title.trim().length === 0) return false;
  if (!values.startTime || !values.endTime) return false;
  if (!isEndAfterStart(values)) return false;
  if (values.limitType === "limited") {
    const n = Number(values.maxMembers);
    if (!Number.isInteger(n) || n < 1) return false;
  }
  return true;
}

type BatchFormProps = {
  values: BatchFormValues;
  onChange: (patch: Partial<BatchFormValues>) => void;
  disabled?: boolean;
};

export function BatchForm({ values, onChange, disabled }: BatchFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="batch-title"
          className="text-sm font-medium text-foreground"
        >
          Title
        </label>
        <Input
          id="batch-title"
          value={values.title}
          disabled={disabled}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Morning Batch"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-4">
          <TimeField
            label="Start time"
            value={values.startTime}
            disabled={disabled}
            onChange={(startTime) => onChange({ startTime })}
          />
          <TimeField
            label="End time"
            value={values.endTime}
            disabled={disabled}
            onChange={(endTime) => onChange({ endTime })}
          />
        </div>
        {!isEndAfterStart(values) && (
          <p className="text-xs text-destructive">
            End time must be after start time.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Limit</span>
        <div className="flex flex-wrap gap-2">
          {LIMIT_TYPE_OPTIONS.map((option) => {
            const active = values.limitType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onChange({ limitType: option.value })}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:bg-muted",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {values.limitType === "limited" && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="batch-max"
            className="text-sm font-medium text-foreground"
          >
            Max members
          </label>
          <Input
            id="batch-max"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={values.maxMembers}
            disabled={disabled}
            onChange={(event) => onChange({ maxMembers: event.target.value })}
            placeholder="e.g. 20"
          />
        </div>
      )}
    </div>
  );
}
