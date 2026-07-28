import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number | string;
  href?: string;
  className?: string;
};

export function StatCard({ title, value, href = "#", className }: StatCardProps) {
  return (
    <Card className={cn("gap-3 p-5", className)}>
      <Link
        href={href}
        className="flex items-center justify-between gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>{title}</span>
        <ChevronRight className="size-4 shrink-0" />
      </Link>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}
