import { buildMuscleLookup, getDistinctMuscleGroups, type MuscleCatalogEntry } from "@/lib/muscle-groups";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";
import type { MuscleDistributionAxis, MuscleGroupSetCount, Routine } from "@/features/program-editor/types/program-editor";

export function computeProgramSummary(
  routines: Routine[],
  exerciseCatalogById: Map<string, ExerciseCatalogEntry>,
  muscleCatalog: MuscleCatalogEntry[]
): {
  totalExercises: number;
  totalSets: number;
  distributionAxes: MuscleDistributionAxis[];
  muscleGroupSetCounts: MuscleGroupSetCount[];
} {
  const exercises = routines.flatMap((routine) => routine.exercises);
  const totalExercises = exercises.length;
  const totalSets = exercises.reduce((sum, exercise) => sum + exercise.set.length, 0);
  const muscleLookup = buildMuscleLookup(muscleCatalog);

  const setsByMuscle = new Map<string, number>();
  const setsByGroup = new Map<string, number>();
  for (const exercise of exercises) {
    const muscleId = exerciseCatalogById.get(exercise.exerciseId)?.muscleId?._id;
    if (!muscleId) continue;
    setsByMuscle.set(muscleId, (setsByMuscle.get(muscleId) ?? 0) + exercise.set.length);

    const groupId = muscleLookup[muscleId]?.muscleGroupId;
    if (groupId) {
      setsByGroup.set(groupId, (setsByGroup.get(groupId) ?? 0) + exercise.set.length);
    }
  }

  const muscleGroupSetCounts: MuscleGroupSetCount[] = [...setsByMuscle.entries()].map(([muscleId, sets]) => ({
    id: muscleId,
    muscleGroup: muscleLookup[muscleId]?.name ?? "Unknown",
    sets,
  }));

  const distributionAxes: MuscleDistributionAxis[] = getDistinctMuscleGroups(muscleCatalog).map((group) => ({
    id: group.id,
    label: group.label,
    sets: setsByGroup.get(group.id) ?? 0,
  }));

  return { totalExercises, totalSets, distributionAxes, muscleGroupSetCounts };
}
