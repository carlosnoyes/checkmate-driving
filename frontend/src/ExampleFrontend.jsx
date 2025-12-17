import React, { useEffect, useMemo, useState } from "react";

const dataFiles = {
  adminSettings: "/example_data/admin_settings.csv",
  students: "/example_data/students.csv",
  instructors: "/example_data/instructor_availability.csv",
  calendar: "/example_data/calendar.csv",
  schedule: "/example_data/schedule.csv",
  communications: "/example_data/communications_templates.csv",
  payments: "/example_data/payments.csv",
  crm: "/example_data/crm_contacts.csv",
  metrics: "/example_data/data_metrics.csv",
  studentHours: "/example_data/student_hours.csv",
  modules: "/example_data/course_modules.csv",
  registrations: "/example_data/registration_classes.csv",
  payrollRules: "/example_data/payroll_rules.csv",
  payrollRuns: "/example_data/payroll_runs.csv",
  dmv: "/example_data/dmv_notifications.csv",
};

const pages = [
  { key: "admin", label: "Admin", description: "Configuration, guardrails, and campus ops." },
  { key: "students", label: "Students", description: "Add, update, and monitor student journeys." },
  { key: "instructors", label: "Instructors", description: "Availability and coverage health." },
  { key: "calendar", label: "Calendar", description: "Daily appointments in a calendar view." },
  { key: "schedule", label: "Schedule", description: "Tabular schedule with quick add." },
  { key: "communications", label: "Communications", description: "Reminders, reschedules, certificates." },
  { key: "payments", label: "Payments", description: "Processing state, balances, receipts." },
  { key: "crm", label: "CRM", description: "Partner and lead tracking." },
  { key: "metrics", label: "Data Tracking", description: "Dashboard KPIs with trends." },
  { key: "portal", label: "Student Portal", description: "Hours log and progress checks." },
  { key: "lms", label: "Learning", description: "Course module progress." },
  { key: "registration", label: "Online Registration", description: "Catalog and self-serve signups." },
  { key: "payroll", label: "Payroll", description: "Rules and runs generated automatically." },
  { key: "dmv", label: "DMV Compliance", description: "Completion notifications to DMV." },
  { key: "close", label: "Close Example", description: "Return to main app navigation." },
];

const theme = {
  font: "'Poppins', 'Segoe UI', sans-serif",
  bg: "#0f172a",
  panel: "#111827",
  surface: "#1f2937",
  accent: "#8b5cf6",
  soft: "#7dd3fc",
  text: "#e5e7eb",
  muted: "#94a3b8",
  border: "#1f2937",
};

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines.shift().split(",").map((h) => h.trim());
  return lines.map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] || "").trim();
    });
    return row;
  });
}

function useCsvData() {
  const [state, setState] = useState({ data: {}, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const entries = await Promise.all(
          Object.entries(dataFiles).map(async ([key, path]) => {
            const res = await fetch(path);
            if (!res.ok) {
              throw new Error(`Failed to load ${path}`);
            }
            const text = await res.text();
            return [key, parseCsv(text)];
          })
        );
        if (!cancelled) {
          setState({ data: Object.fromEntries(entries), loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ data: {}, loading: false, error: err.message || "Unable to load data" });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function Pill({ text, tone = "neutral" }) {
  const colors = {
    neutral: "rgba(255,255,255,0.08)",
    success: "#0ea5e9",
    warn: "#f97316",
    danger: "#ef4444",
    accent: theme.accent,
  };
  return (
    <span
      style={{
        background: colors[tone] || colors.neutral,
        color: theme.text,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        letterSpacing: 0.2,
      }}
    >
      {text}
    </span>
  );
}

function DataTable({ columns, rows, maxHeight = 320 }) {
  return (
    <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", background: theme.surface }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          padding: "12px 14px",
          background: "rgba(255,255,255,0.03)",
          color: theme.muted,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {columns.map((col) => (
          <div key={col.key}>{col.label}</div>
        ))}
      </div>
      <div style={{ maxHeight, overflow: "auto" }}>
        {rows.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              padding: "12px 14px",
              borderBottom: `1px solid ${theme.border}`,
              background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
            }}
          >
            {columns.map((col) => (
              <div key={col.key} style={{ color: theme.text, fontSize: 14 }}>
                {row[col.key] || ""}
              </div>
            ))}
          </div>
        ))}
        {!rows.length && (
          <div style={{ padding: 18, color: theme.muted, fontSize: 14 }}>No data loaded yet.</div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, hint, tone = "neutral" }) {
  const accents = {
    neutral: theme.soft,
    bright: theme.accent,
    calm: "#22d3ee",
  };
  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ color: theme.muted, fontSize: 13 }}>{title}</div>
      <div style={{ color: accents[tone] || accents.neutral, fontWeight: 700, fontSize: 22 }}>{value}</div>
      {hint && <div style={{ color: theme.muted, fontSize: 12 }}>{hint}</div>}
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
      <div>
        <div style={{ color: theme.text, fontSize: 22, fontWeight: 700 }}>{title}</div>
        <div style={{ color: theme.muted, fontSize: 14 }}>{description}</div>
      </div>
    </div>
  );
}

function AdminSetup({ rows }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
      <div>
        <SectionHeader title="Admin Setup" description="Guardrails, defaults, and operational preferences." />
        <DataTable
          columns={[
            { key: "setting", label: "Setting" },
            { key: "value", label: "Value" },
            { key: "owner", label: "Owner" },
            { key: "last_updated", label: "Updated" },
          ]}
          rows={rows}
        />
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <MetricCard title="Active Policies" value={`${rows.length}+`} hint="Configuration entries tracked" tone="bright" />
        <MetricCard title="Escalations" value="0" hint="Pending approvals" />
      </div>
    </div>
  );
}

function Students({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Students" description="Add new students, update status, and monitor readiness." />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
          { key: "enrolled_course", label: "Course" },
          { key: "next_drive", label: "Next Drive" },
          { key: "progress_pct", label: "Progress" },
          { key: "advisor", label: "Advisor" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function Instructors({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Instructors" description="Coverage and availability across yards." />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "day", label: "Day" },
          { key: "start", label: "Start" },
          { key: "end", label: "End" },
          { key: "location", label: "Location" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function CalendarView({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Calendar" description="Planned appointments in chronological order." />
      <DataTable
        columns={[
          { key: "date", label: "Date" },
          { key: "time", label: "Time" },
          { key: "title", label: "Title" },
          { key: "student", label: "Student" },
          { key: "instructor", label: "Instructor" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function Schedule({ rows, onAdd }) {
  const [draft, setDraft] = useState({
    date: "2025-01-11",
    start: "09:00",
    end: "10:00",
    student: "",
    instructor: "",
    location: "Main Campus",
  });

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({
      appointment_id: `NEW-${Date.now()}`,
      vehicle: "TBD",
      status: "Planned",
      ...draft,
    });
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Schedule" description="Tabular view with inline add." />
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr)) auto",
          gap: 8,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: 12,
        }}
      >
        {[
          ["date", "Date"],
          ["start", "Start"],
          ["end", "End"],
          ["student", "Student"],
          ["instructor", "Instructor"],
          ["location", "Location"],
        ].map(([key, label]) => (
          <div key={key} style={{ display: "grid", gap: 4 }}>
            <label style={{ color: theme.muted, fontSize: 12 }}>{label}</label>
            <input
              value={draft[key]}
              onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
              style={{
                background: "rgba(255,255,255,0.04)",
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 14,
              }}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.soft})`,
            color: "#0b1021",
            border: "none",
            borderRadius: 10,
            padding: "12px 14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Add slot
        </button>
      </form>
      <DataTable
        columns={[
          { key: "date", label: "Date" },
          { key: "start", label: "Start" },
          { key: "end", label: "End" },
          { key: "student", label: "Student" },
          { key: "instructor", label: "Instructor" },
          { key: "location", label: "Location" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function Communications({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Communications" description="Templates and triggers." />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          { key: "channel", label: "Channel" },
          { key: "trigger", label: "Trigger" },
          { key: "enabled", label: "Enabled" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function Payments({ rows }) {
  const totals = useMemo(() => {
    const paid = rows.filter((r) => r.status === "Paid").reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const pending = rows.filter((r) => r.status !== "Paid").reduce((sum, r) => sum + Number(r.amount || 0), 0);
    return { paid, pending };
  }, [rows]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Payments" description="Processing state and balances." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        <MetricCard title="Paid" value={`$${totals.paid}`} hint="Settled receipts" tone="bright" />
        <MetricCard title="Outstanding" value={`$${totals.pending}`} hint="Pending or failed" />
        <MetricCard title="Records" value={`${rows.length}`} hint="Tracked payments" />
      </div>
      <DataTable
        columns={[
          { key: "payment_id", label: "ID" },
          { key: "student", label: "Student" },
          { key: "amount", label: "Amount" },
          { key: "method", label: "Method" },
          { key: "status", label: "Status" },
          { key: "invoice_date", label: "Invoice" },
          { key: "due_date", label: "Due" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function CRM({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="CRM" description="Partner and lead pipeline." />
      <DataTable
        columns={[
          { key: "organization", label: "Organization" },
          { key: "contact_name", label: "Contact" },
          { key: "role", label: "Role" },
          { key: "stage", label: "Stage" },
          { key: "last_contact", label: "Last" },
          { key: "next_step", label: "Next step" },
          { key: "owner", label: "Owner" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function DataTracking({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Data Tracking" description="Operational KPIs." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        {rows.map((row, idx) => (
          <MetricCard key={idx} title={row.metric} value={row.value} hint={`${row.period} � target ${row.target}`} tone="calm" />
        ))}
      </div>
    </div>
  );
}

function StudentPortal({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Student Portal" description="Log hours and show progress." />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "logged_hours", label: "Logged" },
          { key: "required_hours", label: "Required" },
          { key: "last_entry", label: "Last Entry" },
          { key: "coach", label: "Coach" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function LMS({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Learning Management" description="Module completion by student." />
      <DataTable
        columns={[
          { key: "title", label: "Module" },
          { key: "category", label: "Category" },
          { key: "progress", label: "Progress" },
          { key: "assigned_to", label: "Assigned" },
          { key: "due_date", label: "Due" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function Registration({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Online Registration" description="Catalog of classes and availability." />
      <DataTable
        columns={[
          { key: "title", label: "Class" },
          { key: "start_date", label: "Start" },
          { key: "capacity", label: "Capacity" },
          { key: "slots_filled", label: "Filled" },
          { key: "price", label: "Price" },
          { key: "location", label: "Location" },
        ]}
        rows={rows}
      />
    </div>
  );
}

function Payroll({ rules, runs }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="Payroll" description="Rules and calculated runs." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ color: theme.muted, marginBottom: 6 }}>Rules</div>
          <DataTable
            columns={[
              { key: "description", label: "Description" },
              { key: "rate_type", label: "Rate Type" },
              { key: "rate_value", label: "Value" },
              { key: "applies_to", label: "Applies To" },
            ]}
            rows={rules}
            maxHeight={220}
          />
        </div>
        <div>
          <div style={{ color: theme.muted, marginBottom: 6 }}>Runs</div>
          <DataTable
            columns={[
              { key: "period", label: "Period" },
              { key: "processed_date", label: "Processed" },
              { key: "total_hours", label: "Hours" },
              { key: "total_pay", label: "Pay" },
              { key: "status", label: "Status" },
            ]}
            rows={runs}
            maxHeight={220}
          />
        </div>
      </div>
    </div>
  );
}

function DMV({ rows }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionHeader title="DMV Compliance" description="Completion notifications and statuses." />
      <DataTable
        columns={[
          { key: "student", label: "Student" },
          { key: "course_completed", label: "Course" },
          { key: "completion_date", label: "Completed" },
          { key: "submitted_date", label: "Submitted" },
          { key: "status", label: "Status" },
          { key: "dmv_case", label: "DMV Case" },
        ]}
        rows={rows}
      />
    </div>
  );
}

export default function ExampleFrontend() {
  const { data, loading, error } = useCsvData();
  const [activePage, setActivePage] = useState(pages[0].key);
  const [scheduleRows, setScheduleRows] = useState([]);

  useEffect(() => {
    if (data.schedule) {
      setScheduleRows(data.schedule);
    }
  }, [data.schedule]);

  const mainContent = useMemo(() => {
    if (loading) {
      return <div style={{ color: theme.muted }}>Loading mock data�</div>;
    }
    if (error) {
      return <div style={{ color: "#f87171" }}>Failed to load CSVs: {error}</div>;
    }

    switch (activePage) {
      case "admin":
        return <AdminSetup rows={data.adminSettings || []} />;
      case "students":
        return <Students rows={data.students || []} />;
      case "instructors":
        return <Instructors rows={data.instructors || []} />;
      case "calendar":
        return <CalendarView rows={data.calendar || []} />;
      case "schedule":
        return <Schedule rows={scheduleRows} onAdd={(row) => setScheduleRows((prev) => [row, ...prev])} />;
      case "communications":
        return <Communications rows={data.communications || []} />;
      case "payments":
        return <Payments rows={data.payments || []} />;
      case "crm":
        return <CRM rows={data.crm || []} />;
      case "metrics":
        return <DataTracking rows={data.metrics || []} />;
      case "portal":
        return <StudentPortal rows={data.studentHours || []} />;
      case "lms":
        return <LMS rows={data.modules || []} />;
      case "registration":
        return <Registration rows={data.registrations || []} />;
      case "payroll":
        return <Payroll rules={data.payrollRules || []} runs={data.payrollRuns || []} />;
      case "dmv":
        return <DMV rows={data.dmv || []} />;
      default:
        return null;
    }
  }, [activePage, data, error, loading, scheduleRows]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 20% 20%, rgba(125, 211, 252, 0.14), transparent 28%), radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.18), transparent 25%), ${theme.bg}`,
        fontFamily: theme.font,
        color: theme.text,
        display: "grid",
        gridTemplateColumns: "260px 1fr",
      }}
    >
      <aside
        style={{
          background: theme.panel,
          borderRight: `1px solid ${theme.border}`,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.soft})`,
              display: "grid",
              placeItems: "center",
              color: "#0b1021",
              fontWeight: 800,
            }}
          >
            CD
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Checkmate ERP</div>
            <div style={{ color: theme.muted, fontSize: 12 }}>Driving School</div>
          </div>
        </div>
        <div style={{ height: 1, background: theme.border }} />
        <div style={{ display: "grid", gap: 8 }}>
          {pages.map((page) => (
            <button
              key={page.key}
              onClick={() => { if (page.key === "close") { window.location.href = "/students"; } else { setActivePage(page.key); } }}
              style={{
                background: activePage === page.key ? "rgba(255,255,255,0.08)" : "transparent",
                border: `1px solid ${activePage === page.key ? theme.soft : theme.border}`,
                color: theme.text,
                borderRadius: 12,
                padding: "10px 12px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontWeight: 700 }}>{page.label}</div>
              <div style={{ color: theme.muted, fontSize: 12 }}>{page.description}</div>
            </button>
          ))}
        </div>
      </aside>

      <main style={{ padding: 24, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: theme.muted, fontSize: 13 }}>ERP Wireframe</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Operational Control Center</div>
        </div>
        {mainContent}
      </main>
    </div>
  );
}








