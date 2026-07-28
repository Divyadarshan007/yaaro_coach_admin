import type { OnboardingStep, StatCardData, WeeklyChartAxis } from "@/features/dashboard/types/dashboard";

export const coachDisplayName = "Divyadarshan";

export const onboardingSteps: OnboardingStep[] = [
  { id: "create-program", step: 1, label: "Create a program", href: "#" },
  { id: "invite-client", step: 2, label: "Invite a client", href: "#" },
  { id: "assign-program", step: 3, label: "Assign a program", href: "#" },
];

export const statCards: StatCardData[] = [
  { id: "total-clients", title: "Total Clients", value: 0, href: "#" },
  { id: "active-clients", title: "Active clients last 7 days", value: 0, href: "#" },
  { id: "inactive-clients", title: "Inactive clients last 7 days", value: 0, href: "#" },
];

export const weeklyChartAxis: WeeklyChartAxis = {
  yTicks: [15, 10, 5, 0],
  weekLabels: ["Oct 5", "Jan 9", "Apr 17", "Jul 3", "Jul 12", "Jul 28", "Aug 24"],
};
