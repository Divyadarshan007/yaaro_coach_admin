import { ClubsView } from "@/features/clubs/components/clubs-view";
import { getClubs } from "@/lib/api/clubs";

export default async function ClubsPage() {
  const ownClubs = await getClubs("own");
  // Joined / Discover tabs are commented out in ClubsView for now — skip their fetches.
  // const [ownClubs, joinedClubs, discoverClubs] = await Promise.all([
  //   getClubs("own"),
  //   getClubs("my"),
  //   getClubs("discover"),
  // ]);

  return <ClubsView ownClubs={ownClubs} joinedClubs={[]} discoverClubs={[]} />;
}
