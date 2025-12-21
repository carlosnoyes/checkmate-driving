import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { theme } from "../../theme";
import { Appointment, AppointmentStatus } from "../../types/appointment";
import { Student } from "../../types/student";
import { User } from "../../types/user";
import { Car } from "../../types/car";
import { Location } from "../../types/location";
import { ClassKey } from "../../types/classKey";

export type AppointmentFormPayload = Omit<
  Appointment,
  "id" | "created_at" | "updated_at" | "student_detail" | "instructor_detail" | "car_detail" | "location_detail" | "class_key_detail"
>;

const inputStyle: React.CSSProperties = {
  background: theme.panel,
  border: `1px solid ${theme.border}`,
  borderRadius: 10,
  padding: "10px 12px",
  color: theme.text,
  fontSize: 14,
  width: "100%",
  outline: "none",
};

export function AppointmentFormModal({
  isOpen,
  onClose,
  onSave,
  initialAppointment,
  students,
  instructors,
  cars,
  locations,
  classKeys,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: AppointmentFormPayload) => Promise<void>;
  initialAppointment?: Appointment | null;
  students: Student[];
  instructors: User[];
  cars: Car[];
  locations: Location[];
  classKeys: ClassKey[];
}) {
  const [form, setForm] = useState<AppointmentFormPayload>({
    student: 0,
    instructor: null,
    car: null,
    location: null,
    class_key: null,
    start_at: "",
    end_at: "",
    status: "scheduled",
    pudo: false,
    no_show: false,
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toInputValue(value: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function toIsoString(value: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString();
  }

  useEffect(() => {
    if (initialAppointment) {
      setForm({
        student: initialAppointment.student,
        instructor: initialAppointment.instructor ?? null,
        car: initialAppointment.car ?? null,
        location: initialAppointment.location ?? null,
        class_key: initialAppointment.class_key ?? null,
        start_at: toInputValue(initialAppointment.start_at),
        end_at: toInputValue(initialAppointment.end_at),
        status: initialAppointment.status,
        pudo: Boolean(initialAppointment.pudo),
        no_show: Boolean(initialAppointment.no_show),
        notes: initialAppointment.notes ?? "",
      });
    } else {
      setForm({
        student: students[0]?.id ?? 0,
        instructor: null,
        car: null,
        location: null,
        class_key: null,
        start_at: "",
        end_at: "",
        status: "scheduled",
        pudo: false,
        no_show: false,
        notes: "",
      });
    }
  }, [initialAppointment, isOpen, students]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...form,
        student: Number(form.student),
        start_at: toIsoString(form.start_at),
        end_at: toIsoString(form.end_at),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save appointment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={initialAppointment ? "Edit Appointment" : "New Appointment"}
      onClose={onClose}
      width={720}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "transparent",
              border: `1px solid ${theme.border}`,
              color: theme.text,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="appointment-form"
            disabled={saving}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              background: theme.gradient,
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Appointment"}
          </button>
        </div>
      }
    >
      <form id="appointment-form" onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Student</div>
            <select
              style={inputStyle}
              value={form.student}
              onChange={(event) => setForm((prev) => ({ ...prev, student: Number(event.target.value) }))}
              required
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name || `${student.first_name} ${student.last_name}`}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Instructor</div>
            <select
              style={inputStyle}
              value={form.instructor ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, instructor: event.target.value ? Number(event.target.value) : null }))}
            >
              <option value="">Unassigned</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.first_name} {instructor.last_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Start</div>
            <input
              type="datetime-local"
              style={inputStyle}
              value={form.start_at}
              onChange={(event) => setForm((prev) => ({ ...prev, start_at: event.target.value }))}
              required
            />
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>End</div>
            <input
              type="datetime-local"
              style={inputStyle}
              value={form.end_at}
              onChange={(event) => setForm((prev) => ({ ...prev, end_at: event.target.value }))}
              required
            />
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Car</div>
            <select
              style={inputStyle}
              value={form.car ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, car: event.target.value ? Number(event.target.value) : null }))}
            >
              <option value="">Unassigned</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Location</div>
            <select
              style={inputStyle}
              value={form.location ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value ? Number(event.target.value) : null }))}
            >
              <option value="">Unassigned</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Class</div>
            <select
              style={inputStyle}
              value={form.class_key ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, class_key: event.target.value ? Number(event.target.value) : null }))}
            >
              <option value="">Unassigned</option>
              {classKeys.map((classKey) => (
                <option key={classKey.id} value={classKey.id}>
                  {classKey.key}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Status</div>
            <select
              style={inputStyle}
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as AppointmentStatus }))}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>PUDO</div>
            <select
              style={inputStyle}
              value={form.pudo ? "yes" : "no"}
              onChange={(event) => setForm((prev) => ({ ...prev, pudo: event.target.value === "yes" }))}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>No Show</div>
            <select
              style={inputStyle}
              value={form.no_show ? "yes" : "no"}
              onChange={(event) => setForm((prev) => ({ ...prev, no_show: event.target.value === "yes" }))}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </div>
        <label>
          <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Notes</div>
          <textarea
            style={{ ...inputStyle, minHeight: 80 }}
            value={form.notes || ""}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </label>
        {error && <div style={{ color: theme.danger, fontSize: 13 }}>{error}</div>}
      </form>
    </Modal>
  );
}
