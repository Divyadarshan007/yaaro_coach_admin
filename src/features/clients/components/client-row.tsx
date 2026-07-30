"use client";

import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ClientWeekActivity } from "@/features/clients/components/client-week-activity";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { cn } from "@/lib/utils";
import type { Client } from "@/features/clients/types/client";

const STATUS_LABEL: Record<Client["status"], string> = {
  active: "Active",
  sample: "Sample Client",
};

export function ClientRow({ client }: { client: Client }) {
  const router = useRouter();

  return (
    <TableRow className="cursor-pointer" onClick={() => router.push(`/clients/${client.id}`)}>
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-3">
          <PersonAvatar avatar={client.avatar} />
          <span className="max-w-40 truncate text-sm font-medium text-foreground">
            {client.avatar.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="max-w-xs px-4 py-3 whitespace-normal">
        <p className="text-sm font-medium wrap-break-word text-foreground">{client.programName}</p>
        {client.programWeekLabel && <p className="text-sm text-muted-foreground">{client.programWeekLabel}</p>}
      </TableCell>

      <TableCell className="px-4 py-3">
        <ClientWeekActivity days={client.weeklyActivity} />
      </TableCell>

      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2">
          <PersonAvatar avatar={client.coach} size="sm" />
          <span className="max-w-30 truncate text-sm text-foreground">{client.coach.name}</span>
        </div>
      </TableCell>

      <TableCell className="px-4 py-3">
        <Badge
          variant="secondary"
          className={cn(
            "h-auto whitespace-normal rounded-md px-3 py-1.5 text-center leading-tight",
            client.status === "active" &&
              "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
          )}
        >
          {STATUS_LABEL[client.status]}
        </Badge>
      </TableCell>

      <TableCell className="px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Client actions"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreVertical />
        </Button>
      </TableCell>
    </TableRow>
  );
}
