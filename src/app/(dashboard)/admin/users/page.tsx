"use client";

import {
  IconSearch,
  IconUserCheck,
  IconUserOff,
  IconUsers,
  IconUserX,
} from "@tabler/icons-react";
import { cn } from "cn";
import type { FetchError } from "ofetch";
import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteUser,
  useGetAllUser,
  useGetProfile,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/hooks";
import type { Role, User } from "@/types";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "MENTOR", label: "Mentor" },
  { value: "STUDENT", label: "Student" },
];

const STATUS_FILTERS = ["ALL", "ACTIVE", "DISABLED"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_STYLE: Record<"active" | "disabled", string> = {
  active:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  disabled:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const roleLabel = (role: Role) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  // Debounce so typing in the search box does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  const query = useGetAllUser({
    page,
    limit: PAGE_SIZE,
    ...(roleFilter !== "ALL" && { role: roleFilter }),
    ...(statusFilter !== "ALL" && { is_active: statusFilter === "ACTIVE" }),
    ...(searchTerm && { searchTerm }),
  });

  const { data: profileData } = useGetProfile();
  const currentUserId = profileData?.data?.id;

  const roleMutation = useUpdateUserRole();
  const statusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();

  const users = query.data?.data ?? [];
  const totalPages = query.data?.meta?.totalPages ?? 1;
  const totalUsers = query.data?.meta?.dataCount;

  // Deleting the last row of a page can leave `page` past the end of the list.
  useEffect(() => {
    if (!query.isLoading && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, query.isLoading]);

  const changeRole = (user: User, role: Role) => {
    if (role === user.role) {
      return;
    }

    roleMutation.mutate(
      { id: user.id, payload: { role } },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Role update failed",
              description: response.message || "Could not update the role.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Role updated",
            description: `${user.name} is now a ${roleLabel(role)}.`,
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Role update failed",
            description: error.data?.message || "Could not update the role.",
          });
        },
      },
    );
  };

  const toggleStatus = (user: User) => {
    const isActive = !user.is_active;

    statusMutation.mutate(
      { id: user.id, payload: { is_active: isActive } },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Status update failed",
              description: response.message || "Could not update the status.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: isActive ? "User enabled" : "User disabled",
            description: `${user.name} can ${isActive ? "now" : "no longer"} access the platform.`,
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Status update failed",
            description: error.data?.message || "Could not update the status.",
          });
        },
      },
    );
  };

  const confirmDelete = () => {
    const target = confirmTarget;

    if (!target) {
      return;
    }

    deleteMutation.mutate(target.id, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Delete failed",
            description: response.message || "Could not delete the user.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "User deleted",
          description: `${target.name} can no longer access the platform.`,
        });
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Delete failed",
          description: error.data?.message || "Could not delete the user.",
        });
      },
    });
  };

  const columns: DataTableColumn<User>[] = [
    {
      id: "user",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.profile_url ?? undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (user) => (
        <Select
          value={user.role}
          onValueChange={(value) => changeRole(user, value as Role)}
          disabled={roleMutation.isPending}
        >
          <SelectTrigger
            size="sm"
            className="w-28"
            aria-label={`Role for ${user.name}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5",
            user.is_active ? STATUS_STYLE.active : STATUS_STYLE.disabled,
          )}
        >
          <span
            className="size-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
          {user.is_active ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      id: "joined",
      header: "Joined",
      className: "text-right",
      cell: (user) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {new Date(user.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      className: "text-right",
      cell: (user) => {
        const isSelf = user.id === currentUserId;

        return (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={statusMutation.isPending || isSelf}
              title={isSelf ? "You cannot disable your own account" : undefined}
              onClick={() => toggleStatus(user)}
            >
              {user.is_active ? (
                <IconUserOff aria-hidden="true" />
              ) : (
                <IconUserCheck aria-hidden="true" />
              )}
              {user.is_active ? "Disable" : "Enable"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={deleteMutation.isPending || isSelf}
              title={isSelf ? "You cannot delete your own account" : undefined}
              onClick={() => {
                setConfirmTarget(user);
                setConfirmOpen(true);
              }}
            >
              <IconUserX aria-hidden="true" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="outline" className="mb-3">
            Admin workspace
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            User management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Change roles, disable access, and remove accounts.
          </p>
        </div>
        <Card className="min-w-44 border-primary/15 bg-primary/5">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IconUsers className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold">
                {query.isLoading ? "—" : (totalUsers ?? users.length)}
              </p>
              <p className="text-xs text-muted-foreground">Matching users</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>All users</CardTitle>
            <CardDescription className="mt-1">
              Students, mentors and admins. Deleted accounts are hidden.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <IconSearch
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or email"
                aria-label="Search users by name or email"
                className="h-8 w-full pl-8 sm:w-56"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value as Role | "ALL");
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full sm:w-36"
                aria-label="Filter users by role"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full sm:w-36"
                aria-label="Filter users by status"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DISABLED">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            rows={users}
            rowKey={(user) => user.id}
            isLoading={query.isLoading}
            isError={query.isError}
            errorMessage="Could not load users. Please try again."
            emptyState={{
              icon: IconUsers,
              title: "No users found",
              description: "Try a different search or filter.",
            }}
            pagination={{
              page,
              totalPages,
              onPageChange: setPage,
              disabled: query.isLoading,
            }}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onOpenChangeComplete={(open) => {
          if (!open) {
            setConfirmTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {confirmTarget?.name ?? "this user"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget?.email} loses access immediately. Their submissions
              and reviews are kept, and the account disappears from this list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={confirmDelete}
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
