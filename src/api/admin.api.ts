import apiClient from "@/lib/ofetch";
import type { AdminPlatformOverview, ApiResponse } from "@/types";

export const getAdminOverview = () => {
  return apiClient<ApiResponse<AdminPlatformOverview>>("/admin/overview");
};
