import { theme } from "../theme";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>{title}</div>
      <div
        style={{
          padding: 20,
          borderRadius: 14,
          border: `1px dashed ${theme.border}`,
          background: "rgba(255,255,255,0.02)",
          color: theme.textSecondary,
        }}
      >
        Functionality coming soon
      </div>
    </div>
  );
}
