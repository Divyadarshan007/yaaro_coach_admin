import { buildMuscleLookup, getDistinctMuscleGroups, type MuscleCatalogEntry } from "@/lib/muscle-groups";
import type {
  MuscleDistributionAxis,
  MuscleGroupSetCount,
  Program,
} from "@/features/program-editor/types/program-editor";

export function computeProgramSummary(
  program: Program,
  muscleCatalog: MuscleCatalogEntry[]
): {
  totalExercises: number;
  totalSets: number;
  distributionAxes: MuscleDistributionAxis[];
  muscleGroupSetCounts: MuscleGroupSetCount[];
} {
  const exercises = program.routines.flatMap((routine) => routine.exercises);
  const totalExercises = exercises.length;
  const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const muscleLookup = buildMuscleLookup(muscleCatalog);

  const setsByMuscle = new Map<string, number>();
  const setsByGroup = new Map<string, number>();
  for (const exercise of exercises) {
    if (!exercise.muscleId) continue;
    setsByMuscle.set(exercise.muscleId, (setsByMuscle.get(exercise.muscleId) ?? 0) + exercise.sets.length);

    const groupId = muscleLookup[exercise.muscleId]?.muscleGroupId;
    if (groupId) {
      setsByGroup.set(groupId, (setsByGroup.get(groupId) ?? 0) + exercise.sets.length);
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
