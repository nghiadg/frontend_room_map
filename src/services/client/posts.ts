import HttpClient from "@/lib/http-client";
import { PostFormData } from "@/services/types/posts";
import { Coordinates } from "@/types/location";
import { FilterValues } from "@/app/map/components/map-filter-panel";

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
  sw: Coordinates,
  filters?: FilterValues
): Promise<PostMapMarker[]> => {
  const params = new URLSearchParams({
    neLat: ne.lat.toString(),
    neLng: ne.lng.toString(),
    swLat: sw.lat.toString(),
    swLng: sw.lng.toString(),
  });

  // Add filter parameters if provided
  if (filters) {
    if (filters.minPrice !== null) {
      params.append("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== null) {
      params.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters.minArea !== null) {
      params.append("minArea", filters.minArea.toString());
    }
    if (filters.maxArea !== null) {
      params.append("maxArea", filters.maxArea.toString());
    }
    if (filters.propertyTypeIds.length > 0) {
      filters.propertyTypeIds.forEach((id) => {
        params.append("propertyTypeIds", id.toString());
      });
    }
    if (filters.amenityIds.length > 0) {
      filters.amenityIds.forEach((id) => {
        params.append("amenityIds", id.toString());
      });
    }
  }

  const posts = await httpClient.request<PostMapMarker[]>(
    `/posts/map-bounds?${params.toString()}`
  );

  return posts;
};
