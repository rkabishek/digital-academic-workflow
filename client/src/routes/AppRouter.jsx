import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// ── Public Pages ─────────────────────────────────────────────────────────────
import HomePage          from '../pages/HomePage';
import LoginPage         from '../pages/auth/LoginPage';
import StudentRegister   from '../pages/auth/StudentRegister';
import StaffRegister     from '../pages/auth/StaffRegister';
import ForgotPassword    from '../pages/auth/ForgotPassword';
import ResetPassword     from '../pages/auth/ResetPassword';
import VerifyCertificate from '../pages/VerifyCertificate';
import NotFoundPage      from '../pages/NotFoundPage';

// ── Student Pages ────────────────────────────────────────────────────────────
import StudentDashboard    from '../pages/student/StudentDashboard';
import StudentDocuments    from '../pages/student/StudentDocuments';
import StudentODRequests   from '../pages/student/StudentODRequests';
import StudentProjects     from '../pages/student/StudentProjects';
import StudentNotes        from '../pages/student/StudentNotes';
import StudentCertificates from '../pages/student/StudentCertificates';

// ── Staff Pages ──────────────────────────────────────────────────────────────
import StaffDashboard      from '../pages/staff/StaffDashboard';
import StaffDocuments      from '../pages/staff/StaffDocuments';
import StaffODRequests     from '../pages/staff/StaffODRequests';
import StaffProjects       from '../pages/staff/StaffProjects';
import StaffNotes          from '../pages/staff/StaffNotes';
import StaffCertificates   from '../pages/staff/StaffCertificates';

// ── Admin Pages ──────────────────────────────────────────────────────────────
import AdminDashboard      from '../pages/admin/AdminDashboard';
import AdminUsers          from '../pages/admin/AdminUsers';
import AdminDocuments      from '../pages/admin/AdminDocuments';
import AdminAuditLogs      from '../pages/admin/AdminAuditLogs';

const AppRouter = () => (
  <Routes>
    {/* Public */}
    <Route path="/"                      element={<HomePage />} />
    <Route path="/login"                 element={<LoginPage />} />
    <Route path="/register/student"      element={<StudentRegister />} />
    <Route path="/register/staff"        element={<StaffRegister />} />
    <Route path="/forgot-password"       element={<ForgotPassword />} />
    <Route path="/reset-password"        element={<ResetPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/verify"                element={<VerifyCertificate />} />
    <Route path="/verify/:certNumber"    element={<VerifyCertificate />} />

    {/* Student Portal */}
    <Route
      path="/student/*"
      element={
        <ProtectedRoute roles={['student']}>
          <Routes>
            <Route path="dashboard"    element={<StudentDashboard />} />
            <Route path="documents"    element={<StudentDocuments />} />
            <Route path="od-requests"  element={<StudentODRequests />} />
            <Route path="projects"     element={<StudentProjects />} />
            <Route path="notes"        element={<StudentNotes />} />
            <Route path="certificates" element={<StudentCertificates />} />
            <Route path="*"            element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ProtectedRoute>
      }
    />

    {/* Staff Portal */}
    <Route
      path="/staff/*"
      element={
        <ProtectedRoute roles={['staff']}>
          <Routes>
            <Route path="dashboard"    element={<StaffDashboard />} />
            <Route path="documents"    element={<StaffDocuments />} />
            <Route path="od-requests"  element={<StaffODRequests />} />
            <Route path="projects"     element={<StaffProjects />} />
            <Route path="notes"        element={<StaffNotes />} />
            <Route path="certificates" element={<StaffCertificates />} />
            <Route path="*"            element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ProtectedRoute>
      }
    />

    {/* Admin Portal */}
    <Route
      path="/admin/*"
      element={
        <ProtectedRoute roles={['admin']}>
          <Routes>
            <Route path="dashboard"  element={<AdminDashboard />} />
            <Route path="users"      element={<AdminUsers />} />
            <Route path="documents"  element={<AdminDocuments />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="*"          element={<Navigate to="dashboard" replace />} />
          </Routes>
        </ProtectedRoute>
      }
    />

    {/* 404 Catch-All */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
