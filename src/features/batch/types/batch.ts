// Mirrors the batch model in yaaro_backend (src/models/batch.js) and the shapes
// returned by src/routes/coach/controllers/batch_ctrl.js.

export type BatchLimitType = "unlimited" | "limited";

export type Batch = {
  id: string;
  title: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  limitType: BatchLimitType;
  maxMembers: number | null;
  createdAt?: string;
  updatedAt?: string;
};

// Form state — maxMembers kept as a string so the number input can be empty
// while "Set limit" is selected but not yet filled in.
export type BatchFormValues = {
  title: string;
  startTime: string;
  endTime: string;
  limitType: BatchLimitType;
  maxMembers: string;
};

export type CreateBatchInput = {
  title: string;
  startTime: string;
  endTime: string;
  limitType: BatchLimitType;
  maxMembers?: number;
};

export type UpdateBatchInput = Partial<CreateBatchInput>;
