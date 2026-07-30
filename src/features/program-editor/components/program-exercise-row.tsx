import type { ProgramExercise } from "@/features/program-editor/types/program-editor";

export function ProgramExerciseRow({ exercise }: { exercise: ProgramExercise }) {
  return (
    <p className="text-sm text-muted-foreground">
      {exercise.sets.length}× {exercise.name}
    </p>
  );
}
