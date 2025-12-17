export default function AdminSetupPage() {
  return (
    <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
      <header>
        <h2 style={{ margin: 0 }}>Admin Setup</h2>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>
          Configure organization basics and defaults. This is a placeholder for upcoming admin tools.
        </p>
      </header>

      <div
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        <p style={{ margin: 0, color: '#cbd5e1' }}>
          Admin controls will live here. Add settings for instructors, vehicles, availability, and billing as they
          become available.
        </p>
      </div>
    </div>
  );
}
