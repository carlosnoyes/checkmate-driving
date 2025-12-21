import { useEffect, useMemo, useState } from "react";
import { createStudent, listStudents, updateStudent } from "../api/students";
import { listUsers } from "../api/users";
import { DataTable } from "../components/table/DataTable";
import { StudentFormModal } from "../components/forms/StudentFormModal";
import { theme } from "../theme";
import { Student } from "../types/student";
import { User } from "../types/user";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  async function load() {
    const [studentData, userData] = await Promise.all([listStudents(), listUsers()]);
    setStudents(studentData);
    setInstructors(userData.filter((user) => user.role === "instructor" || !user.role));
  }

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo(
    () => [
      { key: "student_id", label: "ID" },
      { key: "full_name", label: "Student", getValue: (row: Student) => row.full_name || `${row.first_name} ${row.last_name}` },
      { key: "program_track", label: "Program" },
      {
        key: "status",
        label: "Status",
        getValue: (row: Student) => row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "",
      },
      { key: "next_drive", label: "Next Drive" },
      { key: "assigned_instructor_name", label: "Instructor" },
      {
        key: "progress",
        label: "Progress",
        getValue: (row: Student) => `${row.hours_logged ?? 0}/${row.required_hours ?? 0}`,
        render: (row: Student) => {
          const logged = row.hours_logged ?? 0;
          const required = row.required_hours ?? 0;
          const percent = required ? Math.min(100, Math.round((logged / required) * 100)) : 0;
          return (
            <div style={{ display: "grid", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: theme.textSecondary }}>{logged}/{required}h</span>
                <span style={{ color: percent >= 100 ? theme.success : theme.textMuted }}>{percent}%</span>
              </div>
              <div style={{ height: 4, background: theme.panel, borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${percent}%`,
                    background: percent >= 100 ? theme.success : theme.accent,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        key: "payment_status",
        label: "Payment",
        getValue: (row: Student) =>
          row.payment_status ? row.payment_status.charAt(0).toUpperCase() + row.payment_status.slice(1) : "",
      },
    ],
    []
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <DataTable
        title="Students"
        columns={columns}
        rows={students}
        addLabel="Add Student"
        onAdd={() => {
          setSelectedStudent(null);
          setIsFormOpen(true);
        }}
        onRowClick={(row) => {
          setSelectedStudent(row);
          setIsFormOpen(true);
        }}
      />
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        instructors={instructors}
        initialStudent={selectedStudent}
        onSave={async (payload) => {
          if (selectedStudent) {
            await updateStudent(selectedStudent.id, payload);
          } else {
            await createStudent(payload);
          }
          await load();
        }}
      />
    </div>
  );
}
