"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createMembershipPlanAction } from "@/features/membership-plan/actions";
import {
  MembershipPlanForm,
  emptyMembershipPlanForm,
  formToInput,
  isMembershipPlanFormValid,
} from "@/features/membership-plan/components/membership-plan-form";
import type { MembershipPlanFormValues } from "@/features/membership-plan/types/membership-plan";

export function CreateMembershipPlanView() {
  const router = useRouter();
  const [values, setValues] = useState<MembershipPlanFormValues>(emptyMembershipPlanForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(patch: Partial<MembershipPlanFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      try {
        await createMembershipPlanAction(formToInput(values));
        router.push("/membership-plan");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create membership plan");
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
            <h1 className="text-xl font-semibold text-foreground">Create a membership plan</h1>
            <p className="text-sm text-muted-foreground">A named duration at a price for your clients.</p>
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
          onClick={handleCreate}
          disabled={isPending || !isMembershipPlanFormValid(values)}
        >
          {isPending ? "Creating..." : "Create plan"}
        </Button>
      </div>
    </div>
  );
}
