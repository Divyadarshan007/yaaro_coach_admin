import { GrowContactFormCard } from "@/features/grow/components/grow-contact-form-card";
import { GrowLeadsPanel } from "@/features/grow/components/grow-leads-panel";
import type { Lead } from "@/features/grow/types/grow";

export function GrowView({ slug, leads }: { slug: string; leads: Lead[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Grow</h1>
        <p className="text-sm text-muted-foreground">Expand your coaching business</p>
      </div>

      <GrowContactFormCard slug={slug} />
      <GrowLeadsPanel leads={leads} coachSlug={slug} />
    </div>
  );
}
