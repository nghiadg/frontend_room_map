import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types/profile";
import { getUserProfile as getUserProfileBase } from "@/services/base/profile";

export const getUserProfile = async (): Promise<UserProfile> => {
  const supabase = await createClient();
  return getUserProfileBase(supabase);
};
