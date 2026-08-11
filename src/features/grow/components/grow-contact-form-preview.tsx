import { User } from "lucide-react";

// A miniature, non-interactive mock of the real public form at app/[slug]/join —
// mirrors its copy and field set (grow-join-form.tsx) so this preview doesn't drift
// from what a prospective client actually sees.
function PreviewField({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-medium text-foreground">{label}</span>
      <div className="h-5 rounded-md border border-input bg-background" />
    </div>
  );
}

export function GrowContactFormPreview() {
  return (
    <div className="hidden w-full max-w-70 shrink-0 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 sm:block">
      <div className="flex h-16 items-center justify-center bg-muted text-xs text-muted-foreground">
        Your Cover Image will be here
      </div>
      <div className="flex flex-col gap-3 p-3">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User className="size-4" />
          </div>
          <p className="text-[10px] font-medium text-foreground">
            Hi there! Use the form below to reach out and start your fitness journey.
          </p>
          <p className="text-[9px] text-muted-foreground">Your Name</p>
        </div>

        <div className="flex flex-col gap-2">
          <PreviewField label="Full Name" />
          <PreviewField label="Email" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-medium text-foreground">Message</span>
            <div className="h-9 rounded-md border border-input bg-background" />
          </div>
        </div>

        <div className="h-6 w-full rounded-md bg-primary/80" />
      </div>
    </div>
  );
}
