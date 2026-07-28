export type OnboardingStep = {
  id: string;
  step: number;
  label: string;
  href: string;
};

export type StatCardData = {
  id: string;
  title: string;
  value: number;
  href: string;
};

export type WeeklyChartAxis = {
  yTicks: number[];
  weekLabels: string[];
};
