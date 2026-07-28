import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { OnboardingStep } from "@/features/dashboard/types/dashboard";

export function OnboardingChecklistItem({ step }: { step: OnboardingStep }) {
  return (
    <Link
      href={step.href}
      className="group flex items-center gap-3 rounded-lg py-1.5 text-sm font-medium text-foreground"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {step.step}
      </span>
      <span className="flex-1 group-hover:underline">{step.label}</span>
      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
