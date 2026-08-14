import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MemberRow } from "@/features/team/components/member-row";
import type { Team, TeamMember } from "@/features/team/types/team";

const headerCellClassName = "px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase";

export function MembersTable({ members, myRole }: { members: TeamMember[]; myRole: Team["myRole"] }) {
  if (members.length === 0) {
    return (
      <div className="rounded-xl ring-1 ring-foreground/10">
        <EmptyState icon={Users} title="No members found" description="Try a different search, or add a new member to your team." />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={headerCellClassName}>Name</TableHead>
            <TableHead className={headerCellClassName}>Role</TableHead>
            <TableHead className={headerCellClassName}>Clients</TableHead>
            <TableHead className={headerCellClassName}>Status</TableHead>
            <TableHead className={headerCellClassName} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <MemberRow key={member.id} member={member} myRole={myRole} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
