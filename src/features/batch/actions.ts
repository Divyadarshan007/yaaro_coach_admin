"use server";

import { revalidatePath } from "next/cache";

import { createBatch, deleteBatch, updateBatch } from "@/lib/api/batches";
import type { Batch, CreateBatchInput, UpdateBatchInput } from "@/features/batch/types/batch";

export async function createBatchAction(input: CreateBatchInput): Promise<Batch> {
  const batch = await createBatch(input);
  revalidatePath("/batch");
  return batch;
}

export async function updateBatchAction(id: string, patch: UpdateBatchInput): Promise<Batch> {
  const batch = await updateBatch(id, patch);
  revalidatePath("/batch");
  return batch;
}

export async function deleteBatchAction(id: string): Promise<void> {
  await deleteBatch(id);
  revalidatePath("/batch");
}
