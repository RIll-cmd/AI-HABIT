import { create } from "zustand";

interface NavigationStore {
  activeTab: string;
  isSidebarOpen: boolean;
  setActiveTab: (tab: string) => void;
  toggleSidebar: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeTab: "dashboard",
  isSidebarOpen: true,
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
