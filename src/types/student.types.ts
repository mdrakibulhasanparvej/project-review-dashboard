import type { Gender } from "./mentor.types";

export interface StudentProfileUpdatePayload {
  date_of_birth?: string | Date;
  gender?: Gender;
  phone?: string;
  address?: string;
  bio?: string;
}

/**
 * Shape returned by `GET /user/profile` for a STUDENT.
 * Every profile column is nullable in the database, so it is typed as
 * `string | null` rather than the optional `string` used by the update payload.
 */
export interface StudentProfile {
  student_id: string;
  date_of_birth: string | null;
  gender: Gender | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}
