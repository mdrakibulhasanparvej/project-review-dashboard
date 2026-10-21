"use client";

import { IconExternalLink, IconInbox } from "@tabler/icons-react";
import { cn } from "cn";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMySubmissions } from "@/hooks";
import { formatSubmissionStatus, submissionStatusStyle } from "./status";

export default function StudentSubmissionTable() {
  const query = useGetMySubmissions();
  const submissions = query.data?.data ?? [];

  if (query.isError) {
    return (
      <div
        className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        role="alert"
      >
        Could not load your submissions. Please try again.
      </div>
    );
  }

  if (query.isLoading) {
    return <TableSkeleton columns={4} rows={3} />;
  }

  if (submissions.length === 0) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
          <IconInbox
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
        </span>
        <p className="font-medium">No submissions yet</p>
        <p className="text-sm text-muted-foreground">
          Submit your first project to start the review process.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
          <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Project
          </TableHead>
          <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Status
          </TableHead>
          <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Mentor feedback
          </TableHead>
          <TableHead className="h-11 px-4 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Submitted
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="max-w-64 px-4 py-3.5 align-top">
              <p className="truncate font-medium">{submission.project_name}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <a
                  href={submission.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Repository
                  <IconExternalLink className="size-3" aria-hidden="true" />
                </a>
                <a
                  href={submission.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Live demo
                  <IconExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </TableCell>
            <TableCell className="px-4 py-3.5 align-top">
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5",
                  submissionStatusStyle[submission.status],
                )}
              >
                <span
                  className="size-1.5 rounded-full bg-current"
                  aria-hidden="true"
                />
                {formatSubmissionStatus(submission.status)}
              </Badge>
            </TableCell>
            <TableCell className="max-w-md px-4 py-3.5 align-top">
              <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
                <p
                  className={cn(
                    "whitespace-pre-wrap text-sm leading-6",
                    submission.feedback
                      ? "text-foreground/90"
                      : "text-muted-foreground italic",
                  )}
                >
                  {submission.feedback ||
                    (submission.status === "PENDING"
                      ? "Awaiting mentor review."
                      : "No feedback was provided.")}
                </p>
              </div>
            </TableCell>
            <TableCell className="px-4 py-3.5 text-right text-sm text-muted-foreground align-top tabular-nums">
              {new Date(submission.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
