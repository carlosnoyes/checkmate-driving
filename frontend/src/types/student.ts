export type StudentStatus = "active" | "paused" | "graduated" | "completed";
export type PaymentStatus = "paid" | "pending" | "overdue";

export interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  status: StudentStatus;
  program_track?: string;
  next_drive?: string;
  assigned_instructor?: number | null;
  assigned_instructor_name?: string;
  hours_logged?: number;
  required_hours?: number;
  permit_expiration?: string;
  payment_status?: PaymentStatus;
  organization?: number | null;
  organization_name?: string;
  created_at?: string;
}
