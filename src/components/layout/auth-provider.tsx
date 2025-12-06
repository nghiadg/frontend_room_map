"use client";

import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useCallback, useEffect } from "react";
import { errorHandler } from "@/lib/errors";
import { getUserProfile } from "@/services/client/profile";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, resetUser } = useAuthStore();
  const {
    setProfile,
    setIsProfileLoading,
    reset: resetProfile,
  } = useUserStore();
  const supabase = createSupabaseClient();

  const fetchProfile = useCallback(async () => {
    try {
      setIsProfileLoading(true);
      const profile = await getUserProfile();
      setProfile(profile);
    } catch (error) {
      // Profile fetch failed - user might not have a profile yet
      console.error("Failed to fetch profile:", error);
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, [setProfile, setIsProfileLoading]);

  const getUser = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      errorHandler(error, { title: "Get user failed" });
      resetUser();
      resetProfile();
      return;
    }
    setUser(data.user);
    if (data.user) {
      fetchProfile();
    }
  }, [resetUser, resetProfile, setUser, supabase.auth, fetchProfile]);

  useEffect(() => {
    getUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile();
        }
      } else if (event === "SIGNED_OUT") {
        resetUser();
        resetProfile();
      }
    });
    return () => subscription.unsubscribe();
  }, [getUser, resetUser, resetProfile, setUser, supabase.auth, fetchProfile]);

  return <>{children}</>;
}
