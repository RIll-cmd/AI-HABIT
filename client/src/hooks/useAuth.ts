import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    setAuth,
    logout,
  };
}
