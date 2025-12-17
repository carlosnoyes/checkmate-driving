import { useState } from "react";
import { validateAppointmentWindow } from "../api/scheduling";
import { AppointmentStatus } from "../types/appointment";

const containerStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
  padding: "16px",
  background: "#0f172a",
  borderRadius: "12px",
  border: "1px solid #1e293b",
  color: "#f1f5f9",
};

export function ScheduleForm() {
  const [studentId, setStudentId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("scheduled");
  const [message, setMessage] = useState<string | null>(null);

  async function handleValidate(event: React.FormEvent) {
    event.preventDefault();
    const isValid = await validateAppointmentWindow({
      student: Number(studentId),
      instructor: instructorId ? Number(instructorId) : undefined,
      start_at: startAt,
      end_at: endAt,
      status,
      notes: "",
    });
    setMessage(isValid ? "Slot available" : "Conflict detected");
  }

  return (
    <form onSubmit={handleValidate} style={containerStyle}>
      <h3 style={{ margin: 0 }}>Validate schedule</h3>
      <label>
        <span style={{ display: "block", marginBottom: 4 }}>Student ID</span>
        <input value={studentId} onChange={(e) => setStudentId(e.target.value)} style={{ width: "100%" }} />
      </label>
      <label>
        <span style={{ display: "block", marginBottom: 4 }}>Instructor ID</span>
        <input value={instructorId} onChange={(e) => setInstructorId(e.target.value)} style={{ width: "100%" }} />
      </label>
      <label>
        <span style={{ display: "block", marginBottom: 4 }}>Start</span>
        <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} style={{ width: "100%" }} />
      </label>
      <label>
        <span style={{ display: "block", marginBottom: 4 }}>End</span>
        <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} style={{ width: "100%" }} />
      </label>
      <label>
        <span style={{ display: "block", marginBottom: 4 }}>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus)} style={{ width: "100%" }}>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </label>
      <button
        type="submit"
        style={{
          background: "linear-gradient(90deg, #818cf8, #4f46e5)",
          color: "#f1f5f9",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        Check availability
      </button>
      {message && <div style={{ color: message.includes("available") ? "#22d3ee" : "#f97316" }}>{message}</div>}
    </form>
  );
}
