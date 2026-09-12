import { AttendanceCard } from "@/features/attendance/components/attendance-card";
import { AutoRefresh } from "@/features/attendance/components/auto-refresh";
import { TodayCheckIns } from "@/features/attendance/components/today-check-ins";
import { getAttendance } from "@/lib/api/attendance";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const attendance = await getAttendance();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-medium text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Show this code at your front desk. Members scan it from the yaaro app to mark
          today&apos;s attendance.
        </p>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <AttendanceCard studioName={attendance.studioName} qrValue={attendance.qrValue} />
        <TodayCheckIns
          date={attendance.date}
          count={attendance.todayCount}
          checkIns={attendance.todayCheckIns}
        />
      </div>

      <AutoRefresh intervalMs={15000} />
    </div>
  );
}
