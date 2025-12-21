import React, { useMemo, useState } from "react";
import { theme } from "../../theme";
import { Icons } from "../icons";

type SortDirection = "asc" | "desc";

export type DataColumn<T> = {
  key: keyof T | string;
  label: string;
  getValue?: (row: T) => unknown;
  render?: (row: T) => React.ReactNode;
  minWidth?: number;
};

type FilterState = Record<string, string>;

function Pill({ text, tone }: { text: string; tone?: "neutral" | "success" | "warn" | "danger" | "accent" }) {
  const colors = {
    neutral: "rgba(255,255,255,0.08)",
    success: theme.success,
    warn: theme.warning,
    danger: theme.danger,
    accent: theme.accent,
  };
  return (
    <span
      style={{
        background: colors[tone || "neutral"],
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

function normalizeValue(value: unknown) {
  if (value === undefined || value === null) return "";
  const trimmed = String(value).trim();
  const numberValue = Number(trimmed);
  if (!Number.isNaN(numberValue) && trimmed !== "") return numberValue;
  const dateValue = Date.parse(trimmed);
  if (!Number.isNaN(dateValue)) return dateValue;
  return trimmed.toLowerCase();
}

export function DataTable<T>({
  columns,
  rows,
  title,
  addLabel = "New Record",
  onAdd,
  searchPlaceholder = "Search...",
  onRowClick,
}: {
  columns: DataColumn<T>[];
  rows: T[];
  title?: string;
  addLabel?: string;
  onAdd?: () => void;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
}) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection } | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const columnMap = useMemo(() => new Map(columns.map((col) => [String(col.key), col])), [columns]);

  const distinctByColumn = useMemo(() => {
    const distinct: Record<string, string[]> = {};
    columns.forEach((col) => {
      const values = new Set<string>();
      rows.forEach((row) => {
        const raw = col.getValue ? col.getValue(row) : (row as Record<string, unknown>)[col.key as string];
        if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
          values.add(String(raw).trim());
        }
      });
      distinct[col.key as string] = Array.from(values).sort((a, b) => a.localeCompare(b));
    });
    return distinct;
  }, [columns, rows]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        columns.some((col) => {
          const raw = col.getValue ? col.getValue(row) : (row as Record<string, unknown>)[col.key as string];
          return String(raw ?? "").toLowerCase().includes(term);
        });
      if (!matchesSearch) return false;
      return columns.every((col) => {
        const key = col.key as string;
        const filterValue = filters[key];
        if (!filterValue || filterValue === "all") return true;
        const raw = col.getValue ? col.getValue(row) : (row as Record<string, unknown>)[key];
        return String(raw ?? "") === filterValue;
      });
    });
  }, [columns, filters, rows, search]);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;
      const { key, direction } = sortConfig;
      const column = columnMap.get(key);
      return [...filteredRows].sort((a, b) => {
      const aRaw = column?.getValue ? column.getValue(a) : (a as Record<string, unknown>)[key];
      const bRaw = column?.getValue ? column.getValue(b) : (b as Record<string, unknown>)[key];
      const aVal = normalizeValue(aRaw);
      const bVal = normalizeValue(bRaw);
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortConfig, columnMap]);

  function toggleSort(key: string) {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    });
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {title && <div style={{ fontSize: 20, fontWeight: 600, color: theme.text }}>{title}</div>}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: "10px 12px",
        }}
      >
        <div style={{ position: "relative", width: 220 }}>
          <div
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: theme.textMuted,
              pointerEvents: "none",
            }}
          >
            <Icons.Search />
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: "100%",
              background: theme.panel,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: "8px 12px 8px 36px",
              color: theme.text,
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
        <div style={{ flex: 1 }} />
        {onAdd && (
          <button
            onClick={onAdd}
            style={{
              background: theme.gradient,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
            }}
          >
            <Icons.Plus />
            {addLabel}
          </button>
        )}
      </div>

      <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", background: theme.surface }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
            padding: "12px 14px",
            background: "rgba(255,255,255,0.03)",
            color: theme.textMuted,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          {columns.map((col) => {
            const isActive = sortConfig?.key === col.key;
            const arrow = isActive ? (sortConfig?.direction === "asc" ? "▲" : "▼") : "↕";
            return (
              <button
                key={String(col.key)}
                onClick={() => toggleSort(String(col.key))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: isActive ? theme.text : theme.textMuted,
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
                <span style={{ opacity: 0.6, fontSize: 10 }}>{arrow}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`, borderBottom: `1px solid ${theme.border}` }}>
          {columns.map((col) => {
            const distinct = distinctByColumn[col.key as string] || [];
            const isFilterable = distinct.length > 0 && distinct.length <= 15;
            return (
              <div key={String(col.key)} style={{ padding: "8px 12px", borderRight: `1px solid ${theme.borderLight}` }}>
                {isFilterable ? (
                  <select
                    value={filters[col.key as string] || "all"}
                    onChange={(event) => setFilters((prev) => ({ ...prev, [col.key as string]: event.target.value }))}
                    style={{
                      width: "100%",
                      background: theme.panel,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      padding: "6px 8px",
                      color: theme.textSecondary,
                      fontSize: 12,
                      appearance: "none",
                      outline: "none",
                    }}
                  >
                    <option value="all">All</option>
                    {distinct.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ color: theme.textMuted, fontSize: 11 }}>Filter unavailable</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ maxHeight: 520, overflow: "auto" }}>
          {sortedRows.map((row, idx) => (
            <div
              key={idx}
              onClick={() => onRowClick?.(row)}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                padding: "12px 14px",
                borderBottom: `1px solid ${theme.border}`,
                background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                alignItems: "center",
                gap: 8,
                cursor: onRowClick ? "pointer" : "default",
              }}
            >
              {columns.map((col) => {
                const key = col.key as string;
                const raw = col.getValue ? col.getValue(row) : (row as Record<string, unknown>)[key];
                const distinct = distinctByColumn[key] || [];
                const usePill = distinct.length > 0 && distinct.length <= 15;
                return (
                  <div key={key} style={{ color: theme.text, fontSize: 14 }}>
                    {col.render ? col.render(row) : usePill ? <Pill text={String(raw ?? "")} /> : String(raw ?? "")}
                  </div>
                );
              })}
            </div>
          ))}
          {!sortedRows.length && (
            <div style={{ padding: 18, color: theme.textMuted, fontSize: 14 }}>No rows to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}
