"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBatchesAction } from "@/features/batch/actions";
import { formatTime } from "@/features/batch/lib/format";
import type { Batch } from "@/features/batch/types/batch";
import { createClientAction } from "@/features/clients/actions";
import { getLeadSourcesAction } from "@/features/leads/actions";
import { getMembershipPlansAction } from "@/features/membership-plan/actions";
import { formatValidity } from "@/features/membership-plan/lib/format";
import type { MembershipPlan } from "@/features/membership-plan/types/membership-plan";
import { GENDER_OPTIONS } from "@/lib/gender";
import { cn } from "@/lib/utils";
import type { LeadSource } from "@/features/leads/types/lead";

const NO_SOURCE = "__none__";
const NO_BATCH = "__none__";
const NO_PLAN = "__none__";

// A "limited" batch with no seats left can't take another client — mirror the backend
// rule so it's shown disabled rather than failing on submit.
function isBatchFull(batch: Batch): boolean {
  return (
    batch.limitType === "limited" &&
    batch.maxMembers != null &&
    batch.memberCount >= batch.maxMembers
  );
}

// Prefill for the "Convert lead to client" flow — the batch / plan are always left for
// the owner to choose, so they're not part of this.
export type AddClientInitialValues = {
  name?: string;
  phone?: string;
  gender?: string;
  sourceId?: string | null;
};

// Uncontrolled by default (self-triggered), same contract as the old AddClientDialog —
// pass open/onOpenChange to drive it externally with a custom-styled trigger instead
// (see dashboard/components/add-client-button.tsx). Pass initialValues + onCreated to
// prefill it and react to a successful add (see leads/components/lead-row.tsx).
type AddClientFormDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialValues?: AddClientInitialValues;
  onCreated?: () => void | Promise<void>;
};

export function AddClientFormDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialValues,
  onCreated,
}: AddClientFormDialogProps = {}) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const seededName = initialValues?.name ?? "";
  const seededPhone = initialValues?.phone ?? "";
  const seededGender = initialValues?.gender ?? "";
  const seededSourceId = initialValues?.sourceId ?? "";

  const [name, setName] = useState(seededName);
  const [phone, setPhone] = useState(seededPhone);
  const [gender, setGender] = useState(seededGender);
  const [sourceId, setSourceId] = useState(seededSourceId);
  const [batchId, setBatchId] = useState("");
  const [membershipPlanId, setMembershipPlanId] = useState("");
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  // Load the pickers' options the first time the dialog opens — not on mount, so a
  // Leads table with one mounted dialog per row doesn't fan out a fetch storm on load.
  const optionsLoadedRef = useRef(false);
  useEffect(() => {
    if (!open || optionsLoadedRef.current) return;
    optionsLoadedRef.current = true;
    getLeadSourcesAction()
      .then(setSources)
      .catch(() => setSources([]));
    getBatchesAction()
      .then(setBatches)
      .catch(() => setBatches([]));
    getMembershipPlansAction()
      .then(setPlans)
      .catch(() => setPlans([]));
  }, [open]);

  // Reset back to the seeded values (empty strings when there's no prefill) so reopening
  // the dialog for the same lead shows its details again.
  function reset() {
    setName(seededName);
    setPhone(seededPhone);
    setGender(seededGender);
    setSourceId(seededSourceId);
    setBatchId("");
    setMembershipPlanId("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (isSaving) return;
    if (isControlled) controlledOnOpenChange?.(next);
    else setUncontrolledOpen(next);
    if (!next) reset();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startSave(async () => {
      try {
        await createClientAction({
          name: name.trim(),
          phone: phone.trim() || undefined,
          gender: gender || undefined,
          sourceId: sourceId || undefined,
          batchId: batchId || undefined,
          membershipPlanId: membershipPlanId || undefined,
        });
        await onCreated?.();
        handleOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add client");
      }
    });
  }

  const canSubmit = name.trim().length > 0 && !isSaving;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger render={<Button size="lg" />}>
          <Plus />
          Add Client
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a client</DialogTitle>
          <DialogDescription>
            Add a client directly — they don&apos;t need a Yaaro account yet.
            They can link one later from their row in the clients list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogBody className="min-h-0 flex-1">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="client-name"
                className="text-sm font-medium text-foreground"
              >
                Name
              </label>
              <Input
                id="client-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                autoFocus
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="client-phone"
                className="text-sm font-medium text-foreground"
              >
                Phone
              </label>
              <Input
                id="client-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Source
              </span>
              <Select<string>
                value={sourceId || NO_SOURCE}
                onValueChange={(value) =>
                  setSourceId(!value || value === NO_SOURCE ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {(value: string) =>
                      value === NO_SOURCE
                        ? "No source"
                        : (sources.find((s) => s.id === value)?.name ??
                          "No source")
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_SOURCE}>No source</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Batch{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <Select<string>
                value={batchId || NO_BATCH}
                onValueChange={(value) =>
                  setBatchId(!value || value === NO_BATCH ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {(value: string) =>
                      value === NO_BATCH
                        ? "No batch"
                        : (batches.find((b) => b.id === value)?.title ??
                          "No batch")
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_BATCH}>No batch</SelectItem>
                  {batches.map((batch) => {
                    const full = isBatchFull(batch);
                    return (
                      <SelectItem
                        key={batch.id}
                        value={batch.id}
                        disabled={full}
                      >
                        {batch.title} · {formatTime(batch.startTime)}–
                        {formatTime(batch.endTime)}
                        {full ? " (full)" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Membership plan{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <Select<string>
                value={membershipPlanId || NO_PLAN}
                onValueChange={(value) =>
                  setMembershipPlanId(!value || value === NO_PLAN ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {(value: string) =>
                      value === NO_PLAN
                        ? "No plan"
                        : (plans.find((p) => p.id === value)?.title ??
                          "No plan")
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
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Gender
              </span>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((option) => {
                  const active = gender === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setGender(active ? "" : option)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </DialogBody>

          <DialogFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={!canSubmit}>
              {isSaving ? "Adding…" : "Add client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
