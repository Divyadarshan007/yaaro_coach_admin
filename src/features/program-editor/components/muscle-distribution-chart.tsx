import type { MuscleDistributionAxis } from "@/features/program-editor/types/program-editor";

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 78;
const GRID_RINGS = 3;
const MAX_SETS_SCALE = 10;

function pointForAxis(index: number, total: number, valueRatio: number) {
  const angle = (Math.PI / 180) * (-90 + (360 / total) * index);
  const radius = RADIUS * valueRatio;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export function MuscleDistributionChart({ axes }: { axes: MuscleDistributionAxis[] }) {
  const total = axes.length;

  const dataPoints = axes
    .map((axis, index) => pointForAxis(index, total, Math.min(axis.sets, MAX_SETS_SCALE) / MAX_SETS_SCALE))
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-52">
      {Array.from({ length: GRID_RINGS }, (_, ringIndex) => {
        const ratio = (ringIndex + 1) / GRID_RINGS;
        const points = axes
          .map((_, index) => pointForAxis(index, total, ratio))
          .map((point) => `${point.x},${point.y}`)
          .join(" ");
        return <polygon key={ratio} points={points} className="fill-none stroke-border" strokeWidth={1} />;
      })}

      {axes.map((axis, index) => {
        const point = pointForAxis(index, total, 1);
        return (
          <line
            key={axis.id}
            x1={CENTER}
            y1={CENTER}
            x2={point.x}
            y2={point.y}
            className="stroke-border"
            strokeWidth={1}
          />
        );
      })}

      <polygon points={dataPoints} className="fill-primary/15 stroke-primary" strokeWidth={1.5} />

      {axes.map((axis, index) => {
        const point = pointForAxis(index, total, 1.22);
        return (
          <text
            key={axis.id}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[9px] font-medium"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
