import { useState } from "react";
import { createAppointment } from "../api/appointments";
import { validateAppointmentWindow } from "../api/scheduling";
import { AppointmentStatus } from "../types/appointment";

const containerStyle: React.CSSProperties = {
  display: "grid",
  gap: "12px",
  color: "#f1f5f9",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const inputStyle: React.CSSProperties = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "10px",
  color: "#f1f5f9",
};

export function AppointmentForm({ onCreated }: { onCreated?: () => void }) {
  const [studentId, setStudentId] = useState<number>(0);
  const [instructorId, setInstructorId] = useState<number | undefined>();
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>("scheduled");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const isValid = await validateAppointmentWindow({
      student: studentId,
      instructor: instructorId,
      start_at: startAt,
      end_at: endAt,
      status,
      notes,
    });
    if (!isValid) {
      setError("The selected time conflicts with an existing appointment.");
      return;
    }
    await createAppointment({
      student: studentId,
      instructor: instructorId,
      start_at: startAt,
      end_at: endAt,
      status,
      notes,
    });
    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <div style={fieldStyle}>
        <label>Student ID</label>
        <input
          style={inputStyle}
          value={studentId || ""}
          onChange={(e) => setStudentId(Number(e.target.value))}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label>Instructor ID</label>
        <input
          style={inputStyle}
          value={instructorId ?? ""}
          onChange={(e) => setInstructorId(Number(e.target.value))}
        />
      </div>
      <div style={fieldStyle}>
        <label>Start</label>
        <input
          type="datetime-local"
          style={inputStyle}
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label>End</label>
        <input
          type="datetime-local"
          style={inputStyle}
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          required
        />
      </div>
      <div style={fieldStyle}>
        <label>Status</label>
        <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus)}>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      <div style={fieldStyle}>
        <label>Notes</label>
        <textarea style={inputStyle} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {error && <div style={{ color: "#f97316" }}>{error}</div>}
      <button
        type="submit"
        style={{
          background: "linear-gradient(90deg, #06b6d4, #4f46e5)",
          color: "#f1f5f9",
          border: "none",
          borderRadius: "10px",
          padding: "12px",
        }}
      >
        Save appointment
      </button>
    </form>
  );
}
