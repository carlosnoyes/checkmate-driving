import { Student } from "./student";
import { User } from "./user";
import { Car } from "./car";
import { Location } from "./location";
import { ClassKey } from "./classKey";

export type AppointmentStatus = "scheduled" | "completed" | "canceled";

export interface Appointment {
  id: number;
  student: number;
  instructor?: number | null;
  car?: number | null;
  location?: number | null;
  class_key?: number | null;
  start_at: string;
  end_at: string;
  status: AppointmentStatus;
  pudo?: boolean;
  no_show?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  student_detail?: Student;
  instructor_detail?: User;
  car_detail?: Car;
  location_detail?: Location;
  class_key_detail?: ClassKey;
}
