import { notFound } from "next/navigation";

import { ClubDetailView } from "@/features/clubs/components/club-detail-view";
import { getClub, getClubJoinRequests, getClubMembers } from "@/lib/api/clubs";

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const club = await getClub(id);
  if (!club) notFound();

  const [members, joinRequests] = await Promise.all([
    getClubMembers(id),
    club.isOwner ? getClubJoinRequests(id) : Promise.resolve([]),
  ]);

  return <ClubDetailView club={club} members={members} joinRequests={joinRequests} />;
}
