"use client";

import {
  IconAlignLeft,
  IconExternalLink,
  IconLink,
  IconMessageCircle,
} from "@tabler/icons-react";
import { cn } from "cn";
import { type ComponentType, type ReactNode, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Submission } from "@/types";
import SubmissionActionButtons from "./SubmissionActionButtons";
import {
  FEEDBACK_MAX_LENGTH,
  formatSubmissionStatus,
  submissionStatusStyle,
} from "./status";
import { toBulletPoints, toParagraphs } from "./text";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: "true" | "false";
}>;

interface SubmissionDrawerProps {
  submission: Submission | null;
  onOpenChange: (open: boolean) => void;
  /**
   * Mentor mode. Pass `onFeedbackChange` and `onReviewed` together to get the
   * editable feedback box and the approve / request-revision actions. Without
   * them the drawer is read-only, which is what students see.
   */
  feedback?: string;
  onFeedbackChange?: (value: string) => void;
  onReviewed?: () => void;
}

function formatSubmittedAt(value: string) {
  const submittedAt = new Date(value);
  const date = submittedAt.toLocaleDateString();
  const time = submittedAt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} · ${time}`;
}

/** One block of the drawer, stacked top to bottom. */
function DrawerSection({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: IconComponent;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <h3 className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </h3>
      {children}
    </section>
  );
}

export default function SubmissionDrawer({
  submission,
  onOpenChange,
  feedback = "",
  onFeedbackChange,
  onReviewed,
}: SubmissionDrawerProps) {
  // Base UI keeps the panel mounted while the exit transition plays, so hold on
  // to the last submission to let the drawer slide out with its content intact.
  const [lastSubmission, setLastSubmission] = useState(submission);

  useEffect(() => {
    if (submission) setLastSubmission(submission);
  }, [submission]);

  const current = submission ?? lastSubmission;
  const isReviewing = Boolean(onFeedbackChange && onReviewed);
  const paragraphs = toParagraphs(current?.feedback ?? "");

  return (
    <Sheet open={submission !== null} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
      >
        {current && (
          <>
            <SheetHeader className="gap-3 border-b p-5 pr-14">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1.5",
                    submissionStatusStyle[current.status],
                  )}
                >
                  <span
                    className="size-1.5 rounded-full bg-current"
                    aria-hidden="true"
                  />
                  {formatSubmissionStatus(current.status)}
                </Badge>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatSubmittedAt(current.created_at)}
                </span>
              </div>
              <SheetTitle className="text-lg leading-snug">
                {current.project_name}
              </SheetTitle>
              <SheetDescription className="truncate">
                {/* {current.student?.name ?? "Unknown student"} */}
                {current.student?.email ? ` · ${current.student.email}` : ""}
              </SheetDescription>
            </SheetHeader>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5">
              <DrawerSection label="Links" icon={IconLink}>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={current.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    Repository
                    <IconExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={current.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    Live demo
                    <IconExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </DrawerSection>

              <DrawerSection label="Project description" icon={IconAlignLeft}>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground marker:text-muted-foreground/50">
                  {toBulletPoints(current.description).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </DrawerSection>

              <DrawerSection label="Mentor feedback" icon={IconMessageCircle}>
                {isReviewing && current.status === "PENDING" ? (
                  <>
                    <Textarea
                      rows={5}
                      maxLength={FEEDBACK_MAX_LENGTH}
                      value={feedback}
                      aria-label="Mentor feedback"
                      placeholder="Share clear, constructive feedback with the student."
                      onChange={(event) =>
                        onFeedbackChange?.(event.target.value)
                      }
                    />
                    <p className="text-right text-xs text-muted-foreground tabular-nums">
                      {feedback.length}/{FEEDBACK_MAX_LENGTH}
                    </p>
                  </>
                ) : paragraphs.length > 0 ? (
                  <div className="space-y-2">
                    {paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-6 whitespace-pre-line text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No feedback was provided.
                  </p>
                )}
              </DrawerSection>
            </div>

            <SheetFooter className="items-end border-t p-5">
              {isReviewing ? (
                <SubmissionActionButtons
                  submission={current}
                  feedback={feedback}
                  onReviewed={onReviewed}
                />
              ) : (
                <SheetClose render={<Button variant="outline" />}>
                  Close
                </SheetClose>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
