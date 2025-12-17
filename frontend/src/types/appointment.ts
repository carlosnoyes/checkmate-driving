import { Student } from "./student";

export type AppointmentStatus = "scheduled" | "completed" | "canceled";

export interface Appointment {
  id: number;
  student: number;
  instructor?: number;
  start_at: string;
  end_at: string;
  status: AppointmentStatus;
  notes?: string;
  student_detail?: Student;
}
