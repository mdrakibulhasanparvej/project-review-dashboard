import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMentors, updateMentorProfile } from "@/api";
import type { MentorQuery } from "@/types";

export const useUpdateMentorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMentorProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
};

export const useGetMentors = (query: MentorQuery = {}) => {
  return useQuery({
    queryKey: ["mentors", query],
    queryFn: () => getMentors(query),
  });
};
