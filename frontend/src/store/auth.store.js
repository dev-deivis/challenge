import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authApi.login({ email, password });
          set({ user: data.user, token: data.token, loading: false });
        } catch (err) {
          set({ error: err.response?.data?.error || "Error al iniciar sesión", loading: false });
          throw err;
        }
      },

      register: async (email, password, name) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authApi.register({ email, password, name });
          set({ user: data.user, token: data.token, loading: false });
        } catch (err) {
          set({ error: err.response?.data?.error || "Error al registrarse", loading: false });
          throw err;
        }
      },

      logout: () => set({ user: null, token: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "mindshore-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
