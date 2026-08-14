import { ProgramLibraryView } from "@/features/program-library/components/program-library-view";
import { getPrograms } from "@/lib/api/programs";
import { getRoutines } from "@/lib/api/routines";

export default async function ProgramLibraryPage() {
  const [programs, routines, explorePrograms] = await Promise.all([
    getPrograms("mine"),
    getRoutines("mine"),
    getPrograms("explore"),
  ]);

  return (
    <ProgramLibraryView initialPrograms={programs} initialRoutines={routines} explorePrograms={explorePrograms} />
  );
}
