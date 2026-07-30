import { ProgramEditorView } from "@/features/program-editor/components/program-editor-view";
import { getProgram } from "@/lib/api/programs";
import { getMuscleCatalog } from "@/lib/api/muscles";
import { getClients } from "@/lib/api/clients";

export default async function ProgramEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [program, muscleCatalog, clients] = await Promise.all([getProgram(id), getMuscleCatalog(), getClients()]);

  return <ProgramEditorView initialProgram={program} muscleCatalog={muscleCatalog} clients={clients} />;
}
