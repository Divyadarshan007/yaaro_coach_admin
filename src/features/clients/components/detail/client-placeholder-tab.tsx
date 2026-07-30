import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

type ClientPlaceholderTabProps = {
  icon: LucideIcon;
  title: string;
};

export function ClientPlaceholderTab({ icon, title }: ClientPlaceholderTabProps) {
  return (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <EmptyState icon={icon} title={title} description="This section is coming soon." className="py-16" />
    </div>
  );
}
