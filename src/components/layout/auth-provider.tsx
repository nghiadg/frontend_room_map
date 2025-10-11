"use client";

import { useAuthStore } from "@/store/authStore";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useCallback, useEffect } from "react";
import { errorHandler } from "@/lib/errors";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, resetUser } = useAuthStore();
  const supabase = createSupabaseClient();

  const getUser = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      errorHandler(error, { title: "Get user failed" });
      resetUser();
    }
    setUser(data.user);
  }, [resetUser, setUser, supabase.auth]);

  useEffect(() => {
    getUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        setUser(session?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        resetUser();
      }
    });
    return () => subscription.unsubscribe();
  }, [getUser, resetUser, setUser, supabase.auth]);

  return <>{children}</>;
}
