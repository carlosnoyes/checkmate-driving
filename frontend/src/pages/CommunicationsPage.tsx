export default function CommunicationsPage() {
  return (
    <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
      <header>
        <h2 style={{ margin: 0 }}>Communications</h2>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>
          Track outbound messages and reminders. Placeholder view until messaging is wired up.
        </p>
      </header>

      <div
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '16px',
          display: 'grid',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
          <span>Queued campaigns</span>
          <span style={{ color: '#94a3b8' }}>None yet</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
          <span>Recent sends</span>
          <span style={{ color: '#94a3b8' }}>No messages sent</span>
        </div>
      </div>
    </div>
  );
}
