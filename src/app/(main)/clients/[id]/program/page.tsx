import { notFound } from "next/navigation";

import { ClientProgramEditorView } from "@/features/program-editor/components/client-program-editor-view";
import { getClient, getClientProgram } from "@/lib/api/clients";
import { getMuscleCatalog } from "@/lib/api/muscles";
import { getRoutines } from "@/lib/api/routines";

export default async function ClientProgramEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, program, muscleCatalog, routines] = await Promise.all([
    getClient(id),
    getClientProgram(id),
    getMuscleCatalog(),
    getRoutines("mine"),
  ]);

  if (!client) {
    notFound();
  }

  return (
    <ClientProgramEditorView
      clientId={id}
      clientName={client.name}
      initialProgram={program}
      muscleCatalog={muscleCatalog}
      routineLibrary={routines}
    />
  );
}
