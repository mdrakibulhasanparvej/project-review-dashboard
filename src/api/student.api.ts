import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  StudentProfile,
  StudentProfileUpdatePayload,
} from "@/types";

export const updateStudentProfile = (payload: StudentProfileUpdatePayload) => {
  return apiClient<ApiResponse<StudentProfile>>("/student/profile-update", {
    method: "PATCH",
    body: payload,
  });
};
