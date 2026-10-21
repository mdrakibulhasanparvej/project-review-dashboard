"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetProfile } from "@/hooks";
import AuthLoading from "./AuthLoading";

const dashboardPaths = {
  STUDENT: "/student/submissions",
  MENTOR: "/mentor/submissions",
  ADMIN: "/admin/overview",
} as const;

interface Props {
  children?: ReactNode;
  redirectAuthenticatedUser?: boolean;
}

export default function AuthGuard({
  children,
  redirectAuthenticatedUser = false,
}: Props) {
  const router = useRouter();
  const { data, isPending, isError } = useGetProfile();
  const profile = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !profile) {
      router.replace("/login");
      return;
    }
    if (redirectAuthenticatedUser) {
      router.replace(dashboardPaths[profile.role]);
    }
  }, [profile, isError, router, isPending, redirectAuthenticatedUser]);

  if (isPending || isError || !profile || redirectAuthenticatedUser) {
    return <AuthLoading />;
  }

  return children;
}
