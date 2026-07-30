import type { ReactNode } from "react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProgramCard({
  title,
  description,
  workouts,
  action,
  onClick,
}: {
  title: string;
  description: string;
  workouts: string[];
  action: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={onClick ? "cursor-pointer" : undefined}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction onClick={(event) => event.stopPropagation()}>{action}</CardAction>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {workouts.map((workout, index) => (
          <span
            key={`${index}-${workout}`}
            className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
          >
            {workout}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
