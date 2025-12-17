import { useState } from "react";
import { createStudent } from "../api/students";
import { StudentStatus } from "../types/student";

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: "#f1f5f9",
};

const inputStyle: React.CSSProperties = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "10px",
  color: "#f1f5f9",
};

export function StudentForm({ onCreated }: { onCreated?: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<StudentStatus>("active");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createStudent({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      status,
    });
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setStatus("active");
    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
      <div style={fieldStyle}>
        <label>First name</label>
        <input style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label>Last name</label>
        <input style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label>Email</label>
        <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label>Phone</label>
        <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div style={fieldStyle}>
        <label>Status</label>
        <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as StudentStatus)}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button
        type="submit"
        style={{
          background: "linear-gradient(90deg, #4f46e5, #6366f1)",
          color: "#f1f5f9",
          border: "none",
          borderRadius: "10px",
          padding: "12px",
        }}
      >
        Save student
      </button>
    </form>
  );
}
