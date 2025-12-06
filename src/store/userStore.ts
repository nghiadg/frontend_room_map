"use client";

import { UserProfile } from "@/types/profile";
import { create } from "zustand";

type UserStore = {
  profile: UserProfile | null;
  isProfileLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setIsProfileLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isProfileLoading: true,
  setProfile: (profile: UserProfile | null) => set({ profile }),
  setIsProfileLoading: (loading: boolean) => set({ isProfileLoading: loading }),
  reset: () => set({ profile: null, isProfileLoading: false }),
}));
