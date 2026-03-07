import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

/* ── Route guard: redirect to /login if not authenticated ── */
function PrivateRoute({ children }) {
  const stored = localStorage.getItem('user');
  return stored ? children : <Navigate to="/login" replace />;
}

/* ── Route guard: redirect non-admins to /dashboard ── */
function AdminRoute({ children }) {
  const stored = localStorage.getItem('user');
  if (!stored) return <Navigate to="/login" replace />;
  const user = JSON.parse(stored);
  return user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute><Dashboard /></PrivateRoute>}
      />
      <Route
        path="/admin"
        element={<AdminRoute><AdminDashboard /></AdminRoute>}
      />
    </Routes>
  );
}