import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import CalendarPage from './pages/CalendarPage';
import StudentsPage from './pages/StudentsPage';
import AdminSetupPage from './pages/AdminSetupPage';
import CommunicationsPage from './pages/CommunicationsPage';
import ExampleFrontend from './ExampleFrontend';

function ExamplePage() {
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
