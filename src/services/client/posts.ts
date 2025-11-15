import { PostFormData } from "@/services/types/posts";
import HttpClient from "@/lib/http-client";

const httpClient = new HttpClient();

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
