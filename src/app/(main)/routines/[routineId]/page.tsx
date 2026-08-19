import { RoutineEditorView } from "@/features/routine-editor/components/routine-editor-view";
import { getRoutine } from "@/lib/api/routines";
import { getExerciseCatalog } from "@/lib/api/exercises";

export default async function LibraryRoutineEditorPage({ params }: { params: Promise<{ routineId: string }> }) {
  const { routineId } = await params;
  const [routine, exerciseCatalog] = await Promise.all([getRoutine(routineId), getExerciseCatalog()]);

  return <RoutineEditorView programTitle="" initialRoutine={routine} exerciseCatalog={exerciseCatalog} />;
}
