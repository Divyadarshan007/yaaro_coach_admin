import { ProgramEditorView } from "@/features/program-editor/components/program-editor-view";
import { getProgram } from "@/lib/api/programs";
import { getMuscleCatalog } from "@/lib/api/muscles";
import { getClients } from "@/lib/api/clients";
import { getRoutines } from "@/lib/api/routines";

export default async function ProgramEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [program, muscleCatalog, clients, routines] = await Promise.all([
    getProgram(id),
    getMuscleCatalog(),
    getClients(),
    getRoutines("mine"),
  ]);

  return (
    <ProgramEditorView
      initialProgram={program}
      muscleCatalog={muscleCatalog}
      clients={clients}
      initialRoutines={routines}
    />
  );
}
