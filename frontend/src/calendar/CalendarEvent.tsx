import { Appointment } from "../types/appointment";

export default function CalendarEvent({ appointment }: { appointment: Appointment }) {
  return (
    <div
      style={{
        background: "linear-gradient(120deg, #4f46e5, #06b6d4)",
        color: "#f1f5f9",
        borderRadius: "12px",
        padding: "12px",
        boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ fontSize: "14px", letterSpacing: "0.2px" }}>{appointment.status.toUpperCase()}</div>
      <div style={{ fontSize: "18px", fontWeight: 700, marginTop: 4 }}>
        {appointment.student_detail?.first_name ?? "Student"}
      </div>
      <div style={{ fontSize: "13px", color: "#e2e8f0" }}>
        {appointment.start_at} - {appointment.end_at}
      </div>
      {appointment.notes && <div style={{ marginTop: 6, color: "#cbd5e1" }}>{appointment.notes}</div>}
    </div>
  );
}
