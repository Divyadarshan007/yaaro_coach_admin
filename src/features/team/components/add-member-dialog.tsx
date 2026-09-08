"use client";

import { Check, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { inviteStudioMemberAction, searchStudioUsersAction } from "@/features/team/actions";
import type { StudioUserSearchResult } from "@/features/team/types/team";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudioUserSearchResult[]>([]);
  const [searchedFor, setSearchedFor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invitedName, setInvitedName] = useState<string | null>(null);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [isInviting, startInvite] = useTransition();
  const requestId = useRef(0);

  const term = query.trim();
  const isSearching = term.length > 0 && term !== searchedFor && !invitedName;

  function reset() {
    setQuery("");
    setResults([]);
    setSearchedFor("");
    setError(null);
    setInvitedName(null);
    setInvitingId(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  useEffect(() => {
    if (invitedName || term.length === 0) return;

    const current = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const rows = await searchStudioUsersAction(term);
        if (current === requestId.current) {
          setResults(rows);
          setSearchedFor(term);
        }
      } catch {
        if (current === requestId.current) {
          setResults([]);
          setSearchedFor(term);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [term, invitedName]);

  function handleInvite(user: StudioUserSearchResult) {
    setError(null);
    setInvitingId(user.userId);
    startInvite(async () => {
      try {
        await inviteStudioMemberAction(user.userId);
        setInvitedName(user.name || user.userName);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send invitation");
      } finally {
        setInvitingId(null);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus />
        Add Member
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{invitedName ? "Invitation sent" : "Invite a coach"}</DialogTitle>
          {!invitedName && (
            <DialogDescription>
              Search for a Yaaro user by username. They&apos;ll get a notification and can join your
              studio by signing up in the coach app.
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogBody>
          {invitedName ? (
            <div className="flex items-center gap-2 rounded-lg border border-input px-3 py-2.5 text-sm">
              <Check className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="text-muted-foreground">
                Invitation sent to <span className="font-medium text-foreground">{invitedName}</span>.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by username"
                  className="pl-8"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="max-h-64 overflow-y-auto">
                {term.length === 0 ? null : isSearching ? (
                  <p className="py-2 text-sm text-muted-foreground">Searching…</p>
                ) : results.length === 0 ? (
                  <p className="py-2 text-sm text-muted-foreground">No matching users found.</p>
                ) : (
                  <ul className="flex flex-col">
                    {results.map((user) => (
                      <li key={user.userId}>
                        <button
                          type="button"
                          disabled={isInviting}
                          onClick={() => handleInvite(user)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted disabled:opacity-50"
                        >
                          <PersonAvatar
                            avatar={avatarFromName(user.name || user.userName, user.userId)}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-foreground">
                              {user.name || user.userName}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              @{user.userName}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-medium text-primary">
                            {invitingId === user.userId ? "Inviting…" : "Invite"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button size="lg" variant={invitedName ? "default" : "outline"} onClick={() => handleOpenChange(false)}>
            {invitedName ? "Done" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
