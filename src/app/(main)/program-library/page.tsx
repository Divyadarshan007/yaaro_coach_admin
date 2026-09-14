import { ProgramLibraryView } from "@/features/program-library/components/program-library-view";
import { getCoachProfile } from "@/lib/api/coach";
import { getPrograms } from "@/lib/api/programs";
import { getRoutines } from "@/lib/api/routines";

export default async function ProgramLibraryPage() {
  const [programs, routines, explorePrograms, coachProfile] = await Promise.all([
    getPrograms("mine"),
    getRoutines("mine"),
    getPrograms("explore"),
    getCoachProfile(),
  ]);

  return (
    <ProgramLibraryView
      initialPrograms={programs}
      initialRoutines={routines}
      explorePrograms={explorePrograms}
      isLinkedToYaaro={coachProfile?.userId != null}
    />
  );
}
