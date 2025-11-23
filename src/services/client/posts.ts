import HttpClient from "@/lib/http-client";
import { createSupabaseClient } from "@/lib/supabase/client";
import { PostFormData } from "@/services/types/posts";
import { Coordinates } from "@/types/location";
import camelcaseKeys from "camelcase-keys";

const httpClient = new HttpClient();
const supabase = createSupabaseClient();

export const createPost = async (post: PostFormData) => {
  const formData = new FormData();
  post.images.forEach((image) => {
    formData.append("images", image);
  });
  formData.append("payload", JSON.stringify(post.payload));

  const response = await httpClient.request<void>("/posts", {
    method: "POST",
    body: formData,
  });

  return response;
};

export const editPost = async (id: number, post: PostFormData) => {
  const formData = new FormData();
  post.images.forEach((image) => {
    formData.append("images", image);
  });
  formData.append("payload", JSON.stringify(post.payload));

  const response = await httpClient.request<void>(`/posts/${id}`, {
    method: "PUT",
    body: formData,
  });

  return response;
};

export const getPostsByMapBounds = async (ne: Coordinates, sw: Coordinates) => {
  let query = supabase
    .from("posts")
    .select("*")
    .eq("is_rented", false)
    .eq("is_deleted", false)
    .gte("lat", sw.lat)
    .lte("lat", ne.lat);

  // Handle bounds that cross the antimeridian by wrapping the longitude check
  if (sw.lng <= ne.lng) {
    query = query.gte("lng", sw.lng).lte("lng", ne.lng);
  } else {
    query = query.or(`lng.gte.${sw.lng},lng.lte.${ne.lng}`);
  }

  const { data } = await query.throwOnError();

  return camelcaseKeys(data, { deep: true });
};
