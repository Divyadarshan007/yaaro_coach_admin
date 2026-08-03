import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { GrowJoinForm } from "@/features/grow/components/grow-join-form";
import { getPublicCoachBySlug } from "@/lib/api/leads";

export default async function JoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coach = await getPublicCoachBySlug(slug);
  if (!coach) notFound();

  const avatar = avatarFromName(coach.name, coach.coachId);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar size="lg" className="size-16">
            {coach.avatar && <AvatarImage src={coach.avatar} alt={coach.name} />}
            <AvatarFallback className={avatar.colorClassName}>{avatar.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-medium text-foreground">
              Hi there! Use the form below to reach out and start your fitness journey.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{coach.name}</p>
          </div>
        </div>

        <div className="mt-6">
          <GrowJoinForm slug={slug} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">Created with Yaaro Coach</p>
      </div>
    </div>
  );
}
