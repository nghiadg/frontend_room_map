import HttpClient from "@/lib/http-client";
import { PostFormData } from "@/services/types/posts";
import { Coordinates } from "@/types/location";

const httpClient = new HttpClient();

/**
 * Represents a rental post displayed on the map.
 * Contains only the essential fields needed for map markers.
 */
export interface PostMapMarker {
  id: number;
  lat: number;
  lng: number;
  price: number;
  title: string;
}

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

export const getPostsByMapBounds = async (
  ne: Coordinates,
  sw: Coordinates
): Promise<PostMapMarker[]> => {
  const params = new URLSearchParams({
    neLat: ne.lat.toString(),
    neLng: ne.lng.toString(),
    swLat: sw.lat.toString(),
    swLng: sw.lng.toString(),
  });

  const posts = await httpClient.request<PostMapMarker[]>(
    `/posts/map-bounds?${params.toString()}`
  );

  return posts;
};
