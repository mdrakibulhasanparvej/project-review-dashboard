import z from "zod";

/**
 * Kept alongside the schema so the form can mirror the caps in its counters and
 * `maxLength` attributes. Must match the backend `submission.schema.ts`.
 */
export const PROJECT_NAME_MIN_LENGTH = 3;
export const PROJECT_NAME_MAX_LENGTH = 100;
export const DESCRIPTION_MIN_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 1000;

export const createSubmissionSchema = z.object({
  project_name: z
    .string()
    .min(
      PROJECT_NAME_MIN_LENGTH,
      `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters`,
    )
    .max(
      PROJECT_NAME_MAX_LENGTH,
      `Project name must be at most ${PROJECT_NAME_MAX_LENGTH} characters`,
    ),
  repo_url: z.url("Repository URL must be a valid URL"),
  live_url: z.url("Live link must be a valid URL"),
  description: z
    .string()
    .min(
      DESCRIPTION_MIN_LENGTH,
      `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`,
    )
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
    ),
});
