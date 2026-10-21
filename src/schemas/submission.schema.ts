import z from "zod";

export const createSubmissionSchema = z.object({
  project_name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),
  repo_url: z.url("Repository URL must be a valid URL"),
  live_url: z.url("Live link must be a valid URL"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
});
