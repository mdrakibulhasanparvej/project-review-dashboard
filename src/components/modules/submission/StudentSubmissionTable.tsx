"use client";

import { IconExternalLink, IconInbox } from "@tabler/icons-react";
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
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Mentor feedback</TableHead>
          <TableHead>Submitted</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="max-w-64">
              <p className="truncate font-medium">{submission.project_name}</p>
              <div className="mt-1 flex gap-3 text-xs">
                <a
                  href={submission.repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                >
                  Repository{" "}
                  <IconExternalLink className="size-3" aria-hidden="true" />
                </a>
                <a
                  href={submission.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                >
                  Live demo{" "}
                  <IconExternalLink className="size-3" aria-hidden="true" />
                </a>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={submissionStatusStyle[submission.status]}
              >
                {formatSubmissionStatus(submission.status)}
              </Badge>
            </TableCell>
            <TableCell className="max-w-md">
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {submission.feedback ||
                  (submission.status === "PENDING"
                    ? "Awaiting mentor review."
                    : "No feedback was provided.")}
              </p>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(submission.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
