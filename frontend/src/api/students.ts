import { Student } from "../types/student";

const baseUrl = "/api/students/";

export async function listStudents(): Promise<Student[]> {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error("Failed to load students");
  return response.json();
}

export async function createStudent(payload: Omit<Student, "id" | "created_at">): Promise<Student> {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create student");
  return response.json();
}
