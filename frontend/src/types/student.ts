export type StudentStatus = "active" | "completed";

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: StudentStatus;
  organization?: number;
  created_at?: string;
}
