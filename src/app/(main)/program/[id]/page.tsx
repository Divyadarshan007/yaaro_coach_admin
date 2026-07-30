import { ProgramEditorView } from "@/features/program-editor/components/program-editor-view";
import { getProgram } from "@/lib/api/programs";
import { getMuscleCatalog } from "@/lib/api/muscles";

export default async function ProgramEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [program, muscleCatalog] = await Promise.all([getProgram(id), getMuscleCatalog()]);

  return <ProgramEditorView initialProgram={program} muscleCatalog={muscleCatalog} />;
}
