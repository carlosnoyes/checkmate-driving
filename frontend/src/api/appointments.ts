import { Appointment } from "../types/appointment";

const baseUrl = "/api/appointments/";

export async function listAppointments(): Promise<Appointment[]> {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error("Failed to load appointments");
  return response.json();
}

export async function createAppointment(payload: Omit<Appointment, "id">): Promise<Appointment> {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create appointment");
  return response.json();
}
