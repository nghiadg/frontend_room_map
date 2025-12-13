import { createSupabaseClient } from "@/lib/supabase/client";
import { useBoolean } from "./use-boolean";
import { errorHandler } from "@/lib/errors";
import { trackLogin, trackLogout } from "@/lib/analytics";

export function useAuth() {
  const supabase = createSupabaseClient();
  const {
    value: isLoading,
    setFalse: setIsLoadingFalse,
    setTrue: setIsLoadingTrue,
  } = useBoolean(false);

  const signInWithGoogle = async () => {
    try {
      setIsLoadingTrue();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Track successful login attempt (actual login happens after redirect)
      trackLogin("google");
    } catch (error) {
      errorHandler(error, { title: "Sign in with Google failed" });
    } finally {
      setIsLoadingFalse();
    }
  };

  const signOut = async () => {
    try {
      setIsLoadingTrue();
      await supabase.auth.signOut();
      trackLogout();
    } catch (error) {
      errorHandler(error, { title: "Sign out failed" });
    } finally {
      setIsLoadingFalse();
    }
  };

  return {
    isLoading,
    signInWithGoogle,
    signOut,
  };
}
