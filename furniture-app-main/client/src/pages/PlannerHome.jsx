import React from 'react';
import { useNavigate } from 'react-router-dom';
import ndLogo from '../assets/LOGO/logo.jpeg';
import './PlannerHome.css';

const quickStarts = [
  { title: 'Add Room or Floor Plan', action: 'Create', badge: '+' },
  { title: 'Add Floor Plan', action: 'Open', badge: 'FP' },
  { title: 'Add Bedroom', action: 'Start', badge: 'BD' },
  { title: 'Add Living Room', action: 'Start', badge: 'LR' },
  { title: 'More Rooms', action: 'Browse', badge: '...' },
];

const featureCards = [
  {
    title: 'Create 3D design',
    desc: 'Start from templates or blank canvas and design your room in minutes.',
    cta: 'Start',
    onAction: '/dashboard',
  },
  {
    title: 'AI Redesign',
    desc: 'Upload a room photo and let AI generate layout and style inspiration.',
    cta: 'Try',
    onAction: '/dashboard',
  },
  {
    title: 'Order Design',
    desc: 'Request a full design package curated for your dimensions and style.',
    cta: 'Open',
    onAction: '/dashboard',
  },
];

export default function PlannerHome() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    navigate('/login');
  };

  return (
    <div className="ph-page">
      <aside className="ph-sidebar">
        <div className="ph-brand">
          <img className="ph-brand-icon" src={ndLogo} alt="ND furniture" />
          <div>
            <div className="ph-brand-title">ND furniture</div>
            <div className="ph-brand-sub">Design Studio</div>
          </div>
        </div>

        <nav className="ph-nav">
          <button className="ph-nav-item ph-nav-item--active" type="button">Home</button>
          <button className="ph-nav-item" type="button" onClick={() => navigate('/dashboard')}>Explore Studio</button>
          <button className="ph-nav-item" type="button" onClick={() => navigate('/onboarding')}>Quick Tour</button>
          <button className="ph-nav-item" type="button">Ideas</button>
          <button className="ph-nav-item" type="button">Notifications</button>
        </nav>

        <div className="ph-user">
          <div className="ph-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div className="ph-user-name">{user?.username || 'Designer'}</div>
            <div className="ph-user-role">Designer</div>
          </div>
        </div>

        <button className="ph-signout" type="button" onClick={signOut}>Sign Out</button>
      </aside>

      <main className="ph-main">
        <header className="ph-header">
          <div>
            <h1>Home Planner</h1>
            <p>My 3D Designs</p>
          </div>
          <div className="ph-sync">
            <span>Do not lose your progress</span>
            <button type="button">Sync now</button>
          </div>
        </header>

        <section className="ph-quick-grid">
          {quickStarts.map((card) => (
            <button className="ph-quick-card" type="button" key={card.title} onClick={() => navigate('/dashboard')}>
              <span className="ph-quick-badge">{card.badge}</span>
              <span className="ph-quick-title">{card.title}</span>
              <span className="ph-quick-action">{card.action}</span>
            </button>
          ))}
        </section>

        <section className="ph-feature-grid">
          {featureCards.map((card) => (
            <article className="ph-feature-card" key={card.title}>
              <div className="ph-feature-visual" />
              <div className="ph-feature-body">
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
                <button type="button" onClick={() => navigate(card.onAction)}>{card.cta}</button>
              </div>
            </article>
          ))}
        </section>

        <section className="ph-more">
          <h2>More</h2>
          <div className="ph-more-row">
            <button type="button">Find Ideas</button>
            <button type="button">Photo Search in Stores</button>
            <button type="button">Help and Feedback</button>
          </div>
        </section>
      </main>
    </div>
  );
}
