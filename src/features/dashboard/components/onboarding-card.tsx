import { Card } from "@/components/ui/card";
import { OnboardingChecklist } from "@/features/dashboard/components/onboarding-checklist";
import { OnboardingPreviewGraphic } from "@/features/dashboard/components/onboarding-preview-graphic";

export function OnboardingCard() {
  return (
    <Card className="flex-col overflow-hidden p-0 md:flex-row">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h2 className="text-base font-semibold text-foreground">Let&apos;s get started</h2>
        <OnboardingChecklist />
      </div>
      <div className="flex shrink-0 flex-col items-center justify-center gap-4 bg-secondary p-6 md:w-72">
        <OnboardingPreviewGraphic />
        <p className="text-sm font-semibold text-foreground">Read Getting Started Guide</p>
      </div>
    </Card>
  );
}
