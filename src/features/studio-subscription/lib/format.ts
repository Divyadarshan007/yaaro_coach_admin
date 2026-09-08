// 30 -> "30 days"
export function formatDuration(durationInDays: number): string {
  return `${durationInDays} day${durationInDays === 1 ? "" : "s"}`;
}

// 6000 -> "₹6,000"
export function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// "2026-09-08T00:00:00.000Z" -> "8 Sep 2026"
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
