import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "@/api";

export const useGetAdminOverview = () => {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });
};
