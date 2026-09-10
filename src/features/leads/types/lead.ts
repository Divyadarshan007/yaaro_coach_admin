// Mirrors the coachLead + leadSource models in yaaro_backend
// (src/models/coach_lead.js, src/models/lead_source.js) and
// src/routes/coach/controllers/{coach_lead_ctrl,lead_source_ctrl}.js.
// Separate from Grow's public-form `lead` (src/features/grow/types/grow.ts).

export const LEAD_STATUSES = ["pending", "inprogress", "converted"] as const;
export type CoachLeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<CoachLeadStatus, string> = {
  pending: "Pending",
  inprogress: "In progress",
  converted: "Converted",
};

export type LeadSource = {
  id: string;
  name: string;
};

export type CoachLead = {
  id: string;
  name: string;
  number: string;
  // Free-form ("Male" / "Female" / "Other" / ""), same as a client's gender — used to
  // prefill the Add-client form when a lead is converted.
  gender: string;
  sourceId: string | null;
  source: LeadSource | null;
  date: string; // ISO
  status: CoachLeadStatus;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

// Form state — kept as primitives so inputs can be mid-edit; date is a real Date.
export type CoachLeadFormValues = {
  name: string;
  number: string;
  gender: string; // "" = unset
  sourceId: string; // "" = no source
  date: Date;
  status: CoachLeadStatus;
  notes: string;
};

export type CreateCoachLeadInput = {
  name: string;
  number: string;
  gender: string;
  sourceId: string | null;
  date: string;
  status: CoachLeadStatus;
  notes: string;
};

export type UpdateCoachLeadInput = Partial<CreateCoachLeadInput>;

export type CreateLeadSourceInput = { name: string };
export type UpdateLeadSourceInput = { name: string };
