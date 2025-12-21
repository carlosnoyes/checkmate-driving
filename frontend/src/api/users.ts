import { User } from "../types/user";

const baseUrl = "/api/users/";

export async function listUsers(): Promise<User[]> {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error("Failed to load users");
  const data = await response.json();
  return data.results ?? data;
}
