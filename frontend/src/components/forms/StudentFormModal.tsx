import React, { useEffect, useState } from "react";
import { Modal } from "../Modal";
import { theme } from "../../theme";
import { Student } from "../../types/student";
import { User } from "../../types/user";

export type StudentFormPayload = Omit<Student, "id" | "created_at" | "full_name" | "organization_name">;

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

export function StudentFormModal({
  isOpen,
  onClose,
  onSave,
  initialStudent,
  instructors,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: StudentFormPayload) => Promise<void>;
  initialStudent?: Student | null;
  instructors: User[];
}) {
  const [form, setForm] = useState<StudentFormPayload>({
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    status: "active",
    program_track: "",
    next_drive: "",
    assigned_instructor: null,
    hours_logged: 0,
    required_hours: 20,
    permit_expiration: "",
    payment_status: "pending",
    organization: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialStudent) {
      setForm({
        ...initialStudent,
        next_drive: initialStudent.next_drive || "",
        permit_expiration: initialStudent.permit_expiration || "",
        organization: initialStudent.organization ?? null,
      });
    } else {
      setForm({
        student_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        status: "active",
        program_track: "",
        next_drive: "",
        assigned_instructor: null,
        hours_logged: 0,
        required_hours: 20,
        permit_expiration: "",
        payment_status: "pending",
        organization: null,
      });
    }
  }, [initialStudent, isOpen]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...form,
        hours_logged: Number(form.hours_logged) || 0,
        required_hours: Number(form.required_hours) || 0,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save student.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={initialStudent ? "Edit Student" : "New Student"}
      onClose={onClose}
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
            form="student-form"
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
            {saving ? "Saving..." : "Save Student"}
          </button>
        </div>
      }
    >
      <form id="student-form" onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Student ID</div>
            <input
              style={inputStyle}
              value={form.student_id}
              onChange={(event) => setForm((prev) => ({ ...prev, student_id: event.target.value }))}
              required
            />
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Program Track</div>
            <input
              style={inputStyle}
              value={form.program_track}
              onChange={(event) => setForm((prev) => ({ ...prev, program_track: event.target.value }))}
            />
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>First Name</div>
            <input
              style={inputStyle}
              value={form.first_name}
              onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
              required
            />
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Last Name</div>
            <input
              style={inputStyle}
              value={form.last_name}
              onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
              required
            />
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Email</div>
            <input
              type="email"
              style={inputStyle}
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Phone</div>
            <input
              style={inputStyle}
              value={form.phone || ""}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Enrollment Status</div>
            <select
              style={inputStyle}
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as Student["status"] }))}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="graduated">Graduated</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Payment Status</div>
            <select
              style={inputStyle}
              value={form.payment_status}
              onChange={(event) => setForm((prev) => ({ ...prev, payment_status: event.target.value as Student["payment_status"] }))}
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Hours Logged</div>
            <input
              type="number"
              style={inputStyle}
              value={form.hours_logged}
              onChange={(event) => setForm((prev) => ({ ...prev, hours_logged: Number(event.target.value) }))}
            />
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Required Hours</div>
            <input
              type="number"
              style={inputStyle}
              value={form.required_hours}
              onChange={(event) => setForm((prev) => ({ ...prev, required_hours: Number(event.target.value) }))}
            />
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Next Drive</div>
            <input
              type="date"
              style={inputStyle}
              value={form.next_drive}
              onChange={(event) => setForm((prev) => ({ ...prev, next_drive: event.target.value }))}
            />
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Permit Expiration</div>
            <input
              type="date"
              style={inputStyle}
              value={form.permit_expiration}
              onChange={(event) => setForm((prev) => ({ ...prev, permit_expiration: event.target.value }))}
            />
          </label>
          <label>
            <div style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Assigned Instructor</div>
            <select
              style={inputStyle}
              value={form.assigned_instructor ?? ""}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, assigned_instructor: event.target.value ? Number(event.target.value) : null }))
              }
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
        {error && <div style={{ color: theme.danger, fontSize: 13 }}>{error}</div>}
      </form>
    </Modal>
  );
}
