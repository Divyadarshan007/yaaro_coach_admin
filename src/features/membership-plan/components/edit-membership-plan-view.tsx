"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateMembershipPlanAction } from "@/features/membership-plan/actions";
import {
  MembershipPlanForm,
  formToInput,
  isMembershipPlanFormValid,
  planToForm,
} from "@/features/membership-plan/components/membership-plan-form";
import type {
  MembershipPlan,
  MembershipPlanFormValues,
} from "@/features/membership-plan/types/membership-plan";

export function EditMembershipPlanView({ plan }: { plan: MembershipPlan }) {
  const router = useRouter();
  const [values, setValues] = useState<MembershipPlanFormValues>(() => planToForm(plan));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(patch: Partial<MembershipPlanFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateMembershipPlanAction(plan.id, formToInput(values));
        router.push("/membership-plan");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update membership plan");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/membership-plan"
          className="w-fit text-sm text-muted-foreground hover:text-foreground"
        >
          Membership Plan
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/membership-plan"
            aria-label="Back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Edit membership plan</h1>
            <p className="text-sm text-muted-foreground">Update this plan&apos;s validity and price.</p>
          </div>
        </div>
      </div>

      <MembershipPlanForm values={values} onChange={handleChange} disabled={isPending} />
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-row justify-end gap-2">
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={<Link href="/membership-plan" />}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          onClick={handleSave}
          disabled={isPending || !isMembershipPlanFormValid(values)}
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
