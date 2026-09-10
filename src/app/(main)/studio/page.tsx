import { StudioSettings } from "@/features/team/components/studio-settings";
import { getCurrentStudioSubscription } from "@/lib/api/studio-subscriptions";
import { getTeam } from "@/lib/api/team";

export default async function StudioPage() {
  const [team, subscription] = await Promise.all([
    getTeam(),
    getCurrentStudioSubscription(),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-medium text-foreground">
          Studio
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your studio&apos;s name, photo, contact details and time slots
        </p>
      </div>

      <StudioSettings team={team} subscription={subscription} />
    </div>
  );
}
