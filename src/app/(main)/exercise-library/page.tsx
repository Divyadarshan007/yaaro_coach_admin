import { ExerciseLibraryView } from "@/features/exercise-library/components/exercise-library-view";
import { getExerciseCatalog } from "@/lib/api/exercises";

export default async function ExerciseLibraryPage() {
  const catalog = await getExerciseCatalog();

  return <ExerciseLibraryView catalog={catalog} />;
}
