import {
  bigbitesAvatar,
  dev,
  h1Gyms,
  johnDoeAvatar,
  kapilSinghAvatar,
} from "@/features/clients/data/clients-mock-data";
import type { ClientDetail, StatSummary } from "@/features/clients/types/client-detail";

const WEEK_LABELS = ["May 10", "May 31", "Jun 21", "Jul 12", "Jul 26"];

function buildWeeklyStat(label: string, displayValue: string, values: number[]): StatSummary {
  return {
    label,
    displayValue,
    subLabel: "This week",
    data: WEEK_LABELS.map((weekLabel, index) => ({ label: weekLabel, value: values[index] ?? 0 })),
  };
}

const CLIENT_DETAILS: Record<string, ClientDetail> = {
  "kapil-singh": {
    id: "kapil-singh",
    avatar: kapilSinghAvatar,
    name: "Kapil Singh",
    email: "singhkapil708@gmail.com",
    coach: h1Gyms,
    coachedSinceLabel: "Coached since Jul 28, 2026",
    workoutProgram: {
      name: "Push/Pull/Legs (Home Edition) - Beginner - 3 Day Split",
      routineCount: 3,
      startDateLabel: "Jul 28, 2026",
    },
    activities: [
      {
        id: "kapil-a1",
        avatar: kapilSinghAvatar,
        segments: [
          { text: "Kapil Singh " },
          { text: "added a new weight: " },
          { text: "65 kg", emphasis: true },
        ],
        timestamp: "Yesterday at 12:00 AM",
      },
      {
        id: "kapil-a2",
        avatar: kapilSinghAvatar,
        segments: [
          { text: "Kapil Singh " },
          { text: "has completed a 1h 9min " },
          { text: "Upper A", emphasis: true },
          { text: " workout and lifted 4,370 kg over 23 sets." },
        ],
        timestamp: "Tuesday, July 28, 2026",
      },
      {
        id: "kapil-a3",
        avatar: kapilSinghAvatar,
        segments: [
          { text: "Kapil Singh " },
          { text: "has completed a 55min " },
          { text: "Biceps Day 💪", emphasis: true },
          { text: " workout and lifted 3,580 kg over 15 sets." },
        ],
        timestamp: "Thursday, June 11, 2026",
      },
      {
        id: "kapil-a4",
        avatar: kapilSinghAvatar,
        segments: [
          { text: "A new " },
          { text: "Progress Picture", emphasis: true },
          { text: " has been added by Kapil Singh." },
        ],
        timestamp: "Sunday, January 25, 2026",
      },
    ],
    duration: buildWeeklyStat("Duration", "1h 9min", [0, 50, 0, 0, 69]),
    volume: buildWeeklyStat("Volume", "4,370 kg", [0, 3130, 0, 0, 4370]),
    sets: buildWeeklyStat("Set", "23 sets", [0, 15, 0, 0, 23]),
    bodyweight: {
      currentValue: 65,
      unit: "kg",
      data: [
        { label: "Sep 20, 2025", value: 65 },
        { label: "Jan 25", value: 30 },
        { label: "Jul 29", value: 65 },
      ],
    },
    progressPictures: [{ id: "kapil-p1", dateLabel: "2026-01-25", weightLabel: "30 kg" }],
  },
  "john-doe": {
    id: "john-doe",
    avatar: johnDoeAvatar,
    name: "John Doe",
    email: "sample.client@yaarocoach.com",
    coach: h1Gyms,
    coachedSinceLabel: "Coached since Jul 24, 2026",
    workoutProgram: { name: "Full Body x3", routineCount: 3, startDateLabel: "Jul 24, 2026" },
    activities: [
      {
        id: "john-a1",
        avatar: johnDoeAvatar,
        segments: [
          { text: "John Doe " },
          { text: "has completed a 48min " },
          { text: "Full Body A", emphasis: true },
          { text: " workout and lifted 2,860 kg over 18 sets." },
        ],
        timestamp: "Tuesday, July 28, 2026",
      },
    ],
    duration: buildWeeklyStat("Duration", "48min", [0, 0, 0, 0, 48]),
    volume: buildWeeklyStat("Volume", "2,860 kg", [0, 0, 0, 0, 2860]),
    sets: buildWeeklyStat("Set", "18 sets", [0, 0, 0, 0, 18]),
    bodyweight: {
      currentValue: 78,
      unit: "kg",
      data: [
        { label: "May 10", value: 80 },
        { label: "Jun 21", value: 79 },
        { label: "Jul 29", value: 78 },
      ],
    },
    progressPictures: [],
  },
  bigbites: {
    id: "bigbites",
    avatar: bigbitesAvatar,
    name: "bigbites",
    email: "bigbites@example.com",
    coach: dev,
    coachedSinceLabel: "Coached since Jul 1, 2026",
    workoutProgram: {
      name: "Push/Pull/Legs - Beginner - 3 Day Split",
      routineCount: 3,
      startDateLabel: "Jul 1, 2026",
    },
    activities: [
      {
        id: "bigbites-a1",
        avatar: bigbitesAvatar,
        segments: [
          { text: "bigbites " },
          { text: "has completed a 1h 2min " },
          { text: "Pull Day", emphasis: true },
          { text: " workout and lifted 3,910 kg over 21 sets." },
        ],
        timestamp: "Tuesday, July 28, 2026",
      },
    ],
    duration: buildWeeklyStat("Duration", "1h 2min", [40, 55, 0, 62, 62]),
    volume: buildWeeklyStat("Volume", "3,910 kg", [2600, 3400, 0, 3800, 3910]),
    sets: buildWeeklyStat("Set", "21 sets", [16, 19, 0, 20, 21]),
    bodyweight: {
      currentValue: 82,
      unit: "kg",
      data: [
        { label: "May 10", value: 85 },
        { label: "Jun 21", value: 83 },
        { label: "Jul 29", value: 82 },
      ],
    },
    progressPictures: [{ id: "bigbites-p1", dateLabel: "2026-07-01", weightLabel: "85 kg" }],
  },
};

export function getClientDetail(id: string): ClientDetail | undefined {
  return CLIENT_DETAILS[id];
}
