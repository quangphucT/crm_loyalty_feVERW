import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  user: any;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null, user: null });
  },
}));