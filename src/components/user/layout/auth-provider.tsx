"use client";

import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useCallback, useEffect } from "react";
import { errorHandler } from "@/lib/errors";
import { getUserProfile } from "@/services/client/profile";
import { trackSignUp, setUserId } from "@/lib/analytics";

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

  const fetchProfile = useCallback(
    async (userId: string, isInitialSignIn = false) => {
      try {
        setIsProfileLoading(true);
        const profile = await getUserProfile();
        setProfile(profile);

        // Set user ID for GA4 cross-device tracking
        setUserId(userId);

        // Track sign_up only for new users (no profile yet) on initial sign in
        if (!profile && isInitialSignIn) {
          trackSignUp("google");
        }
      } catch (error) {
        // Profile fetch failed - user might not have a profile yet
        console.error("Failed to fetch profile:", error);
        setProfile(null);

        // If profile fetch fails on first sign in, it's likely a new user
        if (isInitialSignIn) {
          trackSignUp("google");
        }
      } finally {
        setIsProfileLoading(false);
      }
    },
    [setProfile, setIsProfileLoading]
  );

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
      fetchProfile(data.user.id);
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
          // Track as initial sign in only for SIGNED_IN event (not INITIAL_SESSION)
          fetchProfile(session.user.id, event === "SIGNED_IN");
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
