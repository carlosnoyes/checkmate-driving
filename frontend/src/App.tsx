import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import CalendarPage from './pages/CalendarPage';
import StudentsPage from './pages/StudentsPage';
import AdminSetupPage from './pages/AdminSetupPage';
import CommunicationsPage from './pages/CommunicationsPage';
import ExampleFrontend from './ExampleFrontend';

function ExamplePage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0f172a',
        margin: 0,
        padding: 0,
        overflow: 'auto',
      }}
    >
      <button
        onClick={() => navigate('/students')}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          background: 'linear-gradient(135deg, #8b5cf6, #7dd3fc)',
          color: '#0b1021',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 14px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        }}
      >
        Close Example
      </button>
      <ExampleFrontend />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/wireframe" replace />} />
          <Route path="admin/setup" element={<AdminSetupPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="schedule" element={<CalendarPage />} />
          <Route path="communications" element={<CommunicationsPage />} />
          <Route path="wireframe" element={<ExampleFrontend />} />
        </Route>
        <Route path="/example" element={<ExamplePage />} />
        <Route path="*" element={<Navigate to="/students" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
