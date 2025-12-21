import { Car } from "../types/car";
import { ClassKey } from "../types/classKey";
import { InstructorAvailability } from "../types/availability";
import { Location } from "../types/location";

const baseUrl = "/api/resources/";

async function fetchList<T>(path: string): Promise<T[]> {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  const data = await response.json();
  return data.results ?? data;
}

export async function listLocations(): Promise<Location[]> {
  return fetchList<Location>("locations/");
}

export async function listCars(): Promise<Car[]> {
  return fetchList<Car>("cars/");
}

export async function listClassKeys(): Promise<ClassKey[]> {
  return fetchList<ClassKey>("class-keys/");
}

export async function listInstructorAvailability(): Promise<InstructorAvailability[]> {
  return fetchList<InstructorAvailability>("instructor-availability/");
}
