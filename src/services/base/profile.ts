import { UserProfile } from "@/types/profile";
import { SupabaseClient } from "@supabase/supabase-js";
import { ResponseUserProfile } from "@/services/types/profile.types";

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
      `id, full_name, gender, date_of_birth, phone_number, provinces(*), districts(*), wards(*), address`
    )
    .eq("user_id", user.id)
    .limit(1)
    .single();
  if (error) {
    throw error;
  }

  const { provinces, districts, wards, ...rest } =
    data as unknown as ResponseUserProfile;

  return {
    ...rest,
    province: {
      name: provinces?.name,
      code: provinces?.code,
    },
    district: {
      name: districts?.name,
      code: districts?.code,
      provinceCode: districts?.province_code,
    },
    ward: {
      name: wards?.name,
      code: wards?.code,
      districtCode: wards?.district_code,
    },
  };
};
