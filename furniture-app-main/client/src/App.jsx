import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PlannerHome from './pages/PlannerHome';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Onboarding from './components/Onboarding';
import { ThemeProvider } from './components/ThemeContext';

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
  return user.role === 'admin' ? children : <Navigate to="/home" replace />;
}

export default function App() {
  useEffect(() => {
    const fontScale = localStorage.getItem('nd-font-scale') || '100';
    document.documentElement.style.fontSize = `${fontScale}%`;

    const reducedMotion = localStorage.getItem('nd-reduced-motion') === 'true';
    const compactUi = localStorage.getItem('nd-compact-ui') === 'true';
    document.body.classList.toggle('nd-reduced-motion', reducedMotion);
    document.body.classList.toggle('nd-compact-ui', compactUi);
  }, []);

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<PrivateRoute><PlannerHome /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/admin"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
      </Routes>
    </ThemeProvider>
  );
}