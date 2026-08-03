import { create } from "zustand";

export interface UserState {
  id: string;
  email: string;
}

interface AuthStore {
  user: UserState | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserState, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
