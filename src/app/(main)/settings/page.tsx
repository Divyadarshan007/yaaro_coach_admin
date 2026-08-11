import { SettingsView } from "@/features/settings/components/settings-view";
import { getClients } from "@/lib/api/clients";
import { getCoachProfile } from "@/lib/api/coach";

export default async function SettingsPage() {
  const [coachProfile, clients] = await Promise.all([getCoachProfile(), getClients()]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-medium text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Update personal details and manage your plan</p>
      </div>

      <SettingsView coachProfile={coachProfile} clients={clients} />
    </div>
  );
}
