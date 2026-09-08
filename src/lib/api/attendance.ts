import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";

export type AttendanceCheckIn = {
  userId: string;
  name: string;
  avatar: string;
  checkInAt: string;
};

export type Attendance = {
  centerId: string;
  centerName: string;
  qrValue: string;
  date: string;
  todayCount: number;
  todayCheckIns: AttendanceCheckIn[];
};

export async function getAttendance(): Promise<Attendance> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/attendance`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch attendance (${res.status})`);
  return res.json();
}
