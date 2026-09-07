"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  VALIDITY_TYPES,
  VALIDITY_TYPE_LABELS,
} from "@/features/membership-plan/types/membership-plan";
import type {
  CreateMembershipPlanInput,
  MembershipPlan,
  MembershipPlanFormValues,
} from "@/features/membership-plan/types/membership-plan";

export function emptyMembershipPlanForm(): MembershipPlanFormValues {
  return {
    title: "",
    validity: "",
    validityType: "month",
    price: "",
  };
}

export function planToForm(plan: MembershipPlan): MembershipPlanFormValues {
  return {
    title: plan.title,
    validity: String(plan.validity),
    validityType: plan.validityType,
    price: String(plan.price),
  };
}

export function formToInput(values: MembershipPlanFormValues): CreateMembershipPlanInput {
  return {
    title: values.title.trim(),
    validity: Number(values.validity),
    validityType: values.validityType,
    price: Number(values.price),
  };
}

export function isMembershipPlanFormValid(values: MembershipPlanFormValues): boolean {
  if (values.title.trim().length === 0) return false;
  const validity = Number(values.validity);
  if (!Number.isInteger(validity) || validity < 1) return false;
  const price = Number(values.price);
  if (!Number.isFinite(price) || price < 0 || values.price.trim() === "") return false;
  return true;
}

type MembershipPlanFormProps = {
  values: MembershipPlanFormValues;
  onChange: (patch: Partial<MembershipPlanFormValues>) => void;
  disabled?: boolean;
};

export function MembershipPlanForm({ values, onChange, disabled }: MembershipPlanFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="plan-title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <Input
          id="plan-title"
          value={values.title}
          disabled={disabled}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Quarterly Plan"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="plan-validity" className="text-sm font-medium text-foreground">
          Validity
        </label>
        <Input
          id="plan-validity"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={values.validity}
          disabled={disabled}
          onChange={(event) => onChange({ validity: event.target.value })}
          placeholder="e.g. 3"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Validity type</span>
        <div className="flex flex-wrap gap-2">
          {VALIDITY_TYPES.map((option) => {
            const active = values.validityType === option;
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onChange({ validityType: option })}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:bg-muted"
                )}
              >
                {VALIDITY_TYPE_LABELS[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="plan-price" className="text-sm font-medium text-foreground">
          Price
        </label>
        <Input
          id="plan-price"
          type="number"
          min={0}
          step={1}
          inputMode="decimal"
          value={values.price}
          disabled={disabled}
          onChange={(event) => onChange({ price: event.target.value })}
          placeholder="e.g. 6000"
        />
      </div>
    </div>
  );
}
