import { notFound } from "next/navigation";

import { ClientRoutineEditorView } from "@/features/routine-editor/components/client-routine-editor-view";
import { getClient, getClientProgram } from "@/lib/api/clients";
import { getExerciseCatalog } from "@/lib/api/exercises";

export default async function ClientRoutineEditorPage({
  params,
}: {
  params: Promise<{ id: string; routineId: string }>;
}) {
  const { id, routineId } = await params;
  const [client, program, exerciseCatalog] = await Promise.all([
    getClient(id),
    getClientProgram(id),
    getExerciseCatalog(),
  ]);

  if (!client) {
    notFound();
  }

  return (
    <ClientRoutineEditorView
      clientId={id}
      clientName={client.name}
      routineId={routineId}
      initialProgram={program}
      exerciseCatalog={exerciseCatalog}
    />
  );
}
