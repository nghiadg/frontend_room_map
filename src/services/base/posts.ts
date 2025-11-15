import { SupabaseClient } from "@supabase/supabase-js";
import { Post } from "@/types/post";
import camelcaseKeys from "camelcase-keys";

export const getPost = async (
  supabase: SupabaseClient,
  id: string
): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "*, post_amenities(*, amenities(*)), post_terms(*, terms(*)), post_images(*), provinces(*), districts(*), wards(*)"
    )
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }

  return camelcaseKeys(data, { deep: true });
};
