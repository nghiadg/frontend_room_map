import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  resetUser: () => set({ user: null }),
}));
