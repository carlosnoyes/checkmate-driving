import { useEffect, useMemo, useState } from "react";
import { createAppointment, listAppointments, updateAppointment } from "../api/appointments";
import { listInstructorAvailability } from "../api/resources";
import { listUsers } from "../api/users";
import { listCars, listClassKeys, listLocations } from "../api/resources";
import { listStudents } from "../api/students";
import { AppointmentFormModal } from "../components/forms/AppointmentFormModal";
import { DataTable } from "../components/table/DataTable";
import { Appointment } from "../types/appointment";
import { InstructorAvailability } from "../types/availability";
import { Car } from "../types/car";
import { ClassKey } from "../types/classKey";
import { Location } from "../types/location";
import { Student } from "../types/student";
import { User } from "../types/user";

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<InstructorAvailability[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [classKeys, setClassKeys] = useState<ClassKey[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  async function load() {
    const [aptData, availabilityData, studentData, userData, carData, locationData, classKeyData] = await Promise.all([
      listAppointments(),
      listInstructorAvailability(),
      listStudents(),
      listUsers(),
      listCars(),
      listLocations(),
      listClassKeys(),
    ]);
    setAppointments(aptData);
    setAvailability(availabilityData);
    setStudents(studentData);
    setInstructors(userData.filter((user) => user.role === "instructor" || !user.role));
    setCars(carData);
    setLocations(locationData);
    setClassKeys(classKeyData);
  }

  useEffect(() => {
    load();
  }, []);

  const appointmentColumns = useMemo(
    () => [
      { key: "start_at", label: "Start" },
      { key: "end_at", label: "End" },
      {
        key: "student",
        label: "Student",
        getValue: (row: Appointment) => row.student_detail?.full_name || row.student_detail?.first_name || row.student,
      },
      {
        key: "instructor",
        label: "Instructor",
        getValue: (row: Appointment) =>
          row.instructor_detail ? `${row.instructor_detail.first_name} ${row.instructor_detail.last_name}` : row.instructor ?? "",
      },
      { key: "car", label: "Car", getValue: (row: Appointment) => (row.car_detail?.name || row.car) ?? "" },
      { key: "location", label: "Location", getValue: (row: Appointment) => (row.location_detail?.name || row.location) ?? "" },
      { key: "class_key", label: "Class", getValue: (row: Appointment) => (row.class_key_detail?.key || row.class_key) ?? "" },
      {
        key: "status",
        label: "Status",
        getValue: (row: Appointment) => row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "",
      },
    ],
    []
  );

  const availabilityColumns = useMemo(
    () => [
      { key: "day", label: "Day" },
      { key: "start_time", label: "Start" },
      { key: "end_time", label: "End" },
      { key: "instructor_name", label: "Instructor" },
      { key: "location_name", label: "Location" },
      {
        key: "status",
        label: "Status",
        getValue: (row: InstructorAvailability) =>
          row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "",
      },
    ],
    []
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <DataTable
        title="Schedule"
        columns={appointmentColumns}
        rows={appointments}
        addLabel="New Appointment"
        onAdd={() => {
          setSelectedAppointment(null);
          setIsFormOpen(true);
        }}
        onRowClick={(row) => {
          setSelectedAppointment(row);
          setIsFormOpen(true);
        }}
      />
      <DataTable title="Instructor Availability" columns={availabilityColumns} rows={availability} />
      <AppointmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialAppointment={selectedAppointment}
        students={students}
        instructors={instructors}
        cars={cars}
        locations={locations}
        classKeys={classKeys}
        onSave={async (payload) => {
          if (selectedAppointment) {
            await updateAppointment(selectedAppointment.id, payload);
          } else {
            await createAppointment(payload);
          }
          await load();
        }}
      />
    </div>
  );
}
