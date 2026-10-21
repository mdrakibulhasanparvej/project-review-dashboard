import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, register, verifyEmail } from "@/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.removeQueries({ queryKey: ["profile"], exact: true });
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};
