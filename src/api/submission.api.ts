import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  CreateSubmissionPayload,
  Submission,
  SubmissionQuery,
  SubmissionStats,
  UpdateSubmissionStatusPayload,
} from "@/types";

const prefix = "/submissions";

export const createSubmission = (payload: CreateSubmissionPayload) => {
  return apiClient<ApiResponse<Submission>>(prefix, {
    method: "POST",
    body: payload,
  });
};

export const getAllSubmissions = (query: SubmissionQuery = {}) => {
  return apiClient<ApiResponse<Submission[]>>(prefix, { query });
};

export const getMySubmissions = () => {
  return apiClient<ApiResponse<Submission[]>>(`${prefix}/mine`);
};

export const getSubmissionStats = () => {
  return apiClient<ApiResponse<SubmissionStats>>(`${prefix}/stats`);
};

export const updateSubmissionStatus = (
  id: string,
  payload: UpdateSubmissionStatusPayload,
) => {
  return apiClient<ApiResponse<Submission>>(`${prefix}/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
};
