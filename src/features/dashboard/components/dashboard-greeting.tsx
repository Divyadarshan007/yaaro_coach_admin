export function DashboardGreeting({ name }: { name: string }) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">
        Hello, {name} 👋
      </h1>
      <p className="text-sm text-muted-foreground">
        Get an overview of your clients&apos; progress.
      </p>
    </div>
  );
}
