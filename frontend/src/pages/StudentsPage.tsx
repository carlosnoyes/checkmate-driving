import { useEffect, useState } from "react";
import { listStudents } from "../api/students";
import { Student } from "../types/student";
import { StudentForm } from "../components/StudentForm";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  async function load() {
    const data = await listStudents();
    setStudents(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: "16px", padding: "24px" }}>
      <header>
        <h2 style={{ margin: 0 }}>Students</h2>
        <p style={{ color: "#94a3b8" }}>Manage student records and contact details.</p>
      </header>
      <div style={{ display: "grid", gap: "12px" }}>
        <StudentForm onCreated={load} />
      </div>
      <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px" }}>
        <h3 style={{ marginBottom: 8 }}>Student roster</h3>
        <div style={{ display: "grid", gap: "8px" }}>
          {students.map((student) => (
            <div
              key={student.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "10px",
                background: "#1e293b",
                borderRadius: "10px",
                border: "1px solid #334155",
              }}
            >
              <span>{`${student.first_name} ${student.last_name}`}</span>
              <span style={{ color: "#94a3b8" }}>{student.email}</span>
              <span style={{ color: student.status === "active" ? "#22d3ee" : "#f97316" }}>{student.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
