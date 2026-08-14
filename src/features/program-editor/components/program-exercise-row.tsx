import { useExerciseCatalogEntry } from "@/lib/exercise-catalog-store";
import type { RoutineExercise } from "@/features/program-editor/types/program-editor";

export function ProgramExerciseRow({ exercise }: { exercise: RoutineExercise }) {
  const catalogEntry = useExerciseCatalogEntry(exercise.exerciseId);

  return (
    <p className="text-sm text-muted-foreground">
      {exercise.set.length}× {catalogEntry?.name ?? "Exercise"}
    </p>
  );
}
