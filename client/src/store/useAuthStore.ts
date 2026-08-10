import { create } from "zustand";
import { fetcher } from "@/lib/api";
import { useCharacterStore } from "./useCharacterStore";

export interface UserState {
  id: string;
  username: string;
}

interface AuthStore {
  user: UserState | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserState) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
    useCharacterStore.getState().setCharacter(null);
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const data = await fetcher<{ user: UserState; character: any }>("/api/auth/me");
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      if (data.character) {
        useCharacterStore.getState().setCharacter(data.character);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
