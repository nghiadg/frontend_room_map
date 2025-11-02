import { createSupabaseClient } from "@/lib/supabase/client";
import { getUserProfile as getUserProfileBase } from "@/services/base/profile";
import { UserProfile } from "@/types/profile";
import { UpdateUserProfileData } from "@/services/types/profile.types";

const supabase = createSupabaseClient();

export const getUserProfile = async (): Promise<UserProfile> => {
  return getUserProfileBase(supabase);
};

export const updateUserProfile = async (payload: UpdateUserProfileData) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", payload.id)
    .select();
  if (error) {
    throw error;
  }
  return data;
};
