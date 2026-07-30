import { create } from "zustand";

type YaaroCoachLibraryState = {
  activeProgramId: string | null;
  openProgramDetails: (id: string) => void;
  closeProgramDetails: () => void;
};

export const useYaaroCoachLibraryStore = create<YaaroCoachLibraryState>((set) => ({
  activeProgramId: null,
  openProgramDetails: (id) => set({ activeProgramId: id }),
  closeProgramDetails: () => set({ activeProgramId: null }),
}));
