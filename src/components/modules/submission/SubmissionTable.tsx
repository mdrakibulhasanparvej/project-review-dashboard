"use client";

import {
  IconExternalLink,
  IconInbox,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import MyPagination from "@/components/shared/Pagination";
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
import { useGetSubmissions } from "@/hooks";
import type { Submission, SubmissionQuery } from "@/types";
import SubmissionDrawer from "./SubmissionDrawer";
import { formatSubmissionStatus, submissionStatusStyle } from "./status";

interface SubmissionTableProps {
  params: SubmissionQuery;
  page: number;
  handlePageChange: (page: number) => void;
}

export default function SubmissionTable({
  params,
  page,
  handlePageChange,
}: SubmissionTableProps) {
  const query = useGetSubmissions(params);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");

  const submissions = query.data?.data ?? [];
  const totalPages = query.data?.meta?.totalPages ?? 1;

  const openReview = (submission: Submission) => {
    setFeedback(submission.feedback ?? "");
    setActiveSubmission(submission);
  };

  const closeReview = () => {
    setActiveSubmission(null);
    setFeedback("");
  };

  return (
    <>
      {query.isError ? (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          role="alert"
        >
          Could not load submissions. Please try again.
        </div>
      ) : query.isLoading ? (
        <TableSkeleton columns={5} rows={5} />
      ) : submissions.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <IconInbox
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <p className="font-medium">No submissions found</p>
          <p className="text-sm text-muted-foreground">
            Try a different status filter or check back later.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="max-w-64">
                  <p className="truncate font-medium">
                    {submission.project_name}
                  </p>
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
                  <div className="font-medium">
                    {submission.student?.name ?? "Unknown student"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {submission.student?.email ?? ""}
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
                <TableCell className="text-muted-foreground">
                  {new Date(submission.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {submission.status === "PENDING" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openReview(submission)}
                    >
                      <IconMessageCircle aria-hidden="true" />
                      Review
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openReview(submission)}
                    >
                      View feedback
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SubmissionDrawer
        submission={activeSubmission}
        onOpenChange={(open) => {
          if (!open) closeReview();
        }}
        feedback={feedback}
        onFeedbackChange={setFeedback}
        onReviewed={closeReview}
      />

      <MyPagination
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        disabled={query.isLoading}
      />
    </>
  );
}
