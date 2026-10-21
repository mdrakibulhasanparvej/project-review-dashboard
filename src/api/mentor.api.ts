import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  Mentor,
  MentorProfile,
  MentorProfileUpdatePayload,
  MentorQuery,
} from "@/types";

const prefix = "/mentor";

export const updateMentorProfile = (payload: MentorProfileUpdatePayload) => {
  return apiClient<ApiResponse<MentorProfile>>(`${prefix}/profile-update`, {
    method: "PATCH",
    body: payload,
  });
};

export const getMentors = (query: MentorQuery = {}) => {
  return apiClient<ApiResponse<Mentor[]>>(prefix, { query });
};
