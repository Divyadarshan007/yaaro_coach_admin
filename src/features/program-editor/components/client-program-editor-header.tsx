import { ArrowLeft, CircleCheck } from "lucide-react";
import Link from "next/link";

export function ClientProgramEditorHeader({ clientId, clientName }: { clientId: string; clientName: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Link href={`/clients/${clientId}`} className="w-fit text-sm text-muted-foreground hover:text-foreground">
        {clientName}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/clients/${clientId}`}
            aria-label="Back to Client"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Edit {clientName}&apos;s Program</h1>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CircleCheck className="size-4" />
          All changes saved
        </div>
      </div>
    </div>
  );
}
