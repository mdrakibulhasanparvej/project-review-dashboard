"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetProfile } from "@/hooks";
import type { Role } from "@/types";
import AccessDenied from "./AccessDenied";
import AuthLoading from "./AuthLoading";

interface Props {
  children: ReactNode;
  roles: Role[];
}

export default function RoleGuard({ children, roles }: Props) {
  const router = useRouter();
  const { data, isError, isPending } = useGetProfile();
  const profile = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !profile) {
      router.replace("/login");
      return;
    }
  }, [profile, isError, router, isPending]);

  if (isPending || isError || !profile?.role) {
    return <AuthLoading />;
  }

  const isAuthorized = roles?.includes(profile?.role);

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}
