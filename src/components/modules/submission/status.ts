import type { SubmissionStatus } from "@/types";

/**
 * Must match the backend `feedback` cap in `submission.schema.ts`.
 * Without it the mentor can type past the limit and get a 400 back.
 */
export const FEEDBACK_MAX_LENGTH = 500;

export const submissionStatusStyle: Record<SubmissionStatus, string> = {
  PENDING:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  APPROVED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REJECTED: "border-destructive/20 bg-destructive/10 text-destructive",
};

export const formatSubmissionStatus = (status: SubmissionStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();
