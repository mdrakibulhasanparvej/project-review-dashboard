import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/RoleGuard";
import DashboardShell from "@/components/modules/dashboard/DashboardShell";

export default function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["STUDENT"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
