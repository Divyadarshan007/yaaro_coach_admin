"use server";

import { revalidatePath } from "next/cache";

import {
  createBatch,
  deleteBatch,
  getBatches,
  updateBatch,
} from "@/lib/api/batches";
import type {
  Batch,
  CreateBatchInput,
  UpdateBatchInput,
} from "@/features/batch/types/batch";

// Reused outside the Batch feature — the Clients "Add Client" form and the row's
// "Assign batch" dialog both need the coach's batch list.
export async function getBatchesAction(): Promise<Batch[]> {
  return getBatches();
}

export async function createBatchAction(
  input: CreateBatchInput,
): Promise<Batch> {
  const batch = await createBatch(input);
  revalidatePath("/batch");
  return batch;
}

export async function updateBatchAction(
  id: string,
  patch: UpdateBatchInput,
): Promise<Batch> {
  const batch = await updateBatch(id, patch);
  revalidatePath("/batch");
  return batch;
}

export async function deleteBatchAction(id: string): Promise<void> {
  await deleteBatch(id);
  revalidatePath("/batch");
}
