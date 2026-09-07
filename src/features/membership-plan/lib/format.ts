import type { MembershipPlan } from "@/features/membership-plan/types/membership-plan";

// "3" + "month" -> "3 months"
export function formatValidity(validity: number, validityType: string): string {
  return `${validity} ${validityType}${validity === 1 ? "" : "s"}`;
}

// 6000 -> "₹6,000"
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function planValidity(plan: MembershipPlan): string {
  return formatValidity(plan.validity, plan.validityType);
}
