import { Student } from "../types/student";

const baseUrl = "/api/students/";

export async function listStudents(): Promise<Student[]> {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error("Failed to load students");
  const data = await response.json();
  return data.results ?? data;
}

export async function createStudent(payload: Omit<Student, "id" | "created_at">): Promise<Student> {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Create student error:", response.status, errorData);
    throw new Error(JSON.stringify(errorData) || "Failed to create student");
  }
  return response.json();
}
