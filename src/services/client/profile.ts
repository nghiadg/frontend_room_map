import HttpClient from "@/lib/http-client";
import { UserProfile } from "@/types/profile";
import { UpdateUserProfileData } from "@/services/types/profile";

const httpClient = new HttpClient();

export const getUserProfile = async (): Promise<UserProfile> => {
  const profile = await httpClient.request<UserProfile>("/profile");
  return profile;
};

export const updateUserProfile = async (payload: UpdateUserProfileData) => {
  const data = await httpClient.request("/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return data;
};
