import { ProgramLibraryView } from "@/features/program-library/components/program-library-view";
import { getProgramTemplates } from "@/lib/api/program-templates";
import { getPrograms } from "@/lib/api/programs";

export default async function ProgramLibraryPage() {
  const [templates, programs] = await Promise.all([getProgramTemplates(), getPrograms()]);

  return <ProgramLibraryView templates={templates} initialPrograms={programs} />;
}
