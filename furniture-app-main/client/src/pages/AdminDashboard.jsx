import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

/* ─── Sub-components ─── */
const StatCard = ({ icon, label, value, color }) => (
    <div className="adm-stat-card" style={{ borderTopColor: color }}>
        <div className="adm-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
        <div>
            <p className="adm-stat-value">{value}</p>
            <p className="adm-stat-label">{label}</p>
        </div>
    </div>
);

const Toast = ({ message, type = 'info', onDismiss }) => {
    const cfgs = {
        success: { icon: '✓', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
        error: { icon: '✕', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
        info: { icon: 'ℹ', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
    };
    const c = cfgs[type] || cfgs.info;
    return (
        <div className="adm-toast" style={{ background: c.bg, borderColor: c.border }} role="alert">
            <span style={{ color: c.color, fontWeight: 700 }}>{c.icon}</span>
            <span className="adm-toast-msg">{message}</span>
            <button className="adm-toast-close" onClick={onDismiss}>×</button>
        </div>
    );
};

/* ─── Confirmation Modal ─── */
const ConfirmModal = ({ user, onConfirm, onCancel }) => (
    <div className="adm-modal-backdrop">
        <div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="adm-modal-icon adm-modal-icon--danger">⚠</div>
            <h3 id="confirm-title" className="adm-modal-title">Remove User Account?</h3>
            <p className="adm-modal-desc">
                This will permanently delete the account for <strong>{user.username}</strong> ({user.email}).
                This action cannot be undone.
            </p>
            <div className="adm-modal-actions">
                <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Cancel</button>
                <button className="adm-btn adm-btn--danger" onClick={onConfirm}>Delete Account</button>
            </div>
        </div>
    </div>
);

/* ─── Customer Session Modal (show the design canvas to an in-store customer) ─── */
const CustomerSessionModal = ({ onClose }) => (
    <div className="adm-modal-backdrop">
        <div className="adm-modal adm-modal--wide" role="dialog" aria-modal="true">
            <h3 className="adm-modal-title">Start Customer Session</h3>
            <p className="adm-modal-desc">
                As store staff you can launch a design session and hand over the screen to the customer.
                The session will run in the full design canvas with all tools available.
            </p>
            <div className="adm-modal-actions">
                <button className="adm-btn adm-btn--ghost" onClick={onClose}>Cancel</button>
                <a href="/dashboard" className="adm-btn adm-btn--primary">
                    🚀 Launch Design Canvas
                </a>
            </div>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
══════════════════════════════════════════════════════ */
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [toastType, setToastType] = useState('info');
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [showSession, setShowSession] = useState(false);
    const [activeTab, setActiveTab] = useState('users');

    const showToast = (msg, type = 'info') => {
        setToast(msg); setToastType(type);
        setTimeout(() => setToast(null), 3500);
    };

    /* ── Auth guard: must be admin ── */
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) { navigate('/login'); return; }
        const parsed = JSON.parse(stored);
        if (parsed.role !== 'admin') { navigate('/dashboard'); return; }
        setAdminUser(parsed);
    }, [navigate]);

    /* ── Fetch all users ── */
    const fetchUsers = async (token) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch {
            showToast('Unable to load users.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (adminUser) fetchUsers(adminUser.token);
    }, [adminUser]);

    /* ── Delete user ── */
    const handleDeleteConfirm = async () => {
        const target = confirmDelete;
        setConfirmDelete(null);
        try {
            const res = await fetch(`http://localhost:5000/api/auth/users/${target._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${adminUser.token}` },
            });
            const data = await res.json();
            if (data.success) {
                setUsers(prev => prev.filter(u => u._id !== target._id));
                showToast(`${target.username}'s account deleted.`, 'success');
            } else {
                showToast(data.message || 'Delete failed.', 'error');
            }
        } catch {
            showToast('Delete request failed.', 'error');
        }
    };

    const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

    /* ── Derived stats ── */
    const regularUsers = users.filter(u => u.role !== 'admin');
    const adminUsers = users.filter(u => u.role === 'admin');
    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (!adminUser) return null;

    return (
        <div className="adm-root">
            {/* ── SIDEBAR ── */}
            <aside className="adm-sidebar">
                <div className="adm-sidebar-brand">
                    <div className="adm-sidebar-logo">🛡</div>
                    <div>
                        <div className="adm-sidebar-title">ND Furniture</div>
                        <div className="adm-sidebar-subtitle">Admin Panel</div>
                    </div>
                </div>

                <nav className="adm-nav">
                    <button
                        className={`adm-nav-item ${activeTab === 'users' ? 'adm-nav-item--active' : ''}`}
                        onClick={() => setActiveTab('users')}
                        id="admin-nav-users"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                        User Management
                    </button>
                    <button
                        className={`adm-nav-item ${activeTab === 'session' ? 'adm-nav-item--active' : ''}`}
                        onClick={() => setActiveTab('session')}
                        id="admin-nav-session"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                        Customer Session
                    </button>
                    <button
                        className={`adm-nav-item ${activeTab === 'guide' ? 'adm-nav-item--active' : ''}`}
                        onClick={() => setActiveTab('guide')}
                        id="admin-nav-guide"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                        Staff Guide
                    </button>
                </nav>

                <div className="adm-sidebar-footer">
                    <div className="adm-user-chip">
                        <div className="adm-avatar">{adminUser.username[0].toUpperCase()}</div>
                        <div>
                            <div className="adm-user-name">{adminUser.username}</div>
                            <div className="adm-user-role">Admin</div>
                        </div>
                    </div>
                    <button className="adm-logout-btn" onClick={handleLogout} id="admin-logout-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── MAIN AREA ── */}
            <main className="adm-main">
                {/* Header */}
                <header className="adm-header">
                    <div>
                        <h1 className="adm-header-title">
                            {activeTab === 'users' && 'User Management'}
                            {activeTab === 'session' && 'Customer Session'}
                            {activeTab === 'guide' && 'Staff Guide'}
                        </h1>
                        <p className="adm-header-sub">
                            {activeTab === 'users' && 'Manage customer and staff accounts'}
                            {activeTab === 'session' && 'Launch a design session for an in-store customer'}
                            {activeTab === 'guide' && 'Quick reference for using the admin tools'}
                        </p>
                    </div>
                    <div className="adm-header-right">
                        <span className="adm-admin-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Admin Access
                        </span>
                    </div>
                </header>

                {/* ── TAB: USER MANAGEMENT ── */}
                {activeTab === 'users' && (
                    <>
                        {/* Stat cards */}
                        <div className="adm-stats-row">
                            <StatCard icon="👥" label="Total Accounts" value={users.length} color="#6366f1" />
                            <StatCard icon="🧑‍💼" label="Customers" value={regularUsers.length} color="#22c55e" />
                            <StatCard icon="🛡" label="Staff Accounts" value={adminUsers.length} color="#f59e0b" />
                        </div>

                        {/* Search bar + refresh */}
                        <div className="adm-toolbar">
                            <div className="adm-search-wrap">
                                <svg className="adm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                <input
                                    id="admin-user-search"
                                    className="adm-search-input"
                                    placeholder="Search by username or email…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    aria-label="Search users"
                                />
                            </div>
                            <button
                                className="adm-btn adm-btn--ghost"
                                onClick={() => fetchUsers(adminUser.token)}
                                aria-label="Refresh user list"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                Refresh
                            </button>
                        </div>

                        {/* User table */}
                        <div className="adm-table-wrap">
                            {loading ? (
                                <div className="adm-loading">
                                    <div className="adm-spinner" />
                                    <span>Loading users…</span>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="adm-empty">
                                    <div className="adm-empty-icon">👤</div>
                                    <p>No users found</p>
                                </div>
                            ) : (
                                <table className="adm-table" aria-label="Registered users">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(u => (
                                            <tr key={u._id} className="adm-table-row">
                                                <td>
                                                    <div className="adm-user-cell">
                                                        <div className="adm-user-avatar" style={{ background: u.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)', color: u.role === 'admin' ? '#fbbf24' : '#a5b4fc' }}>
                                                            {u.username[0].toUpperCase()}
                                                        </div>
                                                        <span className="adm-user-uname">{u.username}</span>
                                                    </div>
                                                </td>
                                                <td className="adm-email">{u.email}</td>
                                                <td>
                                                    <span className={`adm-role-badge adm-role-badge--${u.role}`}>
                                                        {u.role === 'admin' ? '🛡 Staff' : '👤 Customer'}
                                                    </span>
                                                </td>
                                                <td className="adm-date">
                                                    {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td>
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            className="adm-btn adm-btn--danger-sm"
                                                            onClick={() => setConfirmDelete(u)}
                                                            aria-label={`Delete ${u.username}'s account`}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                                                            Remove
                                                        </button>
                                                    )}
                                                    {u.role === 'admin' && (
                                                        <span className="adm-protected-label">Protected</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {/* ── TAB: CUSTOMER SESSION ── */}
                {activeTab === 'session' && (
                    <div className="adm-session-panel">
                        <div className="adm-session-card">
                            <div className="adm-session-icon">🖥️</div>
                            <h2 className="adm-session-title">In-Store Customer Demo</h2>
                            <p className="adm-session-desc">
                                As a member of ND Furniture customer service staff, you can open the full 3D design
                                canvas and hand control to a customer physically present in the store. The customer
                                will be able to explore furniture, configure their room, and visualise their purchase
                                in real time.
                            </p>
                            <ul className="adm-session-features">
                                <li>✔ Full 3D furniture placement</li>
                                <li>✔ Blueprint / floor-plan view</li>
                                <li>✔ Room dimensions & finishing options</li>
                                <li>✔ Screenshot &amp; save to your staff account</li>
                            </ul>
                            <button
                                className="adm-btn adm-btn--primary adm-btn--lg"
                                onClick={() => setShowSession(true)}
                                id="admin-launch-session"
                            >
                                🚀 Launch Customer Session
                            </button>
                        </div>
                    </div>
                )}

                {/* ── TAB: STAFF GUIDE ── */}
                {activeTab === 'guide' && (
                    <div className="adm-guide">
                        <div className="adm-guide-card">
                            <h3>🛡 Admin Capabilities</h3>
                            <ul>
                                <li><strong>User Management</strong> – View all registered accounts, search by name or email, and remove customer accounts when needed.</li>
                                <li><strong>Customer Session</strong> – Launch the 3D design canvas for in-store customers using the "Customer Session" tab.</li>
                                <li><strong>Design Access</strong> – Admin accounts can also use the full design canvas at any time via the "Launch Design Canvas" button.</li>
                            </ul>
                        </div>
                        <div className="adm-guide-card">
                            <h3>👤 Registering Staff Accounts</h3>
                            <p>New staff members must register with the <strong>Store Staff</strong> account type and provide the staff access code. Contact your store manager to obtain the code. The default code for development is <code>NDSTAFF2024</code>.</p>
                        </div>
                        <div className="adm-guide-card">
                            <h3>ℹ Role Differences</h3>
                            <table className="adm-guide-table">
                                <thead><tr><th>Feature</th><th>Customer</th><th>Staff (Admin)</th></tr></thead>
                                <tbody>
                                    <tr><td>3D Design Canvas</td><td>✔</td><td>✔</td></tr>
                                    <tr><td>Save &amp; Load Designs</td><td>✔</td><td>✔</td></tr>
                                    <tr><td>Blueprint View</td><td>✔</td><td>✔</td></tr>
                                    <tr><td>User Management</td><td>✗</td><td>✔</td></tr>
                                    <tr><td>In-Store Customer Session</td><td>✗</td><td>✔</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* ── MODALS / OVERLAYS ── */}
            {confirmDelete && (
                <ConfirmModal
                    user={confirmDelete}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
            {showSession && <CustomerSessionModal onClose={() => setShowSession(false)} />}

            {/* ── TOAST ── */}
            {toast && <Toast message={toast} type={toastType} onDismiss={() => setToast(null)} />}
        </div>
    );
}
