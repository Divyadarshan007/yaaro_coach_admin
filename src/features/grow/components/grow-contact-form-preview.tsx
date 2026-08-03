export function GrowContactFormPreview() {
  return (
    <div className="hidden w-full max-w-70 shrink-0 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 sm:block">
      <div className="flex h-16 items-center justify-center bg-muted text-xs text-muted-foreground">
        Your Cover Image will be here
      </div>
      <div className="flex flex-col gap-3 p-3">
        <div className="h-2 w-2/3 rounded-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-6 rounded-md border border-input" />
          <div className="h-6 rounded-md border border-input" />
          <div className="h-10 rounded-md border border-input" />
        </div>
        <div className="h-6 w-1/3 rounded-md bg-primary/80" />
      </div>
    </div>
  );
}
