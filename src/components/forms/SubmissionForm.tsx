"use client";

import {
  IconAlignLeft,
  IconArrowUpRight,
  IconBrandGithub,
  IconFolder,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSubmission } from "@/hooks";
import {
  createSubmissionSchema,
  DESCRIPTION_MAX_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
} from "@/schemas";
import triggerToast from "@/utils/triggerToast";

/** Live counter shown opposite the label; the field guide card holds the rules. */
function CharacterCount({
  id,
  value,
  max,
}: {
  id: string;
  value: number;
  max: number;
}) {
  return (
    <span
      id={id}
      className={cn(
        "shrink-0 text-xs tabular-nums transition-colors",
        value >= max
          ? "font-medium text-destructive"
          : "font-normal text-muted-foreground",
      )}
    >
      {value}/{max}
    </span>
  );
}

export function SubmissionForm({ className }: { className?: string }) {
  const { mutate: createSubmission, isPending } = useCreateSubmission();

  const form = useForm({
    defaultValues: {
      project_name: "",
      repo_url: "",
      live_url: "",
      description: "",
    },
    validators: {
      onSubmit: createSubmissionSchema,
    },
    onSubmit: ({ value, formApi }) => {
      createSubmission(value, {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Submission failed",
              description: response.message || "Could not submit the project.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Project submitted",
            description: "Your project was sent for mentor review.",
          });
          formApi.reset();
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Submission failed",
            description: error.data?.message || "Could not submit the project.",
          });
        },
      });
    },
  });

  const fieldState = (field: {
    state: {
      meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
    };
  }) => field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      className={className}
      aria-busy={isPending}
    >
      <FieldGroup>
        <form.Field name="project_name">
          {(field) => {
            const isInvalid = fieldState(field);
            return (
              <Field data-invalid={isInvalid} data-disabled={isPending}>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor={field.name}>
                    <IconFolder
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Project name
                  </FieldLabel>
                  <CharacterCount
                    id={`${field.name}-hint`}
                    value={field.state.value.length}
                    max={PROJECT_NAME_MAX_LENGTH}
                  />
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="e.g. Community Marketplace"
                  maxLength={PROJECT_NAME_MAX_LENGTH}
                  className="h-10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  aria-describedby={`${field.name}-hint`}
                  disabled={isPending}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-5 md:grid-cols-2">
          <form.Field name="repo_url">
            {(field) => {
              const isInvalid = fieldState(field);
              return (
                <Field data-invalid={isInvalid} data-disabled={isPending}>
                  <FieldLabel htmlFor={field.name}>
                    <IconBrandGithub
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Repository URL
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    placeholder="https://github.com/..."
                    spellCheck={false}
                    className="h-10"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    disabled={isPending}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="live_url">
            {(field) => {
              const isInvalid = fieldState(field);
              return (
                <Field data-invalid={isInvalid} data-disabled={isPending}>
                  <FieldLabel htmlFor={field.name}>
                    <IconArrowUpRight
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Live project URL
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    placeholder="https://your-project.com"
                    spellCheck={false}
                    className="h-10"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    disabled={isPending}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field) => {
            const isInvalid = fieldState(field);
            return (
              <Field data-invalid={isInvalid} data-disabled={isPending}>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor={field.name}>
                    <IconAlignLeft
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Project description
                  </FieldLabel>
                  <CharacterCount
                    id={`${field.name}-hint`}
                    value={field.state.value.length}
                    max={DESCRIPTION_MAX_LENGTH}
                  />
                </div>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={6}
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  placeholder="What does it do, and what should mentors focus on?"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  aria-describedby={`${field.name}-hint`}
                  disabled={isPending}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <FieldDescription className="text-xs text-muted-foreground">
            Mentors can leave feedback once you submit.
          </FieldDescription>
          <Button type="submit" disabled={isPending} size="lg">
            {isPending && <Spinner />}
            {isPending ? "Submitting…" : "Submit for review"}
            {!isPending && <IconArrowUpRight aria-hidden="true" />}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
