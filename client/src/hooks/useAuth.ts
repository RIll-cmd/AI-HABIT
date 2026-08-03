import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
  };
}
