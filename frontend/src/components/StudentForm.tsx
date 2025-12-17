import { useState } from "react";
import { createStudent } from "../api/students";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createStudent({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status: "active",
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create student. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
      <div style={fieldStyle}>
        <label>First name</label>
        <input
          style={inputStyle}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label>Last name</label>
        <input
          style={inputStyle}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div style={fieldStyle}>
        <label>Email</label>
        <input
          type="email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label>Phone</label>
        <input
          type="tel"
          style={inputStyle}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {error && (
        <div style={{ color: "#f87171", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading
            ? "#475569"
            : "linear-gradient(90deg, #4f46e5, #6366f1)",
          color: "#f1f5f9",
          border: "none",
          borderRadius: "10px",
          padding: "12px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Saving..." : "Save student"}
      </button>
    </form>
  );
}
