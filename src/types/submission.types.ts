import type z from "zod";
import type { createSubmissionSchema } from "@/schemas";

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CreateSubmissionPayload = z.infer<typeof createSubmissionSchema>;

export interface SubmissionQuery {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
}

export interface UpdateSubmissionStatusPayload {
  status: Exclude<SubmissionStatus, "PENDING">;
  feedback?: string;
}

export interface Submission {
  id: string;
  project_name: string;
  repo_url: string;
  live_url: string;
  description: string;
  status: SubmissionStatus;
  feedback: string | null;
  student_id: string;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  student?: {
    name: string;
    email: string;
    profile_url: string | null;
  };
}

export interface SubmissionStats {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  total: number;
}
