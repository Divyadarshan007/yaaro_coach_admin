import { CurrentSubscriptionCard } from "@/features/studio-subscription/components/current-subscription-card";
import { StudioSettings } from "@/features/team/components/studio-settings";
import { getCurrentStudioSubscription } from "@/lib/api/studio-subscriptions";
import { getTeam } from "@/lib/api/team";

export default async function StudioPage() {
  const [team, subscription] = await Promise.all([getTeam(), getCurrentStudioSubscription()]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-medium text-foreground">Studio</h1>
        <p className="text-sm text-muted-foreground">
          Manage your studio&apos;s name, photo, contact details and time slots
        </p>
      </div>

      <div className="mb-6">
        <CurrentSubscriptionCard subscription={subscription} />
      </div>

      <StudioSettings team={team} />
    </div>
  );
}
