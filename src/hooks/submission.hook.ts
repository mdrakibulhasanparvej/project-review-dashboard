import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubmission,
  getAllSubmissions,
  getMySubmissions,
  getSubmissionStats,
  updateSubmissionStatus,
} from "@/api";
import type { SubmissionQuery } from "@/types";

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission-stats"] });
    },
  });
};

export const useGetSubmissions = (query: SubmissionQuery = {}) => {
  return useQuery({
    queryKey: ["submissions", query],
    queryFn: () => getAllSubmissions(query),
  });
};

export const useGetMySubmissions = () => {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: getMySubmissions,
  });
};

export const useGetSubmissionStats = () => {
  return useQuery({
    queryKey: ["submission-stats"],
    queryFn: getSubmissionStats,
  });
};

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateSubmissionStatus>[1];
    }) => updateSubmissionStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["submission-stats"] });
    },
  });
};
