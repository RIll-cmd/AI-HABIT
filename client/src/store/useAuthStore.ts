import { create } from "zustand";
import { fetcher } from "@/lib/api";
import { useCharacterStore } from "./useCharacterStore";

export interface UserState {
  id: string;
  username: string;
}

interface AuthStore {
  user: UserState | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  setAuth: (user: UserState, token?: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("ascend_session") || null;
  } catch {
    return null;
  }
};

const getStoredUser = (): UserState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("ascend_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setCookie = (token: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `ascend_session=${token}; path=/; max-age=${86400 * 30}; SameSite=Lax`;
};

const clearCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `ascend_session=; path=/; max-age=0; SameSite=Lax`;
};

export const useAuthStore = create<AuthStore>((set, get) => {
  const initialUser = getStoredUser();
  const initialToken = getStoredToken();

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!(initialUser || initialToken),
    isLoading: false,
    isHydrated: true,

    setAuth: (user, token) => {
      if (token) {
        setCookie(token);
        try {
          localStorage.setItem("ascend_session", token);
        } catch {}
      }
      try {
        localStorage.setItem("ascend_user", JSON.stringify(user));
      } catch {}

      set({
        user,
        token: token || get().token,
        isAuthenticated: true,
        isLoading: false,
        isHydrated: true,
      });
    },

    logout: () => {
      clearCookie();
      try {
        localStorage.removeItem("ascend_session");
        localStorage.removeItem("ascend_user");
      } catch {}
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
      useCharacterStore.getState().setCharacter(null);
    },

    checkAuth: async () => {
      try {
        const data = await fetcher<{ user: UserState; character: any; token?: string }>("/api/auth/me");
        if (data && data.user) {
          if (data.token) {
            setCookie(data.token);
            try {
              localStorage.setItem("ascend_session", data.token);
            } catch {}
          }
          try {
            localStorage.setItem("ascend_user", JSON.stringify(data.user));
          } catch {}

          set({
            user: data.user,
            token: data.token || get().token,
            isAuthenticated: true,
            isLoading: false,
            isHydrated: true,
          });
          if (data.character) {
            useCharacterStore.getState().setCharacter(data.character);
          }
        } else {
          // Only clear if token is explicitly missing locally and no cached user exists
          const cachedUser = getStoredUser();
          const cachedToken = getStoredToken();
          if (!cachedUser && !cachedToken) {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false, isHydrated: true });
          } else {
            set({ isLoading: false, isHydrated: true });
          }
        }
      } catch (err) {
        console.warn("Auth check network error, preserving local session:", err);
        const cachedUser = getStoredUser();
        set({
          user: cachedUser || get().user,
          isAuthenticated: !!(cachedUser || get().user),
          isLoading: false,
          isHydrated: true,
        });
      }
    },
  };
});
