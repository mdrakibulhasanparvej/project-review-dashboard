export interface AdminPlatformOverview {
  users: {
    totalStudents: number;
    totalMentors: number;
    totalAdmins: number;
  };
  submissions: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  generatedAt: string;
}
