import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  UserProfile,
  UserProfileUpdatePayload,
} from "@/types";

const prefix = "/user";

export const getProfile = () => {
  return apiClient<ApiResponse<UserProfile>>(`${prefix}/profile`);
};

export const updateUserProfile = (payload: UserProfileUpdatePayload) => {
  return apiClient<ApiResponse<UserProfile>>(`${prefix}/profile`, {
    method: "PATCH",
    body: payload,
  });
};

export const updateProfilePicture = (picture: File) => {
  const formData = new FormData();
  formData.append("picture", picture);

  return apiClient<ApiResponse<string>>(`${prefix}/update-profile-picture`, {
    method: "PATCH",
    body: formData,
  });
};
