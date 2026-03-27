import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
  const { accessToken, user, setToken, setUser, logout } = useAuthStore();

  const isAuthenticated = !!accessToken;

  return {
    accessToken,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
  };
};