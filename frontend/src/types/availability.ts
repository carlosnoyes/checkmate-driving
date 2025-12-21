export interface InstructorAvailability {
  id: number;
  instructor: number;
  instructor_name?: string;
  day: string;
  start_time: string;
  end_time: string;
  location?: number | null;
  location_name?: string;
  status: string;
}
