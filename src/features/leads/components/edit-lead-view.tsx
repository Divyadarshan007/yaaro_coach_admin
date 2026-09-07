"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateLeadAction } from "@/features/leads/actions";
import { LeadForm } from "@/features/leads/components/lead-form";
import { formToInput, isLeadFormValid, leadToForm } from "@/features/leads/lib/format";
import type { CoachLead, CoachLeadFormValues, LeadSource } from "@/features/leads/types/lead";

export function EditLeadView({ lead, sources }: { lead: CoachLead; sources: LeadSource[] }) {
  const router = useRouter();
  const [values, setValues] = useState<CoachLeadFormValues>(() => leadToForm(lead));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(patch: Partial<CoachLeadFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateLeadAction(lead.id, formToInput(values));
        router.push("/leads");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update lead");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link href="/leads" className="w-fit text-sm text-muted-foreground hover:text-foreground">
          Leads
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            aria-label="Back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Edit lead</h1>
            <p className="text-sm text-muted-foreground">Update this lead&apos;s details and status.</p>
          </div>
        </div>
      </div>

      <LeadForm values={values} onChange={handleChange} sources={sources} disabled={isPending} />
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-row justify-end gap-2">
        <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/leads" />}>
          Cancel
        </Button>
        <Button size="lg" onClick={handleSave} disabled={isPending || !isLeadFormValid(values)}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
