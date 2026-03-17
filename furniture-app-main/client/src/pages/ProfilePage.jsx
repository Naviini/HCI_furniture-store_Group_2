import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const menuItems = [
  'Share Profile',
  'Profile Settings',
  'Help and Feedback',
  'I Love It!',
  'Upgrade to PRO',
];

const quickChips = ['Ideas & Likes', 'My Items'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Posts');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const name = useMemo(() => user?.username || 'User Name', [user]);
  const initial = useMemo(() => name.charAt(0).toUpperCase(), [name]);

  return (
    <div className="pp-page">
      <main className="pp-card">
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
                  <button type="button" className="pp-menu-item" role="menuitem" key={item}>
                    {item}
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
      </main>
    </div>
  );
}
