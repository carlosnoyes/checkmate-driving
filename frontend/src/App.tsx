import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import CalendarPage from "./pages/CalendarPage";
import StudentsPage from "./pages/StudentsPage";
import AdminSetupPage from "./pages/AdminSetupPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import SchedulePage from "./pages/SchedulePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/students" replace />} />
          <Route path="admin/setup" element={<AdminSetupPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="communications" element={<CommunicationsPage />} />
          <Route path="instructors" element={<ComingSoonPage title="Instructors" />} />
          <Route path="payments" element={<ComingSoonPage title="Payments" />} />
          <Route path="crm" element={<ComingSoonPage title="CRM" />} />
          <Route path="metrics" element={<ComingSoonPage title="Data Tracking" />} />
          <Route path="portal" element={<ComingSoonPage title="Student Portal" />} />
          <Route path="learning" element={<ComingSoonPage title="Learning" />} />
          <Route path="registration" element={<ComingSoonPage title="Registration" />} />
          <Route path="payroll" element={<ComingSoonPage title="Payroll" />} />
          <Route path="dmv" element={<ComingSoonPage title="DMV Compliance" />} />
        </Route>
        <Route path="*" element={<Navigate to="/students" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
