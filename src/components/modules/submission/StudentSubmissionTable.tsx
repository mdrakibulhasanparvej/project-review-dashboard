"use client";

import {
  IconExternalLink,
  IconInbox,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import TableSkeleton from "@/components/shared/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMySubmissions } from "@/hooks";
import type { Submission } from "@/types";
import SubmissionDrawer from "./SubmissionDrawer";
import { formatSubmissionStatus, submissionStatusStyle } from "./status";

/** Date with the time of day stacked underneath, e.g. 10/21/2026 over 09:34 AM. */
function SubmittedAt({ createdAt }: { createdAt: string }) {
  const submittedAt = new Date(createdAt);

  return (
    <>
      <p className="text-sm text-muted-foreground tabular-nums">
        {submittedAt.toLocaleDateString()}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground/70 tabular-nums">
        {submittedAt.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </>
  );
}

export default function StudentSubmissionTable() {
  const query = useGetMySubmissions();
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(
    null,
  );
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
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Project
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Status
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Submitted
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Feedback
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="max-w-64 px-4 py-3.5 align-top">
                <p className="truncate font-medium">
                  {submission.project_name}
                </p>
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
                  className={`gap-1.5 ${submissionStatusStyle[submission.status]}`}
                >
                  <span
                    className="size-1.5 rounded-full bg-current"
                    aria-hidden="true"
                  />
                  {formatSubmissionStatus(submission.status)}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3.5 text-right align-top">
                <SubmittedAt createdAt={submission.created_at} />
              </TableCell>
              <TableCell className="px-4 py-3.5 text-right align-top">
                {submission.feedback ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveSubmission(submission)}
                  >
                    <IconMessageCircle aria-hidden="true" />
                    View feedback
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Awaiting review
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SubmissionDrawer
        submission={activeSubmission}
        onOpenChange={(open) => {
          if (!open) setActiveSubmission(null);
        }}
      />
    </>
  );
}
