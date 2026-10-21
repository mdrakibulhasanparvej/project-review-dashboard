"use client";

import {
  IconCheck,
  IconClock,
  IconRefresh,
  IconSend,
  IconUsers,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAdminOverview } from "@/hooks";

export default function AdminOverviewPage() {
  const query = useGetAdminOverview();
  const overview = query.data?.data;

  const cards = [
    {
      title: "Students",
      value: overview?.users.totalStudents,
      icon: IconUsers,
      description: "Active student accounts",
    },
    {
      title: "Mentors",
      value: overview?.users.totalMentors,
      icon: IconUsers,
      description: "Active mentor accounts",
    },
    {
      title: "Administrators",
      value: overview?.users.totalAdmins,
      icon: IconUsers,
      description: "Active admin accounts",
    },
    {
      title: "Submissions",
      value: overview?.submissions.total,
      icon: IconSend,
      description: "Projects submitted",
    },
    {
      title: "Pending reviews",
      value: overview?.submissions.pending,
      icon: IconClock,
      description: "Awaiting mentor review",
    },
    {
      title: "Approved",
      value: overview?.submissions.approved,
      icon: IconCheck,
      description: "Projects approved",
    },
    {
      title: "Needs revision",
      value: overview?.submissions.rejected,
      icon: IconRefresh,
      description: "Projects marked for revision",
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
            Platform overview
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitor active accounts and project review progress.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={query.isFetching}
          onClick={() => query.refetch()}
        >
          <IconRefresh
            className={query.isFetching ? "animate-spin" : ""}
            aria-hidden="true"
          />
          Refresh overview
        </Button>
      </section>

      {query.isError ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div>
              <p className="font-medium">Could not load platform overview</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The admin overview request failed. Try refreshing the data.
              </p>
            </div>
            <Button
              variant="outline"
              disabled={query.isFetching}
              onClick={() => query.refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(({ title, value, icon: Icon, description }) => (
              <Card key={title}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {query.isLoading ? "—" : (value ?? "—")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Review progress</CardTitle>
              <CardDescription>
                Submission status totals reported by the backend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Pending", overview?.submissions.pending],
                  ["Approved", overview?.submissions.approved],
                  ["Needs revision", overview?.submissions.rejected],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg border bg-background p-4"
                  >
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                    <span className="font-semibold">{value ?? "—"}</span>
                  </div>
                ))}
              </div>
              {overview?.generatedAt && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Updated{" "}
                  {new Date(overview.generatedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
