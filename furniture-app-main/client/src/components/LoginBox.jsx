import React, { useState } from 'react';
import ndLogo from '../assets/LOGO/logo.jpeg';

export default function LoginBox({ onLogin, onRegister, feedback, clearFeedback }) {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'user', adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    if (clearFeedback) clearFeedback();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'register') {
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        const success = await onRegister(formData.username, formData.email, formData.password, formData.role, formData.adminCode);
        if (success) switchView('login');
      } else if (view === 'login') {
        await onLogin(formData.username, formData.password);
      } else if (view === 'forgot') {
        setError('');
        switchView('login');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setError('');
    if (clearFeedback) clearFeedback();
    setFormData({ username: '', email: '', password: '', confirmPassword: '', role: 'user', adminCode: '' });
  };

  const titles = {
    login: { title: 'Welcome Back', sub: 'Sign in to your design workspace' },
    register: { title: 'Get Started', sub: 'Create your designer account' },
    forgot: { title: 'Reset Password', sub: "We'll send you a recovery link" },
  };

  return (
    <div style={styles.card} className="animate-slideUp" role="main" aria-label="Authentication form">
      {/* Logo */}
      <div style={styles.logoWrap}>
        <img src={ndLogo} alt="ND Furniture" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>{titles[view].title}</h2>
        <p style={styles.subtitle}>{titles[view].sub}</p>
      </div>

      {/* Inline feedback messages */}
      {feedback?.message && (
        <div style={{
          ...styles.errorAlert,
          background: feedback.type === 'success' ? 'rgba(34,197,94,0.1)' : styles.errorAlert.background,
          color: feedback.type === 'success' ? '#86efac' : '#fca5a5',
          borderColor: feedback.type === 'success' ? 'rgba(34,197,94,0.25)' : 'rgba(239, 68, 68, 0.25)',
        }} role="alert" aria-live="assertive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }} aria-hidden="true">
            {feedback.type === 'success'
              ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
              : <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
            }
          </svg>
          {feedback.message}
        </div>
      )}

      {error && (
        <div style={styles.errorAlert} role="alert" aria-live="polite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username / Email field */}
        {view !== 'forgot' && (
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="login-username">
              {view === 'register' ? 'Username' : 'Username or Email'}
            </label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <input
                id="login-username"
                name="username"
                placeholder={view === 'register' ? 'Choose a username' : 'Enter username or email'}
                value={formData.username}
                style={styles.input}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* Email field (register / forgot) */}
        {(view === 'register' || view === 'forgot') && (
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="login-email">Email Address</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                style={styles.input}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* Password field */}
        {view !== 'forgot' && (
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="login-password">Password</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                style={styles.input}
                onChange={handleChange}
                required
                minLength={6}
                aria-describedby={view === 'register' ? 'password-strength' : undefined}
                autoComplete={view === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
            {/* Password strength indicator */}
            {view === 'register' && formData.password.length > 0 && (
              <div id="password-strength" style={styles.strengthWrap} aria-live="polite">
                <div style={styles.strengthBar}>
                  <div style={{
                    height: '100%',
                    borderRadius: '2px',
                    transition: 'width 0.3s, background 0.3s',
                    width: formData.password.length < 6 ? '33%' : formData.password.length < 10 ? '66%' : '100%',
                    background: formData.password.length < 6 ? 'var(--danger)' : formData.password.length < 10 ? 'var(--warning)' : 'var(--success)',
                  }} />
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 500,
                  color: formData.password.length < 6 ? 'var(--danger)' : formData.password.length < 10 ? 'var(--warning)' : 'var(--success)',
                }}>
                  {formData.password.length < 6 ? 'Too short (min 6 chars)' : formData.password.length < 10 ? 'Fair' : 'Strong'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Confirm password (register only) */}
        {view === 'register' && (
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="login-confirm">Confirm Password</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <input
                id="login-confirm"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                style={styles.input}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* ── ROLE SELECTOR (register only) ── */}
        {view === 'register' && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Account Type</label>
            <div style={styles.rolePicker} role="radiogroup" aria-label="Account type">
              <label
                htmlFor="role-user"
                style={{
                  ...styles.roleOption,
                  ...(formData.role === 'user' ? styles.roleOptionActive : {}),
                }}
              >
                <input
                  id="role-user"
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <div>
                  <div style={styles.roleLabel}>Customer</div>
                  <div style={styles.roleDesc}>Personal or home use</div>
                </div>
              </label>

              <label
                htmlFor="role-admin"
                style={{
                  ...styles.roleOption,
                  ...(formData.role === 'admin' ? styles.roleOptionActiveAdmin : {}),
                }}
              >
                <input
                  id="role-admin"
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <div>
                  <div style={styles.roleLabel}>Store Staff</div>
                  <div style={styles.roleDesc}>Admin / customer service</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Admin code field (only when admin role selected) */}
        {view === 'register' && formData.role === 'admin' && (
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="admin-code">
              Staff Access Code
              <span style={styles.requiredBadge}>Required</span>
            </label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              <input
                id="admin-code"
                name="adminCode"
                type="password"
                placeholder="Enter staff access code"
                value={formData.adminCode}
                style={{ ...styles.input, borderColor: 'rgba(251,191,36,0.4)' }}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', marginLeft: '2px' }}>
              Contact the store manager to obtain your access code.
            </p>
          </div>
        )}

        {/* Forgot password link */}
        {view === 'login' && (
          <div style={{ textAlign: 'right', marginBottom: '16px' }}>
            <button type="button" onClick={() => switchView('forgot')} style={styles.smallLink}>
              Forgot password?
            </button>
          </div>
        )}

        <button type="submit" style={{
          ...styles.btn,
          ...(view === 'register' && formData.role === 'admin' ? styles.btnAdmin : {}),
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'wait' : 'pointer',
        }} disabled={loading}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'logo-spin 0.6s linear infinite', display: 'inline-block' }} />
              Processing...
            </span>
          ) : (
            <>
              {view === 'login' && 'Sign In'}
              {view === 'register' && (formData.role === 'admin' ? '🛡 Create Staff Account' : 'Create Account')}
              {view === 'forgot' && 'Send Reset Link'}
            </>
          )}
        </button>
      </form>

      <div style={styles.divider}>
        <span style={styles.dividerText}>or</span>
      </div>

      <div style={styles.footer}>
        <span style={styles.footerText}>
          {view === 'login' ? "Don't have an account?" : "Already have an account?"}
        </span>
        <button
          onClick={() => switchView(view === 'login' ? 'register' : 'login')}
          style={styles.linkBtn}
        >
          {view === 'login' ? 'Create Account' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: '440px',
    padding: '40px',
    background: 'var(--bg-panel)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  logoWrap: {
    display: 'flex', justifyContent: 'center', marginBottom: '24px',
  },
  header: { marginBottom: '28px', textAlign: 'center' },
  title: {
    color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 800,
    margin: '0 0 6px 0', letterSpacing: '-0.02em',
  },
  subtitle: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 },

  inputGroup: { marginBottom: '16px' },
  label: {
    display: 'flex', alignItems: 'center', gap: '6px',
    color: 'var(--text-secondary)', fontSize: '0.8rem',
    marginBottom: '6px', fontWeight: 600,
  },
  requiredBadge: {
    fontSize: '0.65rem', fontWeight: 700,
    background: 'rgba(251,191,36,0.15)', color: '#fbbf24',
    padding: '1px 6px', borderRadius: '99px',
    border: '1px solid rgba(251,191,36,0.3)',
  },
  inputWrap: {
    position: 'relative', display: 'flex', alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none',
  },
  input: {
    display: 'block', width: '100%',
    padding: '12px 14px 12px 42px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--bg-input)',
    color: 'var(--text-main)',
    boxSizing: 'border-box',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all var(--transition-fast)',
  },

  // Role picker
  rolePicker: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
  },
  roleOption: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--border)',
    background: 'var(--bg-input)',
    cursor: 'pointer', transition: 'all 0.2s',
    color: 'var(--text-secondary)',
  },
  roleOptionActive: {
    borderColor: '#6366f1',
    background: 'rgba(99,102,241,0.08)',
    color: '#a5b4fc',
  },
  roleOptionActiveAdmin: {
    borderColor: '#f59e0b',
    background: 'rgba(245,158,11,0.08)',
    color: '#fbbf24',
  },
  roleLabel: { fontSize: '0.82rem', fontWeight: 700 },
  roleDesc: { fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' },

  btn: {
    width: '100%', padding: '13px',
    cursor: 'pointer',
    background: 'var(--accent)',
    color: 'white', border: 'none',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600, fontSize: '0.9rem',
    fontFamily: 'inherit',
    boxShadow: '0 2px 12px var(--accent-glow)',
    transition: 'all var(--transition-fast)',
  },
  btnAdmin: {
    background: 'linear-gradient(135deg, #d97706, #b45309)',
    boxShadow: '0 2px 12px rgba(217,119,6,0.3)',
  },
  linkBtn: {
    background: 'none', border: 'none', color: 'var(--accent-hover)',
    cursor: 'pointer', fontWeight: 600, marginLeft: '6px',
    fontSize: '0.85rem', fontFamily: 'inherit',
  },
  smallLink: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit',
    transition: 'color var(--transition-fast)',
  },
  divider: {
    position: 'relative', textAlign: 'center', margin: '24px 0',
    borderTop: '1px solid var(--border)',
  },
  dividerText: {
    position: 'relative', top: '-10px',
    background: 'var(--bg-panel)', padding: '0 12px',
    fontSize: '0.75rem', color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '1px',
  },
  footer: { textAlign: 'center', fontSize: '0.85rem' },
  footerText: { color: 'var(--text-muted)' },
  errorAlert: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'var(--danger-glow)',
    color: '#fca5a5', padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '20px', fontSize: '0.82rem',
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },
  strengthWrap: {
    display: 'flex', alignItems: 'center', gap: '8px',
    marginTop: '6px',
  },
  strengthBar: {
    flex: 1, height: '4px',
    background: 'var(--bg-input)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
};