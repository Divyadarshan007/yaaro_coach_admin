"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROGRAM_DURATION_OPTIONS } from "@/features/program-editor/data/program-editor-data";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { Program } from "@/features/program-editor/types/program-editor";

export function ProgramDetailsForm({ program }: { program: Program }) {
  const updateProgramDetails = useMyProgramsStore((state) => state.updateProgramDetails);
  const { title, duration, note } = program;

  const setTitle = (value: string) => updateProgramDetails(program.id, { title: value });
  const setDuration = (value: string) => updateProgramDetails(program.id, { duration: value });
  const setNote = (value: string) => updateProgramDetails(program.id, { note: value });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="program-title" className="text-sm font-medium text-foreground">
            Workout Program Title
          </label>
          <Input
            id="program-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="program-duration" className="text-sm font-medium text-foreground">
            Program Duration
          </label>
          <Select
            items={PROGRAM_DURATION_OPTIONS}
            value={duration}
            onValueChange={(value) => setDuration(value as string)}
          >
            <SelectTrigger id="program-duration" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_DURATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="program-note" className="text-sm font-medium text-foreground">
          Program Note
        </label>
        <Textarea
          id="program-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add a brief description of the program"
          className="min-h-24"
        />
      </div>
    </div>
  );
}
