import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ndLogo from '../assets/LOGO/logo.jpeg';
import './ProfilePage.css';

const menuItems = [
  { label: 'Share Profile' },
  { label: 'Settings', action: '/settings' },
  { label: 'Help and Feedback' },
  { label: 'I Love It!' },
  { label: 'Upgrade to PRO' },
];

const quickChips = ['Ideas & Likes', 'My Items'];

const mainNav = [
  { label: 'Home', action: '/home' },
  { label: 'Designer Studio', action: '/dashboard' },
  { label: 'Profile', action: null, active: true },
  { label: 'Settings', action: '/settings' },
  { label: 'Quick Tour', action: '/onboarding' },
];

const secondaryNav = [
  { label: 'My Photos' },
  { label: 'Ideas & Likes' },
];

const footerNav = [
  { label: 'Notification' },
  { label: 'More' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Posts');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const name = useMemo(() => user?.username || 'User Name', [user]);
  const initial = useMemo(() => name.charAt(0).toUpperCase(), [name]);

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    navigate('/login');
  };

  return (
    <div className="pp-page">
      <aside className="pp-sidebar">
        <div className="pp-brand">
          <img className="pp-brand-icon" src={ndLogo} alt="ND furniture" />
          <div className="pp-brand-copy">
            <div className="pp-brand-title">ND</div>
            <div className="pp-brand-title">Furnitures</div>
          </div>
        </div>

        <nav className="pp-nav">
          {mainNav.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`pp-nav-item${item.active ? ' is-active' : ''}`}
              onClick={() => item.action && navigate(item.action)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pp-sidebar-divider" />

        <nav className="pp-nav">
          {secondaryNav.map((item) => (
            <button key={item.label} type="button" className="pp-nav-item">
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pp-sidebar-spacer" />

        <nav className="pp-nav pp-nav--footer">
          {footerNav.map((item) => (
            <button key={item.label} type="button" className="pp-nav-item">
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="pp-nav-item pp-nav-item--exit" onClick={signOut}>
          <span>Exit</span>
        </button>
      </aside>

      <main className="pp-main">
        <section className="pp-card">
        <header className="pp-top-row">
          <h1>{name}</h1>
          <div className="pp-menu-wrap">
            <button
              type="button"
              className="pp-menu-btn"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
            >
              ...
            </button>
            {menuOpen && (
              <div className="pp-menu" role="menu" aria-label="Profile actions">
                {menuItems.map((item) => (
                  <button
                    type="button"
                    className="pp-menu-item"
                    role="menuitem"
                    key={item.label}
                    onClick={() => {
                      if (item.action) navigate(item.action);
                      setMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <section className="pp-meta-row">
          <div className="pp-avatar-ring" aria-label="Profile avatar">
            <div className="pp-avatar">{initial}</div>
            <span className="pp-level">1M</span>
          </div>

          <div className="pp-stats">
            <div className="pp-stat">
              <strong>0</strong>
              <span>Posts</span>
            </div>
            <div className="pp-stat">
              <strong>0</strong>
              <span>Followers</span>
            </div>
            <div className="pp-stat">
              <strong>0</strong>
              <span>Following</span>
            </div>
            <button type="button" className="pp-pro-btn">Get Pro</button>
          </div>
        </section>

        <button type="button" className="pp-edit-btn">Edit profile</button>

        <section className="pp-chip-row" aria-label="Quick profile sections">
          {quickChips.map((chip) => (
            <button type="button" className="pp-chip" key={chip}>{chip}</button>
          ))}
        </section>

        <section className="pp-tabs" aria-label="Profile tabs">
          {['Posts', 'Rewards'].map((tab) => (
            <button
              type="button"
              key={tab}
              className={`pp-tab${activeTab === tab ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </section>

        <section className="pp-empty-state">
          <div className="pp-social-row" aria-hidden="true">
            <span className="pp-social">G</span>
            <span className="pp-social">f</span>
            <span className="pp-social">a</span>
            <span className="pp-social">@</span>
          </div>
          <p>Sign in to share your projects and communicate with other designers</p>
          <button type="button" className="pp-signin-btn" onClick={() => navigate('/login')}>Sign in</button>
        </section>

        <footer className="pp-footer-row">
          <button type="button" className="pp-link-btn" onClick={() => navigate('/home')}>Back to Home</button>
          <button type="button" className="pp-link-btn" onClick={() => navigate('/dashboard')}>Open Designer Studio</button>
        </footer>
        </section>
      </main>
    </div>
  );
}
