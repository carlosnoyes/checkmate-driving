import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();

  const navItems = [
    { label: 'Admin', path: '/admin/setup' },
    { label: 'Students', path: '/students' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Communications', path: '/communications' },
    { label: 'Example (fullscreen)', path: '/example' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f172a', color: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          background: '#1e293b',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
        }}
      >
        {/* App Title */}
        <div style={{ padding: '0 20px', marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Checkmate Driving</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Staff Portal</p>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#f1f5f9' : '#94a3b8',
                  background: isActive ? '#334155' : 'transparent',
                  fontWeight: isActive ? '500' : '400',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#2d3748';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
