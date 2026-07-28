import { Button } from "@/components/ui/button";
import { Meter } from "@/components/shared/meter";

const TRIAL_TOTAL_DAYS = 30;
const TRIAL_DAYS_LEFT = 29;

export function TrialBanner() {
  const percentElapsed = ((TRIAL_TOTAL_DAYS - TRIAL_DAYS_LEFT) / TRIAL_TOTAL_DAYS) * 100;

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-sidebar-foreground/5 p-3">
      <p className="text-sm text-sidebar-foreground/80">
        {TRIAL_DAYS_LEFT} days left on your trial, upgrade to keep full access.
      </p>
      <Meter value={percentElapsed} />
      <Button className="w-full">Upgrade Now</Button>
    </div>
  );
}
