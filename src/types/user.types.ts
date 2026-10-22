export type Role = "STUDENT" | "MENTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  google_id: string | null;
  profile_url: string | null;
  profile_public_id: string | null;
  role: Role;
  provider: "CREDENTIALS" | "GOOGLE";
  user_status: "ACTIVE" | "BAN";
  is_active: boolean;
  is_deleted: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  student?: import("./student.types").StudentProfile | null;
  mentor?: import("./mentor.types").MentorProfile | null;
}

export interface UserProfileUpdatePayload {
  name?: string;
}

export interface UserQuery {
  role?: Role;
  user_status?: "ACTIVE" | "BAN";
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface UserRoleUpdatePayload {
  role: Role;
}

export interface UserStatusUpdatePayload {
  is_active: boolean;
}
