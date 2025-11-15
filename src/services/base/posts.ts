import { SupabaseClient } from "@supabase/supabase-js";
import { Post } from "@/types/post";
import camelcaseKeys from "camelcase-keys";
import { SUPABASE_ERRORS_CODES } from "@/lib/supabase/errors.constants";
import { getUserProfile } from "../server/profile";

export const getPostById = async (
  supabase: SupabaseClient,
  id: string
): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "*, post_amenities(*, amenities(*)), post_terms(*, terms(*)), post_images(*), provinces(*), districts(*), wards(*), created_by(*)"
    )
    .eq("id", id)
    .eq("is_rented", false)
    .eq("is_deleted", false)
    .single();
  if (error) {
    if (error.code === SUPABASE_ERRORS_CODES.PGRST116) {
      return null;
    }

    throw error;
  }

  return camelcaseKeys(data, { deep: true });
};

export const getOwnedPostById = async (
  supabase: SupabaseClient,
  id: string
): Promise<Post | null> => {
  const userProfile = await getUserProfile();
  if (!userProfile) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      "*, post_amenities(*, amenities(*)), post_terms(*, terms(*)), post_images(*), provinces(*), districts(*), wards(*), created_by(*)"
    )
    .eq("id", id)
    .eq("is_rented", false)
    .eq("is_deleted", false)
    .eq("created_by", userProfile.id)
    .single();
  if (error) {
    if (error.code === SUPABASE_ERRORS_CODES.PGRST116) {
      return null;
    }

    throw error;
  }

  return camelcaseKeys(data, { deep: true });
};
