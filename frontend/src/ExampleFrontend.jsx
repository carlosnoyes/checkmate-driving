import React, { useCallback, useEffect, useMemo, useState } from "react";

const dataFiles = {
  adminSettings: "/example_data/admin_settings.csv",
  students: "/example_data/students.csv",
  instructors: "/example_data/instructor_availability.csv",
  calendar: "/example_data/calendar.csv",
  schedule: "/example_data/schedule.csv",
  appointments: "/example_data/appointments.csv",
  classKeys: "/example_data/class_keys.csv",
  cars: "/example_data/cars.csv",
  locations: "/example_data/locations.csv",
  teachers: "/example_data/teachers.csv",
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

// SVG Icons as components
const Icons = {
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  UserCheck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Briefcase: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  GraduationCap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  ClipboardList: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Car: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

const pages = [
  { key: "calendar", label: "Calendar", description: "Appointments calendar", icon: "Calendar", section: "scheduling" },
  { key: "schedule", label: "Schedule", description: "Quick add scheduling", icon: "Clock", section: "scheduling" },
  { key: "students", label: "Students", description: "Student roster & progress", icon: "Users", section: "operations" },
  { key: "communications", label: "Communications", description: "Templates & triggers", icon: "Mail", section: "operations" },
  { key: "payments", label: "Payments", description: "Balances & receipts", icon: "CreditCard", section: "operations" },
  { key: "crm", label: "CRM", description: "Leads & partners", icon: "Briefcase", section: "operations" },
  { key: "dmv", label: "DMV Compliance", description: "Completion reports", icon: "Shield", section: "operations" },
  { key: "portal", label: "Student Portal", description: "Hours & progress", icon: "GraduationCap", section: "learning" },
  { key: "lms", label: "Learning", description: "Course modules", icon: "BookOpen", section: "learning" },
  { key: "registration", label: "Registration", description: "Class catalog", icon: "ClipboardList", section: "learning" },
  { key: "admin", label: "Settings", description: "Configuration & guardrails", icon: "Settings", section: "admin" },
  { key: "metrics", label: "Data Tracking", description: "KPIs & analytics", icon: "BarChart", section: "admin" },
  { key: "payroll", label: "Payroll", description: "Rules & runs", icon: "DollarSign", section: "admin" },
  { key: "close", label: "Exit Demo", description: "Return to app", icon: "LogOut", section: "system" },
];

const sections = [
  { key: "scheduling", label: "Scheduling" },
  { key: "operations", label: "Operations" },
  { key: "learning", label: "Student Center" },
  { key: "admin", label: "Administration" },
  { key: "system", label: null },
];

const theme = {
  font: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  bg: "#0a0e1a",
  panel: "#0d1117",
  surface: "#161b22",
  surfaceHover: "#1c2128",
  card: "#21262d",
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentGlow: "rgba(99, 102, 241, 0.15)",
  success: "#10b981",
  successGlow: "rgba(16, 185, 129, 0.15)",
  warning: "#f59e0b",
  warningGlow: "rgba(245, 158, 11, 0.15)",
  danger: "#ef4444",
  dangerGlow: "rgba(239, 68, 68, 0.15)",
  info: "#3b82f6",
  infoGlow: "rgba(59, 130, 246, 0.15)",
  text: "#f0f6fc",
  textSecondary: "#8b949e",
  textMuted: "#6e7681",
  border: "#30363d",
  borderLight: "#21262d",
  gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
  gradientSubtle: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
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
  const [sort, setSort] = useState({ key: null, direction: "asc" });

  function parseForCompare(value) {
    if (value === undefined || value === null) return "";
    const trimmed = String(value).trim();
    const num = Number(trimmed);
    if (!Number.isNaN(num) && trimmed !== "") return num;
    const date = Date.parse(trimmed);
    if (!Number.isNaN(date)) return date;
    return trimmed.toLowerCase();
  }

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows;
    return [...rows].sort((a, b) => {
      const av = parseForCompare(a[sort.key]);
      const bv = parseForCompare(b[sort.key]);
      if (av < bv) return sort.direction === "asc" ? -1 : 1;
      if (av > bv) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sort.direction, sort.key]);

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

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
        {columns.map((col) => {
          const isActive = sort.key === col.key;
          const arrow = isActive ? (sort.direction === "asc" ? "▲" : "▼") : "⇅";
          return (
            <button
              key={col.key}
              onClick={() => toggleSort(col.key)}
              style={{
                background: "transparent",
                border: "none",
                color: isActive ? theme.text : theme.muted,
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                letterSpacing: 0.6,
              }}
            >
              <span>{col.label}</span>
              <span style={{ opacity: 0.65, fontSize: 10 }}>{arrow}</span>
            </button>
          );
        })}
      </div>
      <div style={{ maxHeight, overflow: "auto" }}>
        {sortedRows.map((row, idx) => (
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
          <div style={{ padding: 18, color: theme.muted, fontSize: 14 }}>No rows to display.</div>
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
  const [search, setSearch] = useState("");
  const [localRows, setLocalRows] = useState(rows);
  const [showForm, setShowForm] = useState(false);
  const [showSearchPopover, setShowSearchPopover] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // Sorting: { field: string, direction: 'asc' | 'desc' } or null
  const [sortConfig, setSortConfig] = useState(null);
  // Column filters: { [field]: Set of excluded values }
  const [columnFilters, setColumnFilters] = useState({});
  // Which column's filter popover is open
  const [activeColumnPopover, setActiveColumnPopover] = useState(null);
  const [draft, setDraft] = useState({
    student_id: "",
    name: "",
    program_track: "",
    enrollment_status: "",
    next_drive: "",
    assigned_instructor: "",
    hours_logged: "",
    required_hours: "",
    permit_expiration: "",
    payment_status: "",
  });

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  // Column configuration with field mapping
  const columns = useMemo(() => [
    { key: "student_id", label: "ID", field: "student_id" },
    { key: "name", label: "Student", field: "name" },
    { key: "program_track", label: "Program", field: "program_track" },
    { key: "enrollment_status", label: "Status", field: "enrollment_status" },
    { key: "next_drive", label: "Next Drive", field: "next_drive" },
    { key: "assigned_instructor", label: "Instructor", field: "assigned_instructor" },
    { key: "progress", label: "Progress", field: null }, // computed, no sorting/filtering
    { key: "payment_status", label: "Payment", field: "payment_status" },
  ], []);

  // Get unique values for a field (for filter toggles)
  const getUniqueValues = useCallback((field) => {
    if (!field) return [];
    const values = Array.from(new Set(localRows.map((r) => r[field]).filter(Boolean)));
    return values.sort();
  }, [localRows]);

  // Check if a field has few enough unique values to show toggles (<=10)
  const shouldShowToggles = useCallback((field) => {
    if (!field) return false;
    return getUniqueValues(field).length <= 10;
  }, [getUniqueValues]);

  // Toggle a value in column filter
  const toggleColumnFilterValue = useCallback((field, value) => {
    setColumnFilters(prev => {
      const current = prev[field] || new Set();
      const updated = new Set(current);
      if (updated.has(value)) {
        updated.delete(value);
      } else {
        updated.add(value);
      }
      // If all values are now included, remove the filter entirely
      if (updated.size === 0) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: updated };
    });
  }, []);

  // Clear filter for a column
  const clearColumnFilter = useCallback((field) => {
    setColumnFilters(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Handle column header click
  const handleColumnClick = useCallback((field) => {
    if (!field) return; // Skip non-sortable columns like Progress

    if (activeColumnPopover === field) {
      setActiveColumnPopover(null);
    } else {
      setActiveColumnPopover(field);
    }
  }, [activeColumnPopover]);

  // Handle sort toggle
  const handleSort = useCallback((field, direction) => {
    if (sortConfig?.field === field && sortConfig?.direction === direction) {
      // Clear sort if clicking same sort again
      setSortConfig(null);
    } else {
      setSortConfig({ field, direction });
    }
    setActiveColumnPopover(null);
  }, [sortConfig]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = localRows.filter((row) => {
      // Search filter
      const matchesSearch =
        !term ||
        [row.name, row.student_id, row.assigned_instructor, row.program_track]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(term));

      // Column filters (excluded values)
      const matchesColumnFilters = Object.entries(columnFilters).every(([field, excludedSet]) => {
        const value = row[field];
        return !excludedSet.has(value);
      });

      return matchesSearch && matchesColumnFilters;
    });

    // Apply sorting
    if (sortConfig?.field) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.field] || "";
        const bVal = b[sortConfig.field] || "";

        // Try numeric comparison first
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [localRows, search, columnFilters, sortConfig]);

  function handleAddStudent(e) {
    e.preventDefault();
    if (!draft.name || !draft.student_id) {
      return;
    }
    setLocalRows((prev) => [{ ...draft }, ...prev]);
    setShowForm(false);
    setDraft({
      student_id: "",
      name: "",
      program_track: "",
      enrollment_status: "",
      next_drive: "",
      assigned_instructor: "",
      hours_logged: "",
      required_hours: "",
      permit_expiration: "",
      payment_status: "",
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return { bg: theme.successGlow, color: theme.success, border: `1px solid ${theme.success}30` };
      case "Graduated": return { bg: theme.accentGlow, color: theme.accentLight, border: `1px solid ${theme.accent}30` };
      case "Paused": return { bg: theme.warningGlow, color: theme.warning, border: `1px solid ${theme.warning}30` };
      default: return { bg: theme.surface, color: theme.textSecondary, border: `1px solid ${theme.border}` };
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid": return { bg: theme.successGlow, color: theme.success };
      case "Pending": return { bg: theme.warningGlow, color: theme.warning };
      case "Overdue": return { bg: theme.dangerGlow, color: theme.danger };
      default: return { bg: theme.surface, color: theme.textSecondary };
    }
  };

  const getProgressPercent = (logged, required) => {
    const l = parseInt(logged) || 0;
    const r = parseInt(required) || 1;
    return Math.min(100, Math.round((l / r) * 100));
  };

  const inputStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "12px 16px",
    color: theme.text,
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "all 0.2s ease",
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "auto" }}>
      {/* Table Container - sticky behavior: sticks to top when scrolled */}
      <div style={{
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 56px)",
        background: theme.bg,
        zIndex: 10,
      }}>
          {/* Students Table - fills remaining space */}
          <div style={{
            flex: 1,
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "70px 1.5fr 1.2fr 100px 120px 1fr 140px 100px",
          padding: "10px 20px",
          background: theme.panel,
          borderBottom: `1px solid ${theme.border}`,
          gap: 16,
          alignItems: "center",
        }}>
          {/* Action Icons Column - Add & Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Add Student Button */}
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: theme.gradient,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)",
              }}
              title="Add Student"
            >
              <Icons.Plus />
            </button>

            {/* Search Button */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowSearchPopover(!showSearchPopover)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: showSearchPopover || search ? theme.surface : "transparent",
                  border: `1px solid ${showSearchPopover || search ? theme.accent : theme.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: showSearchPopover || search ? theme.accent : theme.textMuted,
                  transition: "all 0.15s ease",
                }}
                title="Search"
              >
                <Icons.Search />
              </button>
              {/* Search Popover */}
              {showSearchPopover && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  background: theme.panel,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  padding: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  zIndex: 100,
                  minWidth: 220,
                }}>
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    style={{
                      ...inputStyle,
                      padding: "8px 12px",
                      background: theme.surface,
                      fontSize: 13,
                      width: "100%",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowSearchPopover(false);
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setShowSearchPopover(false);
                      }}
                      style={{
                        marginTop: 8,
                        padding: "6px 12px",
                        fontSize: 12,
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 6,
                        color: theme.textSecondary,
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Column Headers */}
          {columns.slice(1).map((col, colIndex) => {
            const isSorted = sortConfig?.field === col.field;
            const hasFilter = col.field && columnFilters[col.field]?.size > 0;
            const isActive = isSorted || hasFilter;
            const isPopoverOpen = activeColumnPopover === col.field;
            const uniqueValues = col.field ? getUniqueValues(col.field) : [];
            const showToggles = shouldShowToggles(col.field);
            // Position popover to the right for the last 3 columns to prevent overflow
            const isRightAligned = colIndex >= columns.length - 4;

            return (
              <div key={col.key} style={{ position: "relative" }}>
                <button
                  onClick={() => handleColumnClick(col.field)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "4px 0",
                    cursor: col.field ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    width: "100%",
                  }}
                  disabled={!col.field}
                >
                  <span style={{
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? theme.accent : theme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    transition: "all 0.15s ease",
                  }}>
                    {col.label}
                  </span>
                  {/* Sort indicator */}
                  {isSorted && (
                    <span style={{ color: theme.accent, fontSize: 10 }}>
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                  {/* Filter indicator */}
                  {hasFilter && (
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: theme.accent,
                      flexShrink: 0,
                    }} />
                  )}
                </button>

                {/* Column Popover */}
                {isPopoverOpen && col.field && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      ...(isRightAligned ? { right: 0 } : { left: 0 }),
                      background: theme.panel,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      padding: 12,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      zIndex: 100,
                      minWidth: 180,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Sort Options */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
                      Sort
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: showToggles ? 12 : 0 }}>
                      <button
                        onClick={() => handleSort(col.field, "asc")}
                        style={{
                          padding: "6px 10px",
                          fontSize: 12,
                          background: sortConfig?.field === col.field && sortConfig?.direction === "asc" ? theme.accentGlow : theme.surface,
                          border: `1px solid ${sortConfig?.field === col.field && sortConfig?.direction === "asc" ? theme.accent : theme.border}`,
                          borderRadius: 6,
                          color: sortConfig?.field === col.field && sortConfig?.direction === "asc" ? theme.accent : theme.textSecondary,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>▲</span> A → Z
                      </button>
                      <button
                        onClick={() => handleSort(col.field, "desc")}
                        style={{
                          padding: "6px 10px",
                          fontSize: 12,
                          background: sortConfig?.field === col.field && sortConfig?.direction === "desc" ? theme.accentGlow : theme.surface,
                          border: `1px solid ${sortConfig?.field === col.field && sortConfig?.direction === "desc" ? theme.accent : theme.border}`,
                          borderRadius: 6,
                          color: sortConfig?.field === col.field && sortConfig?.direction === "desc" ? theme.accent : theme.textSecondary,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>▼</span> Z → A
                      </button>
                    </div>

                    {/* Filter Toggles (only if <=10 unique values) */}
                    {showToggles && uniqueValues.length > 0 && (
                      <>
                        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
                          Show
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
                          {uniqueValues.map((val) => {
                            const isExcluded = columnFilters[col.field]?.has(val);
                            return (
                              <button
                                key={val}
                                onClick={() => toggleColumnFilterValue(col.field, val)}
                                style={{
                                  padding: "6px 10px",
                                  fontSize: 12,
                                  background: isExcluded ? theme.surface : theme.accentGlow,
                                  border: `1px solid ${isExcluded ? theme.border : theme.accent}`,
                                  borderRadius: 6,
                                  color: isExcluded ? theme.textMuted : theme.accent,
                                  cursor: "pointer",
                                  textAlign: "left",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  opacity: isExcluded ? 0.6 : 1,
                                  textDecoration: isExcluded ? "line-through" : "none",
                                }}
                              >
                                <span style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: 3,
                                  border: `1px solid ${isExcluded ? theme.border : theme.accent}`,
                                  background: isExcluded ? "transparent" : theme.accent,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 10,
                                  color: "#fff",
                                }}>
                                  {!isExcluded && "✓"}
                                </span>
                                {val}
                              </button>
                            );
                          })}
                        </div>
                        {hasFilter && (
                          <button
                            onClick={() => clearColumnFilter(col.field)}
                            style={{
                              marginTop: 8,
                              padding: "6px 10px",
                              fontSize: 12,
                              background: theme.surface,
                              border: `1px solid ${theme.border}`,
                              borderRadius: 6,
                              color: theme.textSecondary,
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Show all
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Click outside to close popovers */}
        {(activeColumnPopover || showSearchPopover) && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
            }}
            onClick={() => {
              setActiveColumnPopover(null);
              setShowSearchPopover(false);
            }}
          />
        )}

        {/* Table Body */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {filteredRows.map((row, idx) => {
            const statusStyle = getStatusColor(row.enrollment_status);
            const paymentStyle = getPaymentColor(row.payment_status);
            const progress = getProgressPercent(row.hours_logged, row.required_hours);

            return (
              <div
                key={idx}
                onClick={() => setSelectedStudent(row)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1.5fr 1.2fr 100px 120px 1fr 140px 100px",
                  padding: "16px 20px",
                  borderBottom: `1px solid ${theme.borderLight}`,
                  gap: 16,
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.surfaceHover}
                onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"}
              >
                <div style={{ fontSize: 12, color: theme.textSecondary, fontFamily: "monospace" }}>
                  {row.student_id}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: theme.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                  }}>
                    {row.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{row.name}</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: theme.textSecondary }}>
                  {row.program_track}
                </div>
                <div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    border: statusStyle.border,
                  }}>
                    {row.enrollment_status}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: theme.textSecondary }}>
                  {row.next_drive || "-"}
                </div>
                <div style={{ fontSize: 14, color: theme.text }}>
                  {row.assigned_instructor}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: theme.textSecondary }}>{row.hours_logged}/{row.required_hours}h</span>
                    <span style={{ color: progress >= 100 ? theme.success : theme.textMuted }}>{progress}%</span>
                  </div>
                  <div style={{
                    height: 4,
                    background: theme.panel,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: progress >= 100 ? theme.success : theme.accent,
                      borderRadius: 2,
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>
                <div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: paymentStyle.bg,
                    color: paymentStyle.color,
                  }}>
                    {row.payment_status}
                  </span>
                </div>
              </div>
            );
          })}
          {filteredRows.length === 0 && (
            <div style={{
              padding: 40,
              textAlign: "center",
              color: theme.textSecondary,
            }}>
              <Icons.Users />
              <p style={{ marginTop: 12 }}>No students match your filters</p>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 20,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme.panel,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              width: "min(640px, 90vw)",
              maxHeight: "85vh",
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: "24px 28px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: theme.text, margin: 0 }}>
                  Add New Student
                </h2>
                <p style={{ fontSize: 14, color: theme.textSecondary, margin: "4px 0 0 0" }}>
                  Enter student details below
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <Icons.X />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddStudent} style={{ padding: "24px 28px", overflow: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { key: "student_id", label: "Student ID", type: "text", required: true, placeholder: "STU-XXX" },
                  { key: "name", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
                  { key: "program_track", label: "Program Track", type: "text", placeholder: "Teen Defensive Driving" },
                  { key: "enrollment_status", label: "Status", type: "text", placeholder: "Active" },
                  { key: "next_drive", label: "Next Drive", type: "date" },
                  { key: "assigned_instructor", label: "Instructor", type: "text", placeholder: "Instructor name" },
                  { key: "hours_logged", label: "Hours Logged", type: "number", placeholder: "0" },
                  { key: "required_hours", label: "Required Hours", type: "number", placeholder: "20" },
                  { key: "permit_expiration", label: "Permit Expiration", type: "date" },
                  { key: "payment_status", label: "Payment Status", type: "text", placeholder: "Pending" },
                ].map(({ key, label, type, required, placeholder }) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: theme.textSecondary,
                    }}>
                      {label} {required && <span style={{ color: theme.danger }}>*</span>}
                    </span>
                    <input
                      value={draft[key]}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                      type={type}
                      required={required}
                      placeholder={placeholder}
                      style={{
                        ...inputStyle,
                        background: theme.surface,
                      }}
                    />
                  </label>
                ))}
              </div>

              {/* Modal Footer */}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 28,
                paddingTop: 20,
                borderTop: `1px solid ${theme.border}`,
              }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: "transparent",
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    background: theme.gradient,
                    border: "none",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Sidebar */}
      {selectedStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 50,
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "min(480px, 100vw)",
              background: theme.panel,
              borderLeft: `1px solid ${theme.border}`,
              boxShadow: "-20px 0 40px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Sidebar Header */}
            <div style={{
              padding: "24px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: theme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 600,
                fontSize: 20,
                flexShrink: 0,
              }}>
                {selectedStudent.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: theme.text, margin: 0 }}>
                  {selectedStudent.name}
                </h3>
                <p style={{ fontSize: 14, color: theme.textSecondary, margin: "4px 0 0 0" }}>
                  {selectedStudent.student_id}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: 6,
                    ...getStatusColor(selectedStudent.enrollment_status),
                  }}>
                    {selectedStudent.enrollment_status}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: 6,
                    ...getPaymentColor(selectedStudent.payment_status),
                  }}>
                    {selectedStudent.payment_status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.X />
              </button>
            </div>

            {/* Sidebar Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
              {/* Progress Card */}
              <div style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: 20,
                marginBottom: 20,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>Training Progress</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: theme.accent }}>
                    {getProgressPercent(selectedStudent.hours_logged, selectedStudent.required_hours)}%
                  </span>
                </div>
                <div style={{
                  height: 8,
                  background: theme.panel,
                  borderRadius: 4,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${getProgressPercent(selectedStudent.hours_logged, selectedStudent.required_hours)}%`,
                    background: theme.gradient,
                    borderRadius: 4,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: theme.textSecondary }}>
                    {selectedStudent.hours_logged} hours logged
                  </span>
                  <span style={{ fontSize: 13, color: theme.textSecondary }}>
                    {selectedStudent.required_hours} hours required
                  </span>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Program Track", value: selectedStudent.program_track, icon: Icons.BookOpen },
                  { label: "Assigned Instructor", value: selectedStudent.assigned_instructor, icon: Icons.UserCheck },
                  { label: "Next Drive", value: selectedStudent.next_drive || "Not scheduled", icon: Icons.Calendar },
                  { label: "Permit Expiration", value: selectedStudent.permit_expiration, icon: Icons.Shield },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: theme.accentGlow,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.accent,
                    }}>
                      <Icon />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: theme.textMuted }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: theme.text, marginTop: 2 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div style={{
              padding: "20px 24px",
              borderTop: `1px solid ${theme.border}`,
              display: "flex",
              gap: 12,
            }}>
              <button style={{
                flex: 1,
                padding: "12px",
                borderRadius: 10,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: theme.text,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}>
                Edit Student
              </button>
              <button style={{
                flex: 1,
                padding: "12px",
                borderRadius: 10,
                background: theme.gradient,
                border: "none",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                Schedule Drive
              </button>
            </div>
          </div>
        </div>
      )}
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

// Teacher colors for calendar
const teacherColors = {
  "Michelle Noyes": { bg: "#6366f1", text: "#fff" },
  "Jake Morrison": { bg: "#10b981", text: "#fff" },
  "Helena Brooks": { bg: "#f59e0b", text: "#000" },
  "Dev Patel": { bg: "#ef4444", text: "#fff" },
  "Samira Ochoa": { bg: "#8b5cf6", text: "#fff" },
  "Pat Reese": { bg: "#06b6d4", text: "#000" },
};

// Car colors for calendar
const carColors = {
  "Car 1": { bg: "#6366f1", text: "#fff" },
  "Car 2": { bg: "#10b981", text: "#fff" },
  "Car 3": { bg: "#f59e0b", text: "#000" },
  "Car 4": { bg: "#ef4444", text: "#fff" },
  "Car 5": { bg: "#8b5cf6", text: "#fff" },
};

const legendPalette = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

function getReadableTextColor(hex) {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#000" : "#fff";
}

function buildColorMap(names, baseMap) {
  const map = { ...baseMap };
  const used = new Set(Object.values(baseMap).map((color) => color.bg));
  const available = legendPalette.filter((color) => !used.has(color));
  let idx = 0;

  (names || []).forEach((name) => {
    if (map[name]) return;
    const bg = available[idx % available.length] || legendPalette[idx % legendPalette.length];
    map[name] = { bg, text: getReadableTextColor(bg) };
    idx += 1;
  });

  return map;
}

// Parse time string to minutes from midnight
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Parse 24h time string to minutes from midnight
function parseTimeToMinutes24(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

// Parse date string to Date object
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
}

function CalendarView({
  appointments,
  instructors = [],
  classKeys = [],
  locations = [],
  students = [],
}) {
  const [localAppointments, setLocalAppointments] = useState(appointments || []);
  const [viewMode, setViewMode] = useState("car"); // "car" or "teacher"
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointmentDraft, setNewAppointmentDraft] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({ car: {}, teacher: {} });
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  const filteredAppointments = useMemo(
    () => (localAppointments || []).filter((apt) => apt.Canceled !== "TRUE"),
    [localAppointments]
  );
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Start with the month of the first appointment or current date
    if (filteredAppointments && filteredAppointments.length > 0) {
      const firstDate = parseDateString(filteredAppointments[0].Date);
      if (firstDate) return new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  const [selectedDay, setSelectedDay] = useState(null);
  const [hoveredApt, setHoveredApt] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const calendarRef = React.useRef(null);

  useEffect(() => {
    setLocalAppointments(appointments || []);
  }, [appointments]);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const availabilitySchedule = useMemo(() => {
    const locationToCar = {
      "North Yard": "Car 1",
      "South Yard": "Car 2",
      "East Lot": "Car 3",
    };
    return (instructors || [])
      .filter((row) => {
        const status = (row.status || "").toLowerCase();
        return status === "" || status === "available";
      })
      .map((row) => ({
        day_of_week: row.day,
        start_time: row.start,
        end_time: row.end,
        car_id: locationToCar[row.location] || "",
        teacher_name: row.name || "",
      }))
      .filter((row) => row.day_of_week && row.start_time && row.end_time);
  }, [instructors]);

  const scheduleByDay = useMemo(() => {
    const map = {};
    (availabilitySchedule || []).forEach((row) => {
      const day = row.day_of_week;
      if (!day) return;
      if (!map[day]) map[day] = [];
      map[day].push(row);
    });
    return map;
  }, [availabilitySchedule]);

  // Get all days in current month
  const monthDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add padding days from previous month to start on Sunday
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Add all days of current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }

    // Add padding days to complete the last week
    const endPadding = 6 - lastDay.getDay();
    for (let i = 1; i <= endPadding; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  }, [currentMonth]);

  // Group appointments by date (canceled removed)
  const appointmentsByDate = useMemo(() => {
    const grouped = {};
    (filteredAppointments || []).forEach(apt => {
      const dateKey = apt.Date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(apt);
    });
    return grouped;
  }, [filteredAppointments]);

  // Get unique cars and teachers from appointments + schedule
  const { uniqueCars, uniqueTeachers } = useMemo(() => {
    const cars = new Set();
    const teachers = new Set();
    (localAppointments || []).forEach(apt => {
      if (apt["Car ID"]) cars.add(apt["Car ID"]);
      if (apt["Teacher Name"]) teachers.add(apt["Teacher Name"]);
    });
    (availabilitySchedule || []).forEach((row) => {
      if (row.car_id) cars.add(row.car_id);
      if (row.teacher_name) teachers.add(row.teacher_name);
    });
    return {
      uniqueCars: Array.from(cars).sort(),
      uniqueTeachers: Array.from(teachers).sort(),
    };
  }, [localAppointments, availabilitySchedule]);

  const teacherColorMap = useMemo(
    () => buildColorMap(uniqueTeachers, teacherColors),
    [uniqueTeachers]
  );

  const carColorMap = useMemo(
    () => buildColorMap(uniqueCars, carColors),
    [uniqueCars]
  );

  const toggleColumnHidden = (name) => {
    setHiddenColumns((prev) => {
      const current = prev[viewMode] || {};
      return {
        ...prev,
        [viewMode]: { ...current, [name]: !current[name] },
      };
    });
  };

  const visibleCars = useMemo(() => uniqueCars, [uniqueCars]);

  const visibleTeachers = useMemo(() => uniqueTeachers, [uniqueTeachers]);

  const getClassLength = (classId) => {
    const found = (classKeys || []).find((row) => row["Class Key"] === classId);
    const length = found ? parseInt(found["Class Length"]) : 0;
    return Number.isNaN(length) ? 0 : length;
  };

  const toTimeInputFromMinutes = (minutes) => {
    const clamped = Math.max(0, Math.min(23 * 60 + 59, minutes));
    const hours = Math.floor(clamped / 60);
    const mins = clamped % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const addMinutesToTimeInput = (timeStr, minutesToAdd) => {
    const start = parseTimeToMinutes24(timeStr);
    if (start === 0 && timeStr !== "00:00") return "";
    return toTimeInputFromMinutes(start + minutesToAdd);
  };

  const buildNewAppointmentDraft = ({
    date,
    startTime,
    endTime,
    carId,
    teacherName,
  }) => {
    const classId = (classKeys && classKeys[0] && classKeys[0]["Class Key"]) || "";
    const duration = getClassLength(classId) || 120;
    const computedEnd = endTime || addMinutesToTimeInput(startTime, duration || 120);
    return {
      studentName: "",
      classId,
      teacherName: teacherName || "",
      carId: carId || "",
      location: "",
      date: toDateInput(date),
      startTime,
      endTime: computedEnd,
      notes: "",
    };
  };

  function toDateInput(dateStr) {
    const parts = (dateStr || "").split("/");
    if (parts.length !== 3) return "";
    const month = parts[0].padStart(2, "0");
    const day = parts[1].padStart(2, "0");
    return `${parts[2]}-${month}-${day}`;
  }

  function toTimeInput(timeStr) {
    if (!timeStr) return "";
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "";
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  function toDateDisplay(value) {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length !== 3) return "";
    return `${parseInt(parts[1])}/${parseInt(parts[2])}/${parts[0]}`;
  }

  function toTimeDisplay(value) {
    if (!value) return "";
    const parts = value.split(":");
    if (parts.length !== 2) return "";
    let hours = parseInt(parts[0]);
    const minutes = parts[1];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  const handleAppointmentUpdate = (updated) => {
    setLocalAppointments((prev) =>
      prev.map((apt) => (apt["APT-ID"] === updated["APT-ID"] ? updated : apt))
    );
    setSelectedAppointment(null);
  };

  const clearHoverIfNotAppointment = (event) => {
    const target = event.target;
    if (!target || !target.closest || !target.closest("[data-apt-hover='true']")) {
      setHoveredApt(null);
    }
  };

  // Format date to match CSV format
  const formatDateKey = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Get appointments for a specific day grouped by car or teacher
  const getDayAppointments = (date) => {
    const dateKey = formatDateKey(date);
    return appointmentsByDate[dateKey] || [];
  };

  // Navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group weeks
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      result.push(monthDays.slice(i, i + 7));
    }
    return result;
  }, [monthDays]);

  // UI constants
  const bottomBarHeight = 56;
  const dayHeaderHeight = 24;
  const legendMap = viewMode === "car" ? teacherColorMap : carColorMap;

  // Day detail view
  const DayDetailView = ({ date, onClose }) => {
      const dayAppts = getDayAppointments(date);
      const groupBy = viewMode === "car" ? "Car ID" : "Teacher Name";
      const colorBy = viewMode === "car" ? "Teacher Name" : "Car ID";
      const colorMap = viewMode === "car" ? teacherColorMap : carColorMap;
      const availabilityColorMap = viewMode === "car" ? teacherColorMap : carColorMap;
      const hiddenLegendMap = hiddenColumns[viewMode] || {};
      const filteredDayAppts = dayAppts.filter(
        (apt) => !hiddenLegendMap[apt[colorBy]]
      );

    // Group appointments
    const grouped = {};
    const columns = viewMode === "car" ? visibleCars : visibleTeachers;
    const dayKey = dayNames[date.getDay()];
                  const daySchedule = scheduleByDay[dayKey] || [];

    const columnAvailability = {};
    columns.forEach(col => {
      grouped[col] = filteredDayAppts.filter(apt => apt[groupBy] === col);
        columnAvailability[col] = daySchedule.filter((slot) =>
          viewMode === "car" ? slot.car_id === col : slot.teacher_name === col
        );
      });

    // Filter to only columns with appointments or availability
    const activeColumns = columns.filter(col => grouped[col].length > 0 || columnAvailability[col].length > 0);

    // Add "Other" column at the end (always visible)
    const OTHER_COLUMN = "Other";
    grouped[OTHER_COLUMN] = filteredDayAppts.filter(apt => apt[groupBy] === OTHER_COLUMN);
    columnAvailability[OTHER_COLUMN] = [];
    const allColumns = [...activeColumns, OTHER_COLUMN];

    // Time range for the day (6 AM to 8 PM)
    const startHour = 6;
    const endHour = 20;
    const totalHours = endHour - startHour;
    const timelinePadding = 16;
    const availableHeight = Math.max(320, viewportHeight * 0.9 - 200);
    const hourHeight = Math.max(
      18,
      Math.floor((availableHeight - timelinePadding * 2) / totalHours)
    );

    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }} onClick={onClose}>
        <div
          onClick={e => e.stopPropagation()}
          onMouseMove={clearHoverIfNotAppointment}
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            width: "min(95vw, 1200px)",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "12px 20px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: theme.text, margin: 0 }}>
                {dayNames[date.getDay()]}, {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
              </h2>
              <p style={{ fontSize: 12, color: theme.textSecondary, margin: "4px 0 0 0" }}>
                {filteredDayAppts.length} appointment{filteredDayAppts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* View toggle */}
            <div style={{
              display: "flex",
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
              padding: 2,
            }}>
              {[
                { key: "car", label: "By Car" },
                { key: "teacher", label: "By Teacher" },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setViewMode(opt.key)}
                  style={{
                    padding: "4px 10px",
                    border: "none",
                    borderRadius: 4,
                    background: viewMode === opt.key ? theme.accent : "transparent",
                    color: viewMode === opt.key ? "#fff" : theme.textSecondary,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.X />
            </button>
          </div>

          {/* Legend */}
          <div style={{
            padding: "12px 20px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            background: theme.surface,
          }}>
              <span style={{ fontSize: 12, color: theme.textMuted }}>
                {viewMode === "car" ? "Instructors:" : "Cars:"}
              </span>
            {Object.entries(legendMap).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => toggleColumnHidden(name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  opacity: hiddenColumns[viewMode]?.[name] ? 0.4 : 1,
                  textDecoration: hiddenColumns[viewMode]?.[name] ? "line-through" : "none",
                }}
              >
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: colors.bg,
                }} />
                <span style={{ fontSize: 12, color: theme.textSecondary }}>{name}</span>
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ flex: 1, overflow: "hidden", padding: timelinePadding, height: availableHeight }}>
            {allColumns.length === 1 && allColumns[0] === OTHER_COLUMN ? (
              <div style={{
                textAlign: "center",
                padding: 40,
                color: theme.textSecondary
              }}>
                No appointments scheduled for this day
              </div>
            ) : (
              <div style={{ display: "flex", gap: 0 }}>
                {/* Time labels */}
                <div style={{ width: 60, flexShrink: 0 }}>
                  <div style={{ height: 40 }} /> {/* Header spacer */}
                  {Array.from({ length: totalHours }, (_, i) => (
                    <div key={i} style={{
                      height: hourHeight,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "flex-end",
                      paddingRight: 8,
                      fontSize: 11,
                      color: theme.textMuted,
                    }}>
                      {((startHour + i) % 12) || 12}{(startHour + i) >= 12 ? "PM" : "AM"}
                    </div>
                  ))}
                </div>

                {/* Columns */}
                <div style={{
                  display: "flex",
                  flex: 1,
                  gap: 2,
                  overflowX: "auto",
                  overflowY: "hidden",
                }}>
                  {allColumns.map(column => {
                    const isOtherColumn = column === OTHER_COLUMN;
                    const availabilitySlots = (columnAvailability[column] || []).filter((slot) => {
                      const key = viewMode === "car" ? slot.teacher_name : slot.car_id;
                      return !hiddenLegendMap[key];
                    });

                    // Calculate column width based on number of columns
                    const columnCount = allColumns.length;
                    const minColWidth = columnCount > 6 ? 120 : 150;

                    return (
                    <div key={column} style={{
                      flex: columnCount <= 6 ? 1 : "0 0 auto",
                      minWidth: minColWidth,
                      maxWidth: columnCount <= 6 ? 300 : 180,
                      width: columnCount > 6 ? minColWidth : undefined,
                    }}>
                      {/* Column header */}
                      <div style={{
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: theme.surface,
                        borderRadius: "8px 8px 0 0",
                        border: `1px solid ${theme.border}`,
                        borderBottom: "none",
                        fontSize: 13,
                        fontWeight: 600,
                        color: theme.text,
                      }}>
                        {column}
                      </div>

                      {/* Timeline grid */}
                      <div style={{
                        position: "relative",
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: "0 0 8px 8px",
                      }} onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const offsetY = e.clientY - rect.top;
                        const minutesFromStart = Math.max(
                          0,
                          Math.min(totalHours * 60 - 1, Math.round((offsetY / hourHeight) * 60))
                        );
                        const snappedMinutes = Math.floor(minutesFromStart / 60) * 60;
                        const startMinutes = startHour * 60 + snappedMinutes;
                        const matchedSlot = availabilitySlots.find((slot) => {
                          const slotStart = parseTimeToMinutes24(slot.start_time);
                          const slotEnd = parseTimeToMinutes24(slot.end_time);
                          return startMinutes >= slotStart && startMinutes < slotEnd;
                        });
                        // Always use the clicked time for start, not the slot's start time
                        const startTime = toTimeInputFromMinutes(startMinutes);
                        const endTime = addMinutesToTimeInput(startTime, 120);
                        // For "Other" column, don't auto-populate car or instructor
                        const carId = isOtherColumn ? "" : (viewMode === "car" ? column : (matchedSlot ? matchedSlot.car_id : ""));
                        const teacherName = isOtherColumn ? "" : (viewMode === "teacher" ? column : (matchedSlot ? matchedSlot.teacher_name : ""));
                        setNewAppointmentDraft(
                          buildNewAppointmentDraft({
                            date: formatDateKey(date),
                            startTime,
                            endTime,
                            carId,
                            teacherName,
                          })
                        );
                      }}>
                        {/* Hour lines */}
                        {Array.from({ length: totalHours }, (_, i) => (
                          <div key={i} style={{
                            height: hourHeight,
                            borderBottom: i < totalHours - 1 ? `1px solid ${theme.borderLight}` : "none",
                          }} />
                        ))}

                        {/* Availability */}
                        {availabilitySlots.map((slot, slotIdx) => {
                          const startMin = parseTimeToMinutes24(slot.start_time);
                          const endMin = parseTimeToMinutes24(slot.end_time);
                          const top = ((startMin - startHour * 60) / 60) * hourHeight;
                          const height = ((endMin - startMin) / 60) * hourHeight;
                          const availabilityKey = viewMode === "car" ? slot.teacher_name : slot.car_id;
                          const availabilityColors = availabilityColorMap[availabilityKey] || { bg: theme.accent };
                          if (height <= 0) return null;
                          return (
                            <div
                              key={`avail-${slotIdx}`}
                              style={{
                                position: "absolute",
                                top: Math.max(0, top),
                                left: 4,
                                right: 4,
                                height: Math.max(8, height - 2),
                                background: "transparent",
                                border: `1px dashed ${availabilityColors.bg}`,
                                borderRadius: 6,
                                pointerEvents: "none",
                                zIndex: 1,
                              }}
                            />
                          );
                        })}

                        {/* Appointments */}
                        {grouped[column].map((apt, idx) => {
                          const startMin = parseTimeToMinutes(apt["Start Time"]);
                          const endMin = parseTimeToMinutes(apt["End Time"]);
                          const top = ((startMin - startHour * 60) / 60) * hourHeight;
                          const height = ((endMin - startMin) / 60) * hourHeight;
                          const colors = colorMap[apt[colorBy]] || { bg: theme.accent, text: "#fff" };
                          const isNoShow = apt["No-Show"] === "TRUE";

                          return (
                            <div
                              key={idx}
                              data-apt-hover="true"
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredApt(apt);
                                setHoverPos({ x: e.clientX, y: e.clientY });
                              }}
                              onMouseMove={(e) => {
                                setHoverPos({ x: e.clientX, y: e.clientY });
                              }}
                              onMouseLeave={(e) => {
                                e.stopPropagation();
                                setHoveredApt(null);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(apt);
                              }}
                              style={{
                                position: "absolute",
                                top: Math.max(0, top),
                                left: 4,
                                right: 4,
                                height: Math.max(20, height - 2),
                                background: isNoShow
                                  ? `linear-gradient(0deg, rgba(0,0,0,0.18), rgba(0,0,0,0.18)), ${colors.bg}`
                                  : colors.bg,
                                color: colors.text,
                                border: isNoShow ? `2px solid ${colors.bg}` : "none",
                                borderRadius: 6,
                                padding: "4px 8px",
                                fontSize: 11,
                                overflow: "hidden",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                opacity: isNoShow ? 0.7 : 1,
                                zIndex: 2,
                              }}
                              title={`${apt["Student Name"]} - ${apt["Class ID"]}\n${apt["Start Time"]} - ${apt["End Time"]}\n${apt["Teacher Name"]} / ${apt["Car ID"]}`}
                            >
                              <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {apt["Student Name"]}
                              </div>
                              {height > 40 && (
                                <div style={{ fontSize: 10, opacity: 0.9 }}>
                                  {apt["Start Time"]} - {apt["End Time"]}
                                </div>
                              )}
                              {height > 60 && (
                                <div style={{ fontSize: 10, opacity: 0.8 }}>
                                  {apt["Class ID"]}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Hover tooltip component
  const HoverTooltip = () => {
    if (!hoveredApt) return null;
    const apt = hoveredApt;
    return (
      <div style={{
        position: "fixed",
        left: hoverPos.x + 10,
        top: hoverPos.y + 10,
        background: theme.panel,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        maxWidth: 250,
        pointerEvents: "none",
      }}>
        <div style={{ fontWeight: 600, color: theme.text, fontSize: 13 }}>{apt["Student Name"]}</div>
        <div style={{ color: theme.textSecondary, fontSize: 11, marginTop: 4 }}>
          {apt["Start Time"]} - {apt["End Time"]}
        </div>
        <div style={{ color: theme.textSecondary, fontSize: 11 }}>
          {apt["Class ID"]} • {apt["Car ID"]}
        </div>
        <div style={{ color: theme.textSecondary, fontSize: 11 }}>
          Instructor: {apt["Teacher Name"]}
        </div>
        {apt.Notes && (
          <div style={{ color: theme.textMuted, fontSize: 10, marginTop: 4, fontStyle: "italic" }}>
            {apt.Notes}
          </div>
        )}
        {apt.Canceled === "TRUE" && (
          <div style={{ color: "#ef4444", fontSize: 10, marginTop: 4, fontWeight: 600 }}>CANCELED</div>
        )}
        {apt["No-Show"] === "TRUE" && (
          <div style={{ color: "#f59e0b", fontSize: 10, marginTop: 4, fontWeight: 600 }}>NO SHOW</div>
        )}
      </div>
    );
  };

  const EditAppointmentModal = () => {
    if (!selectedAppointment) return null;
    const apt = selectedAppointment;
    const [draft, setDraft] = useState({
      studentName: apt["Student Name"] || "",
      classId: apt["Class ID"] || "",
      teacherName: apt["Teacher Name"] || "",
      carId: apt["Car ID"] || "",
      location: apt.Location || "",
      date: toDateInput(apt.Date),
      startTime: toTimeInput(apt["Start Time"]),
      endTime: toTimeInput(apt["End Time"]),
      canceled: apt.Canceled === "TRUE",
      noShow: apt["No-Show"] === "TRUE",
      notes: apt.Notes || "",
    });

    const onSubmit = (e) => {
      e.preventDefault();
      const updated = {
        ...apt,
        "Student Name": draft.studentName,
        "Class ID": draft.classId,
        "Teacher Name": draft.teacherName,
        "Car ID": draft.carId,
        Location: draft.location,
        Date: toDateDisplay(draft.date),
        "Start Time": toTimeDisplay(draft.startTime),
        "End Time": toTimeDisplay(draft.endTime),
        Canceled: draft.canceled ? "TRUE" : "FALSE",
        "No-Show": draft.noShow ? "TRUE" : "FALSE",
        Notes: draft.notes,
      };
      handleAppointmentUpdate(updated);
    };

    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }} onClick={() => setSelectedAppointment(null)}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            width: "min(92vw, 620px)",
            maxHeight: "90vh",
            overflow: "auto",
            padding: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ color: theme.text, fontSize: 18, fontWeight: 600 }}>Edit Appointment</div>
              <div style={{ color: theme.textSecondary, fontSize: 12 }}>{apt["APT-ID"]}</div>
            </div>
            <button
              onClick={() => setSelectedAppointment(null)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.X />
            </button>
          </div>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Student</div>
                <input
                  value={draft.studentName}
                  onChange={(e) => setDraft((prev) => ({ ...prev, studentName: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Class</div>
                <input
                  value={draft.classId}
                  onChange={(e) => setDraft((prev) => ({ ...prev, classId: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Instructor</div>
                <select
                  value={draft.teacherName}
                  onChange={(e) => setDraft((prev) => ({ ...prev, teacherName: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  {uniqueTeachers.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Car</div>
                <select
                  value={draft.carId}
                  onChange={(e) => setDraft((prev) => ({ ...prev, carId: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  {uniqueCars.map((car) => (
                    <option key={car} value={car}>{car}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Date</div>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft((prev) => ({ ...prev, date: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Location</div>
                <input
                  value={draft.location}
                  onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Start Time</div>
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(e) => setDraft((prev) => ({ ...prev, startTime: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>End Time</div>
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(e) => setDraft((prev) => ({ ...prev, endTime: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: theme.textSecondary, fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={draft.canceled}
                  onChange={(e) => setDraft((prev) => ({ ...prev, canceled: e.target.checked }))}
                />
                Canceled
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: theme.textSecondary, fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={draft.noShow}
                  onChange={(e) => setDraft((prev) => ({ ...prev, noShow: e.target.checked }))}
                />
                No-Show
              </label>
            </div>

            <div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Notes</div>
              <textarea
                rows={3}
                value={draft.notes}
                onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  color: theme.text,
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: "transparent",
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: theme.gradient,
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const NewAppointmentModal = () => {
    const [draft, setDraft] = useState(newAppointmentDraft || {});

    useEffect(() => {
      if (newAppointmentDraft) {
        setDraft(newAppointmentDraft);
      }
    }, [newAppointmentDraft]);

    if (!newAppointmentDraft) return null;

    const onSubmit = (e) => {
      e.preventDefault();
      const newApt = {
        "APT-ID": generateAppointmentId(),
        Date: toDateDisplay(draft.date),
        "Start Time": toTimeDisplay(draft.startTime),
        "End Time": toTimeDisplay(draft.endTime),
        "Car ID": draft.carId,
        Location: draft.location,
        "Teacher Name": draft.teacherName,
        "Student Name": draft.studentName,
        "Class ID": draft.classId,
        PUDO: "0",
        Canceled: "FALSE",
        "No-Show": "FALSE",
        Notes: draft.notes,
      };
      setLocalAppointments((prev) => [...prev, newApt]);
      setNewAppointmentDraft(null);
    };

    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }} onClick={() => setNewAppointmentDraft(null)}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: theme.panel,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            width: "min(92vw, 620px)",
            maxHeight: "90vh",
            overflow: "auto",
            padding: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ color: theme.text, fontSize: 18, fontWeight: 600 }}>New Appointment</div>
              <div style={{ color: theme.textSecondary, fontSize: 12 }}>{toDateDisplay(draft.date)}</div>
            </div>
            <button
              onClick={() => setNewAppointmentDraft(null)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.X />
            </button>
          </div>

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Student</div>
                <select
                  value={draft.studentName}
                  onChange={(e) => setDraft((prev) => ({ ...prev, studentName: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  <option value="">Select student</option>
                  {(students || []).map((s) => (
                    <option key={s.student_id || s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Class</div>
                <select
                  value={draft.classId}
                  onChange={(e) => setDraft((prev) => ({ ...prev, classId: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  <option value="">Select class</option>
                  {(classKeys || []).map((row) => (
                    <option key={row["Class Key"]} value={row["Class Key"]}>{row["Class Key"]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Instructor</div>
                <select
                  value={draft.teacherName}
                  onChange={(e) => setDraft((prev) => ({ ...prev, teacherName: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  <option value="">Select instructor</option>
                  {uniqueTeachers.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Car</div>
                <select
                  value={draft.carId}
                  onChange={(e) => setDraft((prev) => ({ ...prev, carId: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  <option value="">Select car</option>
                  {uniqueCars.map((car) => (
                    <option key={car} value={car}>{car}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Date</div>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft((prev) => ({ ...prev, date: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Location</div>
                <select
                  value={draft.location}
                  onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  <option value="">Select location</option>
                  {(locations || []).map((row) => (
                    <option key={row.Location} value={row.Location}>{row.Location}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Start Time</div>
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(e) => setDraft((prev) => ({ ...prev, startTime: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>End Time</div>
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(e) => setDraft((prev) => ({ ...prev, endTime: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>Notes</div>
              <textarea
                rows={3}
                value={draft.notes}
                onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  color: theme.text,
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setNewAppointmentDraft(null)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: "transparent",
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: theme.gradient,
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={calendarRef}
      onMouseLeave={() => setHoveredApt(null)}
      onMouseMove={clearHoverIfNotAppointment}
      style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
    >
      {/* Day headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        background: theme.panel,
        borderBottom: `1px solid ${theme.border}`,
        flexShrink: 0,
        height: dayHeaderHeight,
      }}>
        {dayNames.map(day => (
          <div key={day} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: theme.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderRight: `1px solid ${theme.borderLight}`,
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - takes all available space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {weeks.map((week, weekIdx) => {
          // Time range for timeline (6 AM to 8 PM)
          const startHour = 6;
          const totalHours = 14;
          // Header height for day number
          const headerHeight = 20;

          return (
            <div
              key={weekIdx}
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                minHeight: 0,
              }}
            >
              {week.map((dayInfo, dayIdx) => {
                const dateKey = formatDateKey(dayInfo.date);
                const dayAppts = appointmentsByDate[dateKey] || [];
                const isToday = dayInfo.date.toDateString() === new Date().toDateString();
                  const groupBy = viewMode === "car" ? "Car ID" : "Teacher Name";
                  const colorBy = viewMode === "car" ? "Teacher Name" : "Car ID";
                  const colorMap = viewMode === "car" ? teacherColorMap : carColorMap;
                  const availabilityColorMap = viewMode === "car" ? teacherColorMap : carColorMap;
                const allColumns = viewMode === "car" ? visibleCars : visibleTeachers;
                const dayKey = dayNames[dayInfo.date.getDay()];
                const daySchedule = scheduleByDay[dayKey] || [];
                  const hiddenLegendMap = hiddenColumns[viewMode] || {};
                  const filteredDayAppts = dayAppts.filter((apt) => !hiddenLegendMap[apt[colorBy]]);

                // Group appointments by car/teacher
                const grouped = {};
                allColumns.forEach(col => grouped[col] = []);
                filteredDayAppts.forEach(apt => {
                  const key = apt[groupBy];
                  if (grouped[key]) grouped[key].push(apt);
                });

                const numColumns = allColumns.length;

                return (
                  <div
                    key={dayIdx}
                    onClick={() => setSelectedDay(dayInfo.date)}
                    style={{
                      borderRight: `1px solid ${theme.borderLight}`,
                      borderBottom: `1px solid ${theme.borderLight}`,
                      background: !dayInfo.isCurrentMonth
                        ? "rgba(0,0,0,0.2)"
                        : isToday
                          ? theme.accentGlow
                          : "transparent",
                      cursor: "pointer",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Day number header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "4px 6px",
                      height: headerHeight,
                      flexShrink: 0,
                      borderBottom: `1px solid ${theme.borderLight}`,
                    }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 500,
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: isToday ? theme.accent : "transparent",
                        color: isToday ? "#fff" : (!dayInfo.isCurrentMonth ? theme.textMuted : theme.text),
                      }}>
                        {dayInfo.date.getDate()}
                      </span>
                      {filteredDayAppts.length > 0 && (
                        <span style={{
                          fontSize: 9,
                          color: theme.textMuted,
                          background: theme.panel,
                          padding: "1px 4px",
                          borderRadius: 3,
                        }}>
                          {filteredDayAppts.length}
                        </span>
                      )}
                    </div>

                    {/* Timeline area with vertical columns */}
                    <div style={{
                      flex: 1,
                      position: "relative",
                      display: "flex",
                      overflow: "hidden",
                    }}>
                      {/* Columns for cars/teachers */}
                      <div style={{
                        display: "flex",
                        flex: 1,
                        position: "relative",
                        height: "100%",
                      }}>
                        {allColumns.map((column, colIdx) => {
                          const columnAppts = grouped[column] || [];
                          const availabilitySlots = daySchedule.filter((slot) =>
                            viewMode === "car" ? slot.car_id === column : slot.teacher_name === column
                          ).filter((slot) => {
                            const key = viewMode === "car" ? slot.teacher_name : slot.car_id;
                            return !hiddenLegendMap[key];
                          });
                          const hasAvailability = availabilitySlots.length > 0;

                          return (
                            <div
                              key={column}
                              style={{
                                flex: 1,
                                position: "relative",
                                borderRight: colIdx < numColumns - 1 ? `1px solid ${theme.borderLight}` : "none",
                                opacity: columnAppts.length === 0 && !hasAvailability ? 0.3 : 1,
                                height: "100%",
                              }}
                              title={column}
                            >
                              {/* Availability */}
                              {availabilitySlots.map((slot, slotIdx) => {
                                const startMin = parseTimeToMinutes24(slot.start_time);
                                const endMin = parseTimeToMinutes24(slot.end_time);
                                const topPercent = ((startMin - startHour * 60) / (totalHours * 60)) * 100;
                                const heightPercent = ((endMin - startMin) / (totalHours * 60)) * 100;
                                const availabilityKey = viewMode === "car" ? slot.teacher_name : slot.car_id;
                                const availabilityColors = availabilityColorMap[availabilityKey] || { bg: theme.accent };
                                if (heightPercent <= 0) return null;
                                return (
                                  <div
                                    key={`avail-${slotIdx}`}
                                    style={{
                                      position: "absolute",
                                      top: `${Math.max(0, topPercent)}%`,
                                      left: 1,
                                      right: 1,
                                      height: `${Math.max(2, heightPercent)}%`,
                                      background: "transparent",
                                      border: `1px dashed ${availabilityColors.bg}`,
                                      borderRadius: 2,
                                      pointerEvents: "none",
                                      zIndex: 1,
                                    }}
                                  />
                                );
                              })}

                              {/* Appointments in this column */}
                              {columnAppts.map((apt, aptIdx) => {
                                const startMin = parseTimeToMinutes(apt["Start Time"]);
                                const endMin = parseTimeToMinutes(apt["End Time"]);
                                // Calculate position as percentage of timeline
                                const topPercent = ((startMin - startHour * 60) / (totalHours * 60)) * 100;
                                const heightPercent = ((endMin - startMin) / (totalHours * 60)) * 100;
                                const colors = colorMap[apt[colorBy]] || { bg: theme.accent, text: "#fff" };
                                const isNoShow = apt["No-Show"] === "TRUE";

                                return (
                                  <div
                                    key={aptIdx}
                                    data-apt-hover="true"
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      setHoveredApt(apt);
                                      setHoverPos({ x: e.clientX, y: e.clientY });
                                    }}
                                    onMouseMove={(e) => {
                                      setHoverPos({ x: e.clientX, y: e.clientY });
                                    }}
                                    onMouseLeave={(e) => {
                                      e.stopPropagation();
                                      setHoveredApt(null);
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: `${Math.max(0, topPercent)}%`,
                                      left: 1,
                                      right: 1,
                                      height: `${Math.max(2, heightPercent)}%`,
                                      background: isNoShow
                                        ? `linear-gradient(0deg, rgba(0,0,0,0.18), rgba(0,0,0,0.18)), ${colors.bg}`
                                        : colors.bg,
                                      border: isNoShow ? `2px solid ${colors.bg}` : "none",
                                      borderRadius: 2,
                                      overflow: "hidden",
                                      opacity: isNoShow ? 0.6 : 1,
                                      zIndex: 2,
                                    }}
                                  />
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom bar with controls */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "6px 12px",
        background: theme.panel,
        borderTop: `1px solid ${theme.border}`,
        flexShrink: 0,
        height: bottomBarHeight,
      }}>
        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
          <button
            onClick={prevMonth}
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: "transparent",
              border: `1px solid ${theme.border}`,
              color: theme.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: theme.text,
            minWidth: 120,
            textAlign: "left",
          }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            onClick={nextMonth}
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: "transparent",
              border: `1px solid ${theme.border}`,
              color: theme.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          rowGap: 6,
          flex: 1,
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 11, color: theme.textMuted, whiteSpace: "nowrap" }}>
            {viewMode === "car" ? "Instructors:" : "Cars:"}
          </span>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            rowGap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "100%",
          }}>
            {Object.entries(legendMap).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => toggleColumnHidden(name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  opacity: hiddenColumns[viewMode]?.[name] ? 0.4 : 1,
                  textDecoration: hiddenColumns[viewMode]?.[name] ? "line-through" : "none",
                }}
              >
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: colors.bg,
                }} />
                <span style={{ fontSize: 11, color: theme.textSecondary }}>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div style={{
          display: "flex",
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 4,
          padding: 1,
          marginLeft: "auto",
        }}>
          {[
            { key: "car", label: "Car" },
            { key: "teacher", label: "Teacher" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setViewMode(opt.key)}
              style={{
                padding: "3px 8px",
                border: "none",
                borderRadius: 3,
                background: viewMode === opt.key ? theme.accent : "transparent",
                color: viewMode === opt.key ? "#fff" : theme.textSecondary,
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hover tooltip */}
      <HoverTooltip />

      {/* New appointment modal */}
      <NewAppointmentModal />

      {/* Edit appointment modal */}
      <EditAppointmentModal />

      {/* Day detail modal */}
      {selectedDay && (
        <DayDetailView
          date={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

// Generate appointment ID from timestamp in base36 for chronological sorting
function generateAppointmentId() {
  return Date.now().toString(36);
}

// Calculate end time based on start time, class length, and PUDO
function calculateEndTime(startTime, classLengthMinutes, pudo) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + classLengthMinutes + (pudo * 2); // PUDO adds to both start and end
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}

// Format time for display (e.g., "09:00" -> "9:00 AM")
function formatTimeDisplay(time24) {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

// Generate 15-minute time slots
function generateTimeSlots() {
  const slots = [];
  for (let h = 6; h <= 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ value: time, label: formatTimeDisplay(time) });
    }
  }
  return slots;
}

function Schedule({ appointments, classKeys, cars, locations, teachers, students }) {
  const [showForm, setShowForm] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [localAppointments, setLocalAppointments] = useState(appointments || []);

  // Search, sort, and filter state
  const [search, setSearch] = useState("");
  const [showSearchPopover, setShowSearchPopover] = useState(false);
  const [sortConfig, setSortConfig] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [activeColumnPopover, setActiveColumnPopover] = useState(null);

  const [draft, setDraft] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    carId: "",
    location: "",
    teacherName: "",
    studentName: "",
    classId: "",
    pudo: 0,
    notes: "",
  });

  useEffect(() => {
    if (appointments) {
      setLocalAppointments(appointments);
    }
  }, [appointments]);

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Get class length in minutes from classKeys
  const getClassLength = (classId) => {
    const classInfo = (classKeys || []).find(c => c["Class Key"] === classId);
    return classInfo ? parseInt(classInfo["Class Length"]) || 0 : 0;
  };

  // Calculate end time based on current draft
  const calculatedEndTime = useMemo(() => {
    const classLength = getClassLength(draft.classId);
    return calculateEndTime(draft.startTime, classLength, draft.pudo);
  }, [draft.startTime, draft.classId, draft.pudo, classKeys]);

  // Filter students based on search (for form dropdown)
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students || [];
    const term = studentSearch.toLowerCase();
    return (students || []).filter(s =>
      s.name?.toLowerCase().includes(term) ||
      s.student_id?.toLowerCase().includes(term)
    );
  }, [students, studentSearch]);

  // Column configuration for the appointments table
  const columns = useMemo(() => [
    { key: "APT-ID", label: "APT-ID", field: "APT-ID" },
    { key: "Date", label: "Date", field: "Date" },
    { key: "Start Time", label: "Start", field: "Start Time" },
    { key: "End Time", label: "End", field: "End Time" },
    { key: "Car ID", label: "Car", field: "Car ID" },
    { key: "Location", label: "Loc", field: "Location" },
    { key: "Teacher Name", label: "Teacher", field: "Teacher Name" },
    { key: "Student Name", label: "Student", field: "Student Name" },
    { key: "Class ID", label: "Class", field: "Class ID" },
    { key: "PUDO", label: "PUDO", field: "PUDO" },
    { key: "Notes", label: "Notes", field: "Notes" },
  ], []);

  // Get unique values for a field (for filter toggles)
  const getUniqueValues = useCallback((field) => {
    if (!field) return [];
    const values = Array.from(new Set(localAppointments.map((r) => r[field]).filter(Boolean)));
    return values.sort();
  }, [localAppointments]);

  // Check if a field has few enough unique values to show toggles (<=10)
  const shouldShowToggles = useCallback((field) => {
    if (!field) return false;
    return getUniqueValues(field).length <= 10;
  }, [getUniqueValues]);

  // Toggle a value in column filter
  const toggleColumnFilterValue = useCallback((field, value) => {
    setColumnFilters(prev => {
      const current = prev[field] || new Set();
      const updated = new Set(current);
      if (updated.has(value)) {
        updated.delete(value);
      } else {
        updated.add(value);
      }
      if (updated.size === 0) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: updated };
    });
  }, []);

  // Clear filter for a column
  const clearColumnFilter = useCallback((field) => {
    setColumnFilters(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Handle column header click
  const handleColumnClick = useCallback((field) => {
    if (!field) return;
    if (activeColumnPopover === field) {
      setActiveColumnPopover(null);
    } else {
      setActiveColumnPopover(field);
    }
  }, [activeColumnPopover]);

  // Handle sort toggle
  const handleSort = useCallback((field, direction) => {
    if (sortConfig?.field === field && sortConfig?.direction === direction) {
      setSortConfig(null);
    } else {
      setSortConfig({ field, direction });
    }
    setActiveColumnPopover(null);
  }, [sortConfig]);

  // Filtered and sorted appointments
  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = localAppointments.filter((row) => {
      // Search filter
      const matchesSearch =
        !term ||
        [row["APT-ID"], row.Date, row["Teacher Name"], row["Student Name"], row["Class ID"], row.Notes]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(term));

      // Column filters (excluded values)
      const matchesColumnFilters = Object.entries(columnFilters).every(([field, excludedSet]) => {
        const value = row[field];
        return !excludedSet.has(value);
      });

      return matchesSearch && matchesColumnFilters;
    });

    // Apply sorting
    if (sortConfig?.field) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.field] || "";
        const bVal = b[sortConfig.field] || "";

        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        const comparison = String(aVal).localeCompare(String(bVal));
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [localAppointments, search, columnFilters, sortConfig]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.date || !draft.startTime || !draft.studentName || !draft.classId) {
      return;
    }

    const newAppointment = {
      "APT-ID": generateAppointmentId(),
      "Date": new Date(draft.date).toLocaleDateString("en-US"),
      "Start Time": formatTimeDisplay(draft.startTime),
      "End Time": formatTimeDisplay(calculatedEndTime),
      "Car ID": draft.carId,
      "Location": draft.location,
      "Teacher Name": draft.teacherName,
      "Student Name": draft.studentName,
      "Class ID": draft.classId,
      "PUDO": draft.pudo,
      "Canceled": "FALSE",
      "No-Show": "FALSE",
      "Notes": draft.notes,
    };

    setLocalAppointments(prev => [newAppointment, ...prev]);
    setShowForm(false);
    setDraft({
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      carId: "",
      location: "",
      teacherName: "",
      studentName: "",
      classId: "",
      pudo: 0,
      notes: "",
    });
    setStudentSearch("");
  }

  const inputStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "12px 16px",
    color: theme.text,
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    paddingRight: 36,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: theme.textSecondary,
    marginBottom: 8,
    display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Appointments Table */}
      <div style={{
        flex: 1,
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "70px 90px 70px 70px 70px 50px 120px 120px 70px 50px 1fr",
          padding: "10px 20px",
          background: theme.panel,
          borderBottom: `1px solid ${theme.border}`,
          gap: 8,
          alignItems: "center",
        }}>
          {/* Action Icons replacing APT-ID header */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Add Appointment Button */}
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: theme.gradient,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)",
              }}
              title="New Appointment"
            >
              <Icons.Plus />
            </button>

            {/* Search Button */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowSearchPopover(!showSearchPopover)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: showSearchPopover || search ? theme.surface : "transparent",
                  border: `1px solid ${showSearchPopover || search ? theme.accent : theme.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: showSearchPopover || search ? theme.accent : theme.textMuted,
                  transition: "all 0.15s ease",
                }}
                title="Search"
              >
                <Icons.Search />
              </button>
              {/* Search Popover */}
              {showSearchPopover && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  background: theme.panel,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  padding: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  zIndex: 100,
                  minWidth: 220,
                }}>
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search appointments..."
                    style={{
                      ...inputStyle,
                      padding: "8px 12px",
                      background: theme.surface,
                      fontSize: 13,
                      width: "100%",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowSearchPopover(false);
                    }}
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setShowSearchPopover(false);
                      }}
                      style={{
                        marginTop: 8,
                        padding: "6px 12px",
                        fontSize: 12,
                        background: theme.surface,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 6,
                        color: theme.textSecondary,
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Column Headers (skip APT-ID, icons replace it) */}
          {columns.slice(1).map((col, colIndex) => {
            const isSorted = sortConfig?.field === col.field;
            const hasFilter = col.field && columnFilters[col.field]?.size > 0;
            const isActive = isSorted || hasFilter;
            const isPopoverOpen = activeColumnPopover === col.field;
            const uniqueValues = col.field ? getUniqueValues(col.field) : [];
            const showToggles = shouldShowToggles(col.field);
            // Position popover to the right for the last 4 columns to prevent overflow
            const isRightAligned = colIndex >= columns.length - 4;

            return (
              <div key={col.key} style={{ position: "relative" }}>
                <button
                  onClick={() => handleColumnClick(col.field)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "4px 0",
                    cursor: col.field ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    width: "100%",
                  }}
                  disabled={!col.field}
                >
                  <span style={{
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? theme.accent : theme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    transition: "all 0.15s ease",
                  }}>
                    {col.label}
                  </span>
                  {/* Sort indicator */}
                  {isSorted && (
                    <span style={{ color: theme.accent, fontSize: 9 }}>
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                  {/* Filter indicator */}
                  {hasFilter && (
                    <span style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: theme.accent,
                      flexShrink: 0,
                    }} />
                  )}
                </button>

                {/* Column Popover */}
                {isPopoverOpen && col.field && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      ...(isRightAligned ? { right: 0 } : { left: 0 }),
                      background: theme.panel,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      padding: 12,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      zIndex: 100,
                      minWidth: 180,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Sort Options */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
                      Sort
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: showToggles ? 12 : 0 }}>
                      <button
                        onClick={() => handleSort(col.field, "asc")}
                        style={{
                          padding: "6px 10px",
                          fontSize: 12,
                          background: sortConfig?.field === col.field && sortConfig?.direction === "asc" ? theme.accentGlow : theme.surface,
                          border: `1px solid ${sortConfig?.field === col.field && sortConfig?.direction === "asc" ? theme.accent : theme.border}`,
                          borderRadius: 6,
                          color: sortConfig?.field === col.field && sortConfig?.direction === "asc" ? theme.accent : theme.textSecondary,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>▲</span> A → Z
                      </button>
                      <button
                        onClick={() => handleSort(col.field, "desc")}
                        style={{
                          padding: "6px 10px",
                          fontSize: 12,
                          background: sortConfig?.field === col.field && sortConfig?.direction === "desc" ? theme.accentGlow : theme.surface,
                          border: `1px solid ${sortConfig?.field === col.field && sortConfig?.direction === "desc" ? theme.accent : theme.border}`,
                          borderRadius: 6,
                          color: sortConfig?.field === col.field && sortConfig?.direction === "desc" ? theme.accent : theme.textSecondary,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>▼</span> Z → A
                      </button>
                    </div>

                    {/* Filter Toggles (only if <=10 unique values) */}
                    {showToggles && uniqueValues.length > 0 && (
                      <>
                        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 8 }}>
                          Show
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
                          {uniqueValues.map((val) => {
                            const isExcluded = columnFilters[col.field]?.has(val);
                            return (
                              <button
                                key={val}
                                onClick={() => toggleColumnFilterValue(col.field, val)}
                                style={{
                                  padding: "6px 10px",
                                  fontSize: 12,
                                  background: isExcluded ? theme.surface : theme.accentGlow,
                                  border: `1px solid ${isExcluded ? theme.border : theme.accent}`,
                                  borderRadius: 6,
                                  color: isExcluded ? theme.textMuted : theme.accent,
                                  cursor: "pointer",
                                  textAlign: "left",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  opacity: isExcluded ? 0.6 : 1,
                                  textDecoration: isExcluded ? "line-through" : "none",
                                }}
                              >
                                <span style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: 3,
                                  border: `1px solid ${isExcluded ? theme.border : theme.accent}`,
                                  background: isExcluded ? "transparent" : theme.accent,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 10,
                                  color: "#fff",
                                }}>
                                  {!isExcluded && "✓"}
                                </span>
                                {val}
                              </button>
                            );
                          })}
                        </div>
                        {hasFilter && (
                          <button
                            onClick={() => clearColumnFilter(col.field)}
                            style={{
                              marginTop: 8,
                              padding: "6px 10px",
                              fontSize: 12,
                              background: theme.surface,
                              border: `1px solid ${theme.border}`,
                              borderRadius: 6,
                              color: theme.textSecondary,
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Show all
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Click outside to close popovers */}
        {(activeColumnPopover || showSearchPopover) && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
            }}
            onClick={() => {
              setActiveColumnPopover(null);
              setShowSearchPopover(false);
            }}
          />
        )}

        {/* Table Body */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {filteredAppointments.map((row, idx) => {
            const isCanceled = row.Canceled === "TRUE";
            const isNoShow = row["No-Show"] === "TRUE";
            return (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 90px 70px 70px 70px 50px 120px 120px 70px 50px 1fr",
                  padding: "12px 20px",
                  borderBottom: `1px solid ${theme.borderLight}`,
                  gap: 8,
                  alignItems: "center",
                  background: isCanceled ? theme.dangerGlow : isNoShow ? theme.warningGlow : idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  opacity: isCanceled ? 0.6 : 1,
                }}
              >
                {/* APT-ID in first column (under icons) */}
                <div style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "monospace" }}>
                  {row["APT-ID"]}
                </div>
                <div style={{ fontSize: 12, color: theme.text }}>{row.Date}</div>
                <div style={{ fontSize: 12, color: theme.text }}>{row["Start Time"]}</div>
                <div style={{ fontSize: 12, color: theme.text }}>{row["End Time"]}</div>
                <div style={{ fontSize: 12, color: theme.textSecondary }}>{row["Car ID"]}</div>
                <div style={{ fontSize: 12, color: theme.textSecondary }}>{row.Location}</div>
                <div style={{ fontSize: 12, color: theme.text }}>{row["Teacher Name"]}</div>
                <div style={{ fontSize: 12, color: theme.text, fontWeight: 500 }}>{row["Student Name"]}</div>
                <div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 500,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: theme.accentGlow,
                    color: theme.accent,
                  }}>
                    {row["Class ID"]}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: theme.textSecondary }}>{row.PUDO}</div>
                <div style={{ fontSize: 11, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.Notes}
                </div>
              </div>
            );
          })}
          {filteredAppointments.length === 0 && (
            <div style={{
              padding: 40,
              textAlign: "center",
              color: theme.textSecondary,
            }}>
              <Icons.Calendar />
              <p style={{ marginTop: 12 }}>No appointments found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Appointment Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 20,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme.panel,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              width: "min(720px, 90vw)",
              maxHeight: "85vh",
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: "24px 28px",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: theme.text, margin: 0 }}>
                  New Appointment
                </h2>
                <p style={{ fontSize: 14, color: theme.textSecondary, margin: "4px 0 0 0" }}>
                  Schedule a new driving session
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.X />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: "24px 28px", overflow: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {/* Date */}
                <div>
                  <label style={labelStyle}>
                    Date <span style={{ color: theme.danger }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft(prev => ({ ...prev, date: e.target.value }))}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Start Time - 15 min increments */}
                <div>
                  <label style={labelStyle}>
                    Start Time <span style={{ color: theme.danger }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={draft.startTime}
                      onChange={(e) => setDraft(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                      style={selectStyle}
                    >
                      {timeSlots.map(slot => (
                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
                      <Icons.ChevronDown />
                    </div>
                  </div>
                </div>

                {/* End Time - Calculated */}
                <div>
                  <label style={labelStyle}>
                    End Time <span style={{ fontSize: 11, color: theme.textMuted }}>(calculated)</span>
                  </label>
                  <input
                    type="text"
                    value={formatTimeDisplay(calculatedEndTime)}
                    readOnly
                    style={{ ...inputStyle, background: theme.bg, color: theme.textSecondary, cursor: "not-allowed" }}
                  />
                </div>

                {/* Class ID */}
                <div>
                  <label style={labelStyle}>
                    Class <span style={{ color: theme.danger }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={draft.classId}
                      onChange={(e) => setDraft(prev => ({ ...prev, classId: e.target.value }))}
                      required
                      style={selectStyle}
                    >
                      <option value="">Select class...</option>
                      {(classKeys || []).map(c => (
                        <option key={c["Class Key"]} value={c["Class Key"]}>
                          {c["Class Key"]} ({c["Class Length"]} min)
                        </option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
                      <Icons.ChevronDown />
                    </div>
                  </div>
                </div>

                {/* PUDO */}
                <div>
                  <label style={labelStyle}>PUDO (pickup/dropoff)</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={draft.pudo}
                      onChange={(e) => setDraft(prev => ({ ...prev, pudo: parseInt(e.target.value) }))}
                      style={selectStyle}
                    >
                      <option value={0}>0 min</option>
                      <option value={30}>30 min</option>
                      <option value={60}>60 min</option>
                    </select>
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
                      <Icons.ChevronDown />
                    </div>
                  </div>
                </div>

                {/* Car ID */}
                <div>
                  <label style={labelStyle}>Car</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={draft.carId}
                      onChange={(e) => setDraft(prev => ({ ...prev, carId: e.target.value }))}
                      style={selectStyle}
                    >
                      <option value="">Select car...</option>
                      {(cars || []).map(c => (
                        <option key={c["Car ID"]} value={c["Car ID"]}>{c["Car ID"]}</option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
                      <Icons.ChevronDown />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={labelStyle}>Location</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={draft.location}
                      onChange={(e) => setDraft(prev => ({ ...prev, location: e.target.value }))}
                      style={selectStyle}
                    >
                      <option value="">Select location...</option>
                      {(locations || []).map(l => (
                        <option key={l.Location} value={l.Location}>{l.Location}</option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
                      <Icons.ChevronDown />
                    </div>
                  </div>
                </div>

                {/* Teacher */}
                <div>
                  <label style={labelStyle}>Teacher</label>
                  <div style={{ position: "relative" }}>
                    <select
                      value={draft.teacherName}
                      onChange={(e) => setDraft(prev => ({ ...prev, teacherName: e.target.value }))}
                      style={selectStyle}
                    >
                      <option value="">Select teacher...</option>
                      {(teachers || []).map(t => (
                        <option key={t["Teacher Name"]} value={t["Teacher Name"]}>{t["Teacher Name"]}</option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}>
                      <Icons.ChevronDown />
                    </div>
                  </div>
                </div>

                {/* Student Search */}
                <div style={{ position: "relative" }}>
                  <label style={labelStyle}>
                    Student <span style={{ color: theme.danger }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: theme.textMuted,
                      pointerEvents: "none",
                    }}>
                      <Icons.Search />
                    </div>
                    <input
                      type="text"
                      value={draft.studentName || studentSearch}
                      onChange={(e) => {
                        setStudentSearch(e.target.value);
                        setDraft(prev => ({ ...prev, studentName: "" }));
                        setShowStudentDropdown(true);
                      }}
                      onFocus={() => setShowStudentDropdown(true)}
                      placeholder="Search students..."
                      style={{ ...inputStyle, paddingLeft: 40 }}
                    />
                  </div>
                  {showStudentDropdown && studentSearch && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10,
                      marginTop: 4,
                      maxHeight: 200,
                      overflow: "auto",
                      zIndex: 100,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                    }}>
                      {filteredStudents.slice(0, 10).map(s => (
                        <div
                          key={s.student_id}
                          onClick={() => {
                            setDraft(prev => ({ ...prev, studentName: s.name }));
                            setStudentSearch("");
                            setShowStudentDropdown(false);
                          }}
                          style={{
                            padding: "10px 14px",
                            cursor: "pointer",
                            borderBottom: `1px solid ${theme.borderLight}`,
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = theme.surfaceHover}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <div style={{ fontSize: 14, color: theme.text }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: theme.textMuted }}>{s.student_id} - {s.program_track}</div>
                        </div>
                      ))}
                      {filteredStudents.length === 0 && (
                        <div style={{ padding: "12px 14px", color: theme.textMuted, fontSize: 13 }}>
                          No students found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this appointment..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: 80,
                  }}
                />
              </div>

              {/* Summary */}
              {draft.classId && (
                <div style={{
                  marginTop: 20,
                  padding: 16,
                  background: theme.accentGlow,
                  borderRadius: 12,
                  border: `1px solid ${theme.accent}30`,
                }}>
                  <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 8 }}>Appointment Summary</div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontSize: 12, color: theme.textMuted }}>Class: </span>
                      <span style={{ fontSize: 14, color: theme.text, fontWeight: 500 }}>{draft.classId}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 12, color: theme.textMuted }}>Duration: </span>
                      <span style={{ fontSize: 14, color: theme.text, fontWeight: 500 }}>
                        {getClassLength(draft.classId)} min + {draft.pudo * 2} min PUDO
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: 12, color: theme.textMuted }}>Total: </span>
                      <span style={{ fontSize: 14, color: theme.accent, fontWeight: 600 }}>
                        {getClassLength(draft.classId) + (draft.pudo * 2)} min
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 28,
                paddingTop: 20,
                borderTop: `1px solid ${theme.border}`,
              }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: "transparent",
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    background: theme.gradient,
                    border: "none",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

// Navigation Item Component
function NavItem({ page, isActive, onClick }) {
  const IconComponent = Icons[page.icon];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 12px",
        background: isActive
          ? theme.gradientSubtle
          : isHovered
            ? "rgba(255,255,255,0.03)"
            : "transparent",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
        textAlign: "left",
      }}
    >
      {isActive && (
        <div style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 3,
          height: 20,
          background: theme.gradient,
          borderRadius: "0 3px 3px 0",
        }} />
      )}
      <div style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: isActive ? theme.accentGlow : "rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isActive ? theme.accent : theme.textSecondary,
        transition: "all 0.15s ease",
      }}>
        {IconComponent && <IconComponent />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: isActive ? 600 : 500,
          color: isActive ? theme.text : theme.textSecondary,
          transition: "all 0.15s ease",
        }}>
          {page.label}
        </div>
        <div style={{
          fontSize: 11,
          color: theme.textMuted,
          marginTop: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {page.description}
        </div>
      </div>
    </button>
  );
}

export default function ExampleFrontend() {
  const { data, loading, error } = useCsvData();
  const [activePage, setActivePage] = useState("students");

  const mainContent = useMemo(() => {
    if (loading) {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          flexDirection: "column",
          gap: 16,
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: `3px solid ${theme.border}`,
            borderTopColor: theme.accent,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <div style={{ color: theme.textSecondary, fontSize: 14 }}>Loading data...</div>
        </div>
      );
    }
    if (error) {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          flexDirection: "column",
          gap: 12,
        }}>
          <div style={{ color: theme.danger }}><Icons.AlertCircle /></div>
          <div style={{ color: theme.danger, fontSize: 14 }}>Failed to load data: {error}</div>
        </div>
      );
    }

    switch (activePage) {
      case "admin":
        return <AdminSetup rows={data.adminSettings || []} />;
      case "students":
        return <Students rows={data.students || []} />;
      case "instructors":
        return <Instructors rows={data.instructors || []} />;
        case "calendar":
          return (
            <CalendarView
              appointments={data.appointments || []}
              instructors={data.instructors || []}
              classKeys={data.classKeys || []}
              locations={data.locations || []}
              students={data.students || []}
            />
          );
      case "schedule":
        return (
          <Schedule
            appointments={data.appointments || []}
            classKeys={data.classKeys || []}
            cars={data.cars || []}
            locations={data.locations || []}
            teachers={data.teachers || []}
            students={data.students || []}
          />
        );
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
  }, [activePage, data, error, loading]);

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100vh",
        background: theme.bg,
        fontFamily: theme.font,
        color: theme.text,
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        overflow: "hidden",
      }}
    >
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Global scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.15) transparent;
        }
        input::placeholder {
          color: ${theme.textMuted};
        }
        select option {
          background: ${theme.panel};
          color: ${theme.text};
        }
        input:focus, select:focus {
          border-color: ${theme.accent} !important;
          box-shadow: 0 0 0 3px ${theme.accentGlow} !important;
        }
      `}
      </style>

      {/* Sidebar Navigation */}
      <aside
        style={{
          background: theme.panel,
          borderRight: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Logo Header */}
        <div style={{
          padding: "20px 16px",
          borderBottom: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: theme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
            >
              <Icons.Car />
            </div>
            <div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                letterSpacing: "-0.01em",
              }}>
                Checkmate
              </div>
              <div style={{
                fontSize: 12,
                color: theme.textMuted,
                marginTop: 1,
              }}>
                Driving School ERP
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          overflow: "auto",
          padding: "12px 10px",
        }}>
          {sections.map((section) => {
            const sectionPages = pages.filter(p => p.section === section.key);
            if (sectionPages.length === 0) return null;

            return (
              <div key={section.key} style={{ marginBottom: 8 }}>
                {section.label && (
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: theme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "12px 12px 8px",
                  }}>
                    {section.label}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {sectionPages.map((page) => (
                    <NavItem
                      key={page.key}
                      page={page}
                      isActive={activePage === page.key}
                      onClick={() => {
                        if (page.key === "close") {
                          window.location.href = "/students";
                        } else {
                          setActivePage(page.key);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Footer */}
        <div style={{
          padding: "16px",
          borderTop: `1px solid ${theme.border}`,
          background: "rgba(0,0,0,0.2)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            background: theme.surface,
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: theme.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
            }}>
              AD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                Admin User
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>
                Demo Mode
              </div>
            </div>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: theme.success,
              boxShadow: `0 0 8px ${theme.success}`,
            }} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          padding: 28,
          height: "100vh",
          overflow: "hidden",
          background: `
            radial-gradient(ellipse at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            ${theme.bg}
          `,
        }}
      >
        {mainContent}
      </main>
    </div>
  );
}
