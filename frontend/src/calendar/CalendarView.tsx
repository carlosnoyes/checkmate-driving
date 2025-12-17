import CalendarEvent from "./CalendarEvent";
import { Appointment } from "../types/appointment";

export default function CalendarView({ appointments }: { appointments: Appointment[] }) {
  return (
    <div style={{ display: "grid", gap: "12px" }}>
      {appointments.map((appointment) => (
        <CalendarEvent key={appointment.id} appointment={appointment} />
      ))}
      {appointments.length === 0 && (
        <div style={{
          background: "#111827",
          color: "#94a3b8",
          padding: "16px",
          borderRadius: "10px",
          border: "1px dashed #334155",
        }}>
          No appointments scheduled yet.
        </div>
      )}
    </div>
  );
}
