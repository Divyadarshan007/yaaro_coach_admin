import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { AttendanceCheckIn } from "@/lib/api/attendance";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function formatDateLabel(localDate: string): string {
  // localDate is "YYYY-MM-DD" in IST — render it without a timezone shift.
  const [y, m, d] = localDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function TodayCheckIns({
  date,
  count,
  checkIns,
}: {
  date: string;
  count: number;
  checkIns: AttendanceCheckIn[];
}) {
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10">
      <div className="flex items-baseline justify-between border-b border-foreground/10 px-5 py-4">
        <div>
          <h2 className="font-heading text-base font-medium text-foreground">Today&apos;s check-ins</h2>
          <p className="text-xs text-muted-foreground">{formatDateLabel(date)}</p>
        </div>
        <span className="font-heading text-2xl font-medium text-foreground">{count}</span>
      </div>

      {checkIns.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">
          No one has checked in yet today.
        </p>
      ) : (
        <ul className="divide-y divide-foreground/5">
          {checkIns.map((c) => {
            const avatar = avatarFromName(c.name, c.userId);
            return (
              <li key={c.userId} className="flex items-center gap-3 px-5 py-3">
                <Avatar size="sm">
                  {c.avatar && <AvatarImage src={c.avatar} alt={c.name} />}
                  <AvatarFallback className={avatar.colorClassName}>{avatar.initials}</AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-sm text-foreground">{c.name}</span>
                <span className="text-xs text-muted-foreground">{formatTime(c.checkInAt)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
