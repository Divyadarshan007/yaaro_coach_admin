import { RoutineEditorView } from "@/features/routine-editor/components/routine-editor-view";
import { getProgram } from "@/lib/api/programs";
import { getRoutine } from "@/lib/api/routines";
import { getExerciseCatalog } from "@/lib/api/exercises";

export default async function RoutineEditorPage({
  params,
}: {
  params: Promise<{ id: string; routineId: string }>;
}) {
  const { id, routineId } = await params;
  const [program, routine, exerciseCatalog] = await Promise.all([
    getProgram(id),
    getRoutine(routineId),
    getExerciseCatalog(),
  ]);

  return (
    <RoutineEditorView
      programId={id}
      programTitle={program?.title ?? ""}
      initialRoutine={routine}
      exerciseCatalog={exerciseCatalog}
    />
  );
}
