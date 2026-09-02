import { create } from "zustand";

interface NavigationStore {
  activeTab: string;
  isSidebarOpen: boolean;
  isMenuOpen: boolean;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeTab: "dashboard",
  isSidebarOpen: true,
  isMenuOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
}));
