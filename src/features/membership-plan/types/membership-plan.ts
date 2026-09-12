// Mirrors the membershipPlan model in yaaro_backend (src/models/membership_plan.js)
// and src/routes/coach/controllers/membership_plan_ctrl.js.

export const VALIDITY_TYPES = ["day", "month", "year"] as const;
export type ValidityType = (typeof VALIDITY_TYPES)[number];

export const VALIDITY_TYPE_LABELS: Record<ValidityType, string> = {
  day: "Day",
  month: "Month",
  year: "Year",
};

export type MembershipPlan = {
  id: string;
  title: string;
  validity: number;
  validityType: ValidityType;
  price: number;
  // Clients currently on this plan whose membership hasn't expired yet — computed by
  // the backend on read, not stored.
  activeMemberCount: number;
  createdAt?: string;
  updatedAt?: string;
};

// Form state — number fields kept as strings so the inputs can be empty mid-edit.
export type MembershipPlanFormValues = {
  title: string;
  validity: string;
  validityType: ValidityType;
  price: string;
};

export type CreateMembershipPlanInput = {
  title: string;
  validity: number;
  validityType: ValidityType;
  price: number;
};

export type UpdateMembershipPlanInput = Partial<CreateMembershipPlanInput>;
