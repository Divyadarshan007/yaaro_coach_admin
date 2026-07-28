export function OnboardingPreviewGraphic() {
  return (
    <div className="w-full max-w-55 rounded-xl bg-card p-3 shadow-sm ring-1 ring-foreground/10">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-muted" />
        <span className="size-2 rounded-full bg-muted" />
        <span className="size-2 rounded-full bg-muted" />
      </div>
      <div className="mb-3 h-2 w-2/3 rounded-full bg-muted" />
      <div className="mb-4 h-2 w-1/2 rounded-full bg-muted" />
      <div className="flex h-16 items-end gap-1.5">
        {[40, 65, 30, 80, 55, 90].map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className="w-full rounded-t-sm bg-primary/80 first:bg-primary/40 last:bg-primary"
          />
        ))}
      </div>
    </div>
  );
}
