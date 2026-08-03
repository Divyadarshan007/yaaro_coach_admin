import type { ExerciseListEntry } from "@/features/clients/types/exercise-stats";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

// Derives a "recently performed" list from the client's own logged workout feeds
// (most recent session first, deduped by exercise) rather than an aggregate backend endpoint.
export function getRecentExercisesFromFeeds(
  feeds: FeedItem[],
  catalog: ExerciseCatalogEntry[]
): ExerciseListEntry[] {
  const muscleById = new Map(catalog.map((entry) => [entry._id, entry.muscleId?.name ?? null]));
  const sortedFeeds = [...feeds].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const seen = new Set<string>();
  const recent: ExerciseListEntry[] = [];
  for (const feed of sortedFeeds) {
    for (const exercise of feed.exercises) {
      if (seen.has(exercise.id)) continue;
      seen.add(exercise.id);
      recent.push({
        id: exercise.id,
        name: exercise.title,
        thumbnailUrl: exercise.thumbnailUrl,
        muscleGroup: muscleById.get(exercise.id) ?? null,
      });
    }
  }
  return recent;
}
