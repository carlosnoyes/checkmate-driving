import { useEffect, useState } from "react";
import { listAppointments } from "../api/appointments";
import { Appointment } from "../types/appointment";
import CalendarView from "../calendar/CalendarView";
import { AppointmentForm } from "../components/AppointmentForm";

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  async function load() {
    const data = await listAppointments();
    setAppointments(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: "24px", background: "#0f172a", minHeight: "100vh", color: "#f1f5f9" }}>
      <header style={{ marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>Calendar</h2>
        <p style={{ color: "#94a3b8" }}>Read-only calendar view and appointment intake.</p>
      </header>
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ background: "#111827", borderRadius: "12px", padding: "16px", border: "1px solid #1e293b" }}>
          <h3 style={{ marginTop: 0 }}>New appointment</h3>
          <AppointmentForm onCreated={load} />
        </div>
        <div>
          <CalendarView appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
