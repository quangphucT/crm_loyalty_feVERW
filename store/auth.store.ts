import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface User {
  role?: string
  username?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  setAuth: (data: {
    role?: string
    username?: string
  }) => void

  clearAuth: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
     
        user: null,
        isAuthenticated: false,
        isHydrated: false,
        
        setAuth: (data) =>
          set(
            {
              user: {
                username: data.username,
                role: data.role,
              },
              isAuthenticated: true,
            },
            false,
            "setAuth"
          ),

        clearAuth: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
            },
            false,
            "clearAuth"
          ),

        setHydrated: () => set({ isHydrated: true }),
      }),
      {
        name: "auth-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHydrated()
        },
      }
    ),
    { name: "auth-store" }
  )
)