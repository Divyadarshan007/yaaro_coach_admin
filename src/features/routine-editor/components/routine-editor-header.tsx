import { ArrowLeft, CircleCheck } from "lucide-react";
import Link from "next/link";

export function RoutineEditorHeader({ programId, programTitle }: { programId: string; programTitle: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Link href={`/program/${programId}`} className="w-fit text-sm text-muted-foreground hover:text-foreground">
        My Programs / {programTitle}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/program/${programId}`}
            aria-label="Back to Program"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Edit Routine</h1>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CircleCheck className="size-4" />
          All changes saved
        </div>
      </div>
    </div>
  );
}
