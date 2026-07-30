import { RoutineEditorView } from "@/features/routine-editor/components/routine-editor-view";
import { getProgram } from "@/lib/api/programs";
import { getExerciseCatalog } from "@/lib/api/exercises";

export default async function RoutineEditorPage({
  params,
}: {
  params: Promise<{ id: string; routineId: string }>;
}) {
  const { id, routineId } = await params;
  const [program, exerciseCatalog] = await Promise.all([getProgram(id), getExerciseCatalog()]);

  return <RoutineEditorView routineId={routineId} initialProgram={program} exerciseCatalog={exerciseCatalog} />;
}
