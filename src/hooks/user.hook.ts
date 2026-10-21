import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getProfile, updateProfilePicture, updateUserProfile } from "@/api";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });
};

export const useGetProfileSuspense = () => {
  return useSuspenseQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
};
