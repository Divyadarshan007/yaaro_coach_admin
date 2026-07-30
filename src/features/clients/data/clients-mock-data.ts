import type { AvatarInfo, Client } from "@/features/clients/types/client";
import { getLastSevenDaysActivity } from "@/features/clients/lib/week-activity";

export const dev: AvatarInfo = { name: "Dev", initials: "D", colorClassName: "bg-muted text-muted-foreground" };
export const h1Gyms: AvatarInfo = { name: "H1 Gyms", initials: "H1", colorClassName: "bg-red-600 text-white" };

export const bigbitesAvatar: AvatarInfo = { name: "bigbites", initials: "D", colorClassName: "bg-blue-500 text-white" };
export const johnDoeAvatar: AvatarInfo = { name: "John Doe", initials: "JD", colorClassName: "bg-amber-500 text-white" };
export const kapilSinghAvatar: AvatarInfo = {
  name: "Kapil Singh",
  initials: "KS",
  colorClassName: "bg-emerald-500 text-white",
};

export function getMockClients(): Client[] {
  const today = new Date();

  return [
    {
      id: "bigbites",
      avatar: bigbitesAvatar,
      programName: "Push/Pull/Legs - Beginner - 3 Day Split",
      programWeekLabel: "Week 1 out of 2",
      weeklyActivity: getLastSevenDaysActivity(today, [2]),
      status: "active",
      coach: dev,
    },
    {
      id: "john-doe",
      avatar: johnDoeAvatar,
      programName: "Full Body x3",
      programWeekLabel: "Week 3 out of 4",
      weeklyActivity: getLastSevenDaysActivity(today, [6, 4, 2]),
      status: "sample",
      coach: h1Gyms,
    },
    {
      id: "kapil-singh",
      avatar: kapilSinghAvatar,
      programName: "Push/Pull/Legs (Home Edition) - Beginner - 3 Day Split",
      weeklyActivity: getLastSevenDaysActivity(today, [2]),
      status: "active",
      coach: h1Gyms,
    },
  ];
}
