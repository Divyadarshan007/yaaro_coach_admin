"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateBatchAction } from "@/features/batch/actions";
import {
  BatchForm,
  batchToForm,
  formToInput,
  isBatchFormValid,
} from "@/features/batch/components/batch-form";
import type { Batch, BatchFormValues } from "@/features/batch/types/batch";

export function EditBatchView({ batch }: { batch: Batch }) {
  const router = useRouter();
  const [values, setValues] = useState<BatchFormValues>(() => batchToForm(batch));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(patch: Partial<BatchFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateBatchAction(batch.id, formToInput(values));
        router.push("/batch");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update batch");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link href="/batch" className="w-fit text-sm text-muted-foreground hover:text-foreground">
          Batch
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/batch"
            aria-label="Back"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Edit batch</h1>
            <p className="text-sm text-muted-foreground">Update this batch&apos;s schedule and limit.</p>
          </div>
        </div>
      </div>

      <BatchForm values={values} onChange={handleChange} disabled={isPending} />
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-row justify-end gap-2">
        <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/batch" />}>
          Cancel
        </Button>
        <Button size="lg" onClick={handleSave} disabled={isPending || !isBatchFormValid(values)}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
