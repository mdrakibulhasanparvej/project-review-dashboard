import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  deleteUser,
  getAllUser,
  getProfile,
  updateProfilePicture,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
} from "@/api";
import type {
  UserQuery,
  UserRoleUpdatePayload,
  UserStatusUpdatePayload,
} from "@/types";

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

/** Admin only: paginated user list. */
export const useGetAllUser = (query: UserQuery = {}) => {
  return useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUser(query),
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UserRoleUpdatePayload;
    }) => updateUserRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // A role change adds or removes the mentor profile row.
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UserStatusUpdatePayload;
    }) => updateUserStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
