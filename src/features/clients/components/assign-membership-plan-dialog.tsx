"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignClientMembershipPlanAction } from "@/features/clients/actions";
import { getMembershipPlansAction } from "@/features/membership-plan/actions";
import { formatValidity } from "@/features/membership-plan/lib/format";
import type { MembershipPlan } from "@/features/membership-plan/types/membership-plan";

const NO_PLAN = "__none__";

export function AssignMembershipPlanDialog({
  clientId,
  clientName,
  currentPlanId,
  open,
  onOpenChange,
}: {
  clientId: string;
  clientName: string;
  currentPlanId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  // null = untouched, follow currentPlanId; "" = explicitly "No plan".
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = draft ?? currentPlanId ?? "";

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getMembershipPlansAction()
      .then((list) => {
        if (!cancelled) setPlans(list);
      })
      .catch(() => {
        if (!cancelled) setPlans([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function close(next: boolean) {
    if (isPending) return;
    if (!next) {
      setDraft(null);
      setError(null);
    }
    onOpenChange(next);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await assignClientMembershipPlanAction(clientId, selected || null);
        setDraft(null);
        onOpenChange(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to assign membership plan",
        );
      }
    });
  }

  const planChanged = (selected || null) !== currentPlanId;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign membership plan for {clientName}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Select<string>
            value={selected || NO_PLAN}
            onValueChange={(value) =>
              setDraft(!value || value === NO_PLAN ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string) =>
                  value === NO_PLAN
                    ? "No plan"
                    : (plans.find((p) => p.id === value)?.title ?? "No plan")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PLAN}>No plan</SelectItem>
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.title} ·{" "}
                  {formatValidity(plan.validity, plan.validityType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {planChanged && selected && (
            <p className="text-xs text-muted-foreground">
              The membership starts today; its expiry is set from the
              plan&apos;s duration.
            </p>
          )}
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button
            variant="outline"
            size="lg"
            onClick={() => close(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button size="lg" onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
