"use client";

import {
  IconExternalLink,
  IconInbox,
  IconMessageCircle,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useGetSubmissions } from "@/hooks";
import type { SubmissionQuery } from "@/types";
import SubmissionActionButtons from "./SubmissionActionButtons";
import {
  FEEDBACK_MAX_LENGTH,
  formatSubmissionStatus,
  submissionStatusStyle,
} from "./status";

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
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const submissions = query.data?.data ?? [];
  const totalPages = query.data?.meta?.totalPages ?? 1;

  const toggleReview = (
    submissionId: string,
    existingFeedback?: string | null,
  ) => {
    if (reviewingId === submissionId) {
      setReviewingId(null);
      setFeedback("");
      return;
    }
    setReviewingId(submissionId);
    setFeedback(existingFeedback ?? "");
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
              <Fragment key={submission.id}>
                <TableRow>
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
                        <IconExternalLink
                          className="size-3"
                          aria-hidden="true"
                        />
                      </a>
                      <a
                        href={submission.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                      >
                        Live demo{" "}
                        <IconExternalLink
                          className="size-3"
                          aria-hidden="true"
                        />
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
                        onClick={() =>
                          toggleReview(submission.id, submission.feedback)
                        }
                      >
                        <IconMessageCircle aria-hidden="true" />
                        {reviewingId === submission.id
                          ? "Close review"
                          : "Review"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toggleReview(submission.id, submission.feedback)
                        }
                      >
                        {reviewingId === submission.id
                          ? "Hide details"
                          : "View feedback"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {reviewingId === submission.id && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/20">
                      <div className="grid gap-5 p-2 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
                        <div>
                          <h3 className="text-sm font-semibold">
                            Project description
                          </h3>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {submission.description}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`feedback-${submission.id}`}
                          >
                            Mentor feedback
                          </label>
                          {submission.status === "PENDING" ? (
                            <>
                              <Textarea
                                id={`feedback-${submission.id}`}
                                rows={3}
                                maxLength={FEEDBACK_MAX_LENGTH}
                                value={feedback}
                                onChange={(event) =>
                                  setFeedback(event.target.value)
                                }
                                placeholder="Share clear, constructive feedback with the student."
                              />
                              <p className="text-right text-xs text-muted-foreground">
                                {feedback.length}/{FEEDBACK_MAX_LENGTH}
                              </p>
                              <SubmissionActionButtons
                                submission={submission}
                                feedback={feedback}
                                onReviewed={() => {
                                  setReviewingId(null);
                                  setFeedback("");
                                }}
                              />
                            </>
                          ) : (
                            <p className="rounded-lg border bg-background p-3 text-sm leading-6 text-muted-foreground">
                              {submission.feedback ||
                                "No feedback was provided."}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}

      <MyPagination
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        disabled={query.isLoading}
      />
    </>
  );
}
