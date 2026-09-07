import type {
  CoachLead,
  CoachLeadFormValues,
  CreateCoachLeadInput,
} from "@/features/leads/types/lead";

export function formatLeadDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function emptyLeadForm(): CoachLeadFormValues {
  return {
    name: "",
    number: "",
    sourceId: "",
    date: new Date(),
    status: "pending",
    notes: "",
  };
}

export function leadToForm(lead: CoachLead): CoachLeadFormValues {
  const date = new Date(lead.date);
  return {
    name: lead.name,
    number: lead.number,
    sourceId: lead.sourceId ?? "",
    date: Number.isNaN(date.getTime()) ? new Date() : date,
    status: lead.status,
    notes: lead.notes,
  };
}

export function formToInput(values: CoachLeadFormValues): CreateCoachLeadInput {
  return {
    name: values.name.trim(),
    number: values.number.trim(),
    sourceId: values.sourceId ? values.sourceId : null,
    date: values.date.toISOString(),
    status: values.status,
    notes: values.notes.trim(),
  };
}

export function isLeadFormValid(values: CoachLeadFormValues): boolean {
  return values.name.trim().length > 0 && values.number.trim().length > 0;
}
