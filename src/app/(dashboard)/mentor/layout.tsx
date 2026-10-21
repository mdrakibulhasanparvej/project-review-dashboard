import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/RoleGuard";
import DashboardShell from "@/components/modules/dashboard/DashboardShell";

export default function MentorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["MENTOR"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
