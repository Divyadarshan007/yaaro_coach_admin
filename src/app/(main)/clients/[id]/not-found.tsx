import { UserX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientNotFound() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <Card className="max-w-sm items-center px-6 py-8 text-center">
        <CardContent className="flex flex-col items-center gap-3 px-0">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <UserX className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-heading text-base font-medium">Client not found</p>
            <p className="text-sm text-muted-foreground">
              This client doesn&apos;t exist or may have been removed.
            </p>
          </div>
          <Button className="mt-2" render={<Link href="/clients" />}>
            Back to Clients
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
