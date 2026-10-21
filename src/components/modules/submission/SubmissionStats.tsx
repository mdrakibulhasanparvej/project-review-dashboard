"use client";

import {
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconSend,
} from "@tabler/icons-react";
import { cn } from "cn";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubmissionStats } from "@/hooks";

export default function SubmissionStats() {
  const { data, isLoading } = useGetSubmissionStats();
  const stats = data?.data;

  const cards = [
    {
      label: "Pending review",
      value: stats?.PENDING ?? 0,
      icon: IconClock,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Approved",
      value: stats?.APPROVED ?? 0,
      icon: IconCircleCheck,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Needs revision",
      value: stats?.REJECTED ?? 0,
      icon: IconCircleX,
      color: "text-destructive bg-destructive/10",
    },
    {
      label: "Total submissions",
      value: stats?.total ?? 0,
      icon: IconSend,
      color: "text-primary bg-primary/10",
    },
  ];

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Submission statistics"
    >
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-9 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {value}
                </p>
              )}
            </div>
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-xl",
                color,
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
