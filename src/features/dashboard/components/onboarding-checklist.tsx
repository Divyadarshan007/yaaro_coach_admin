import { onboardingSteps } from "@/features/dashboard/data/dashboard-mock-data";
import { OnboardingChecklistItem } from "@/features/dashboard/components/onboarding-checklist-item";

export function OnboardingChecklist() {
  return (
    <div className="flex flex-col gap-1">
      {onboardingSteps.map((step) => (
        <OnboardingChecklistItem key={step.id} step={step} />
      ))}
    </div>
  );
}
