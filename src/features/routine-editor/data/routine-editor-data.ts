// Select `value`s are seconds-as-strings (Select works with string values) — parsed back
// to a number when persisted onto exercise.restSeconds.
export const REST_TIMER_OPTIONS = [
  { value: "0", label: "Off" },
  { value: "30", label: "30s" },
  { value: "60", label: "1min" },
  { value: "90", label: "1min 30s" },
  { value: "120", label: "2min" },
  { value: "180", label: "3min" },
  { value: "300", label: "5min" },
];
