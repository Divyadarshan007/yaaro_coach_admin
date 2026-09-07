"use client";

import { Settings2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LeadSourcesDialog } from "@/features/leads/components/lead-sources-dialog";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type CoachLeadFormValues,
  type LeadSource,
} from "@/features/leads/types/lead";

const NO_SOURCE = "__none__";

type LeadFormProps = {
  values: CoachLeadFormValues;
  onChange: (patch: Partial<CoachLeadFormValues>) => void;
  sources: LeadSource[];
  disabled?: boolean;
};

export function LeadForm({ values, onChange, sources, disabled }: LeadFormProps) {
  const [manageOpen, setManageOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          id="lead-name"
          value={values.name}
          disabled={disabled}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="Full name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-number" className="text-sm font-medium text-foreground">
          Number
        </label>
        <Input
          id="lead-number"
          type="tel"
          inputMode="tel"
          value={values.number}
          disabled={disabled}
          onChange={(event) => onChange({ number: event.target.value })}
          placeholder="Phone number"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Source</span>
        <div className="flex items-center gap-2">
          <Select<string>
            value={values.sourceId || NO_SOURCE}
            onValueChange={(value) =>
              onChange({ sourceId: !value || value === NO_SOURCE ? "" : value })
            }
          >
            <SelectTrigger className="flex-1">
              <SelectValue>
                {(value: string) =>
                  value === NO_SOURCE
                    ? "No source"
                    : sources.find((s) => s.id === value)?.name ?? "No source"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SOURCE}>No source</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => setManageOpen(true)}
          >
            <Settings2 />
            Manage
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Date</span>
        <DatePicker value={values.date} onChange={(date) => onChange({ date })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Status</span>
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.map((option) => {
            const active = values.status === option;
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onChange({ status: option })}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:bg-muted"
                )}
              >
                {LEAD_STATUS_LABELS[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-notes" className="text-sm font-medium text-foreground">
          Notes
        </label>
        <Textarea
          id="lead-notes"
          value={values.notes}
          disabled={disabled}
          onChange={(event) => onChange({ notes: event.target.value })}
          placeholder="Anything worth remembering about this lead"
        />
      </div>

      <LeadSourcesDialog open={manageOpen} onOpenChange={setManageOpen} sources={sources} />
    </div>
  );
}
