import { redirect } from "next/navigation";

import { acceptTeamInvite } from "@/lib/api/team";

export default async function AcceptTeamInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  try {
    await acceptTeamInvite(token);
  } catch {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-heading text-xl font-medium text-foreground">Invite not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This invite link is invalid or has already been used.
        </p>
      </div>
    );
  }

  redirect("/team");
}
