"use client";

import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfile } from "@/hooks";

const dashboardPaths = {
  STUDENT: "/student/submissions",
  MENTOR: "/mentor/submissions",
  ADMIN: "/admin/overview",
} as const;

export default function OAuthProgress() {
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
    router.replace(dashboardPaths[profile.role]);
  }, [profile, isError, router, isPending]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <IconBrandGoogle size={28} stroke={1.8} aria-hidden="true" />
      </span>
      <div className="flex items-center gap-3">
        <Spinner />
        <p className="text-sm text-muted-foreground">
          Finishing sign-in with Google…
        </p>
      </div>
    </main>
  );
}
