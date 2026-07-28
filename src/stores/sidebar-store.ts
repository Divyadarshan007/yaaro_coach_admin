import { create } from "zustand";

type SidebarState = {
  isMobileOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  isDesktopCollapsed: boolean;
  toggleDesktopCollapsed: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isMobileOpen: false,
  open: () => set({ isMobileOpen: true }),
  close: () => set({ isMobileOpen: false }),
  toggle: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  isDesktopCollapsed: false,
  toggleDesktopCollapsed: () =>
    set((state) => ({ isDesktopCollapsed: !state.isDesktopCollapsed })),
}));
