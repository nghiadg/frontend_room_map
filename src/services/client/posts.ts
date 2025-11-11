import { CreatePostData } from "@/services/types/posts";
import HttpClient from "@/lib/http-client";

const httpClient = new HttpClient();

export const createPost = async (post: CreatePostData) => {
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
