import { UserProfile } from "@/types/profile";
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";

export const getUserProfile = async (
  supabase: SupabaseClient
): Promise<UserProfile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `id, full_name, gender, role_id, date_of_birth, phone_number, provinces(*), districts(*), wards(*), address`
    )
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (error) {
    throw error;
  }

  return camelcaseKeys(data, { deep: true }) as unknown as UserProfile;
};
