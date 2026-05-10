import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Auth pages (eager)
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// ── Student Pages (lazy) ──
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const StudentProfile   = lazy(() => import('./pages/student/StudentProfile'));
const ResumeAnalyzer   = lazy(() => import('./pages/student/ResumeAnalyzer'));
const SkillGap         = lazy(() => import('./pages/student/SkillGap'));
const Companies        = lazy(() => import('./pages/student/Companies'));
const MockInterview    = lazy(() => import('./pages/student/MockInterview'));
const Analytics        = lazy(() => import('./pages/student/Analytics'));
const Notifications    = lazy(() => import('./pages/student/Notifications'));

// ── Admin Pages (lazy) ──
const AdminDashboard      = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminStudents       = lazy(() => import('./pages/admin/AdminStudents'));
const AdminCompanies      = lazy(() => import('./pages/admin/AdminCompanies'));
const AdminNotifications  = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminAnalytics      = lazy(() => import('./pages/student/Analytics')); // shared

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/"         element={<Navigate to="/login" replace />} />

        {/* ── Student Routes ── */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student/dashboard"      element={<StudentDashboard />} />
            <Route path="/student/profile"        element={<StudentProfile />} />
            <Route path="/student/resume"         element={<ResumeAnalyzer />} />
            <Route path="/student/skill-gap"      element={<SkillGap />} />
            <Route path="/student/companies"      element={<Companies />} />
            <Route path="/student/mock-interview" element={<MockInterview />} />
            <Route path="/student/analytics"      element={<Analytics />} />
            <Route path="/student/notifications"  element={<Notifications />} />
          </Route>
        </Route>

        {/* ── Admin / Placement Staff Routes ── */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Placement Staff']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin"                  element={<AdminDashboard />} />
            <Route path="/admin/students"         element={<AdminStudents />} />
            <Route path="/admin/companies"        element={<AdminCompanies />} />
            <Route path="/admin/analytics"        element={<AdminAnalytics />} />
            <Route path="/admin/notifications"    element={<AdminNotifications />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
