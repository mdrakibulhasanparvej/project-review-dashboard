import apiClient from "@/lib/ofetch";
import type {
  ApiResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  VerifyEmailResponse,
  verifyEmailPayload,
} from "@/types";

const prefix = "/auth";

export const login = (payload: LoginPayload) => {
  return apiClient<LoginResponse>(`${prefix}/login`, {
    method: "POST",
    body: payload,
  });
};

export const register = (payload: RegisterPayload) => {
  const formdata = new FormData();

  formdata.append("data", JSON.stringify(payload.data));

  return apiClient<ApiResponse<undefined>>(`${prefix}/register`, {
    method: "POST",
    body: formdata,
  });
};

export const verifyEmail = (payload: verifyEmailPayload) => {
  return apiClient<ApiResponse<VerifyEmailResponse>>(`${prefix}/verify-email`, {
    method: "POST",
    body: payload,
  });
};

export const logout = () => {
  return apiClient<ApiResponse<undefined>>(`${prefix}/logout`, {
    method: "POST",
  });
};
