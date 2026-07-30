"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NotesCard() {
  const [note, setNote] = useState("");

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground">
            <HelpCircle className="size-4" />
          </TooltipTrigger>
          <TooltipContent>Notes are only visible to you and your team.</TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder='Add notes about this client, e.g. "Has a history of knee pain"'
          className="min-h-24"
        />
      </CardContent>
    </Card>
  );
}
