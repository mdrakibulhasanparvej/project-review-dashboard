"use client";

import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import { useUpdateSubmissionStatus } from "@/hooks";
import type { Submission } from "@/types";
import triggerToast from "@/utils/triggerToast";

interface SubmissionActionButtonsProps {
  submission: Submission;
  feedback: string;
  onReviewed?: () => void;
}

export default function SubmissionActionButtons({
  submission,
  feedback,
  onReviewed,
}: SubmissionActionButtonsProps) {
  const updateStatus = useUpdateSubmissionStatus();

  const handleReview = (status: "APPROVED" | "REJECTED") => {
    updateStatus.mutate(
      {
        id: submission.id,
        payload: { status, feedback: feedback.trim() },
      },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Review update failed",
              description:
                response.message || "Could not update the submission.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title:
              status === "APPROVED" ? "Project approved" : "Revision requested",
            description:
              status === "APPROVED"
                ? "The student submission was approved."
                : "Feedback was sent to the student.",
          });
          onReviewed?.();
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Review update failed",
            description:
              error.data?.message || "Could not update the submission.",
          });
        },
      },
    );
  };

  if (submission.status !== "PENDING") {
    return (
      <Button size="sm" variant="ghost" disabled>
        Reviewed
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={updateStatus.isPending}
        onClick={() => handleReview("REJECTED")}
      >
        <IconCircleX aria-hidden="true" />
        Request revision
      </Button>
      <Button
        size="sm"
        disabled={updateStatus.isPending}
        onClick={() => handleReview("APPROVED")}
      >
        <IconCircleCheck aria-hidden="true" />
        Approve project
      </Button>
    </div>
  );
}
