"use client";

import { createContext, useContext } from "react";

// Whether the calling coach has linked a Yaaro app account (studio_team.userId set) —
// required by the backend before creating or adding a program to My Library (see
// coach/controllers/program_ctrl.js create()). Defaults to true (unlocked) so a
// component rendered outside YaaroLinkProvider never gets stuck falsely locked; the
// backend remains the actual source of truth regardless of this UI hint.
const YaaroLinkContext = createContext(true);

export function YaaroLinkProvider({
  isLinked,
  children,
}: {
  isLinked: boolean;
  children: React.ReactNode;
}) {
  return <YaaroLinkContext.Provider value={isLinked}>{children}</YaaroLinkContext.Provider>;
}

export function useIsLinkedToYaaro(): boolean {
  return useContext(YaaroLinkContext);
}
