import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  User,
  UserProfile,
  UserProfileUpdatePayload,
  UserQuery,
  UserRoleUpdatePayload,
  UserStatusUpdatePayload,
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

/** Admin only: paginated user list. */
export const getAllUser = (query: UserQuery = {}) => {
  return apiClient<ApiResponse<User[]>>(prefix, { query });
};

/** Admin only: change a single user's role. */
export const updateUserRole = (id: string, payload: UserRoleUpdatePayload) => {
  return apiClient<ApiResponse<User>>(`${prefix}/${id}/role`, {
    method: "PATCH",
    body: payload,
  });
};

/** Admin only: enable or disable an account. */
export const updateUserStatus = (
  id: string,
  payload: UserStatusUpdatePayload,
) => {
  return apiClient<ApiResponse<User>>(`${prefix}/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
};

/** Admin only: soft delete an account. */
export const deleteUser = (id: string) => {
  return apiClient<ApiResponse<User>>(`${prefix}/${id}`, {
    method: "DELETE",
  });
};
