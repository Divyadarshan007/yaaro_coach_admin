import { FitnessCenterSettings } from "@/features/team/components/fitness-center-settings";
import { getTeam } from "@/lib/api/team";

export default async function FitnessCenterPage() {
  const team = await getTeam();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-medium text-foreground">Fitness Center</h1>
        <p className="text-sm text-muted-foreground">
          Manage your fitness center&apos;s name, photo, contact details and time slots
        </p>
      </div>

      <FitnessCenterSettings team={team} />
    </div>
  );
}
