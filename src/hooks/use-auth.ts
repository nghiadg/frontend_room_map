import { createSupabaseClient } from "@/lib/supabase/client";
import { useBoolean } from "./use-boolean";
import { errorHandler } from "@/lib/errors";

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
