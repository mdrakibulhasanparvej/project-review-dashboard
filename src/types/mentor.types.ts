export type Gender = "MALE" | "FEMALE" | "KINDER" | "OTHER";

export interface MentorProfileUpdatePayload {
  designation?: string;
  specialization?: string;
  graduated_from?: string;
  graduation_year?: number;
  date_of_birth?: string | Date;
  gender?: Gender;
  phone?: string;
  address?: string;
  bio?: string;
}

/**
 * Shape returned by `GET /user/profile` for a MENTOR.
 * Every profile column is nullable in the database, so it is typed as
 * `string | null` rather than the optional `string` used by the update payload.
 */
export interface MentorProfile {
  mentor_id: string;
  designation: string | null;
  specialization: string | null;
  graduated_from: string | null;
  graduation_year: number | null;
  date_of_birth: string | null;
  gender: Gender | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface MentorQuery {
  page?: number;
  limit?: number;
}

export interface Mentor {
  mentor_id: string;
  designation: string | null;
  specialization: string | null;
  graduated_from: string | null;
  graduation_year: number | null;
  bio: string | null;
  user: {
    name: string;
    email: string;
    profile_url: string | null;
  };
}
