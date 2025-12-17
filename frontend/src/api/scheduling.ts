import { Appointment } from "../types/appointment";

export async function validateAppointmentWindow(payload: Omit<Appointment, "id">): Promise<boolean> {
  const response = await fetch("/api/appointments/validate/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) return false;
  const data = await response.json();
  return Boolean((data as { valid?: boolean }).valid);
}
