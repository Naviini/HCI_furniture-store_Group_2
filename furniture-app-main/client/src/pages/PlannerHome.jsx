import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ndLogo from '../assets/LOGO/logo.jpeg';
import floorPlanCard from '../assets/home-cards/floor-plan-generated.svg';
import bedroomCard from '../assets/home-cards/bedroom.jpg';
import floorPlanRender from '../assets/home-cards/floor-plan.jpg';
import livingPreview from '../assets/background images/modern_living_rooms_with_the_right_furniture.webp';
import './PlannerHome.css';

const quickCards = [
  {
    title: 'Add Room or Floor Plan',
    kind: 'add',
  },
  {
    title: 'My Floor Plans',
    kind: 'plan',
    photo: floorPlanCard,
    badge: '1 design',
  },
  {
    title: 'Add Bedroom',
    kind: 'room',
    photo: bedroomCard,
    showAlert: true,
  },
  {
    title: 'Add Living room',
    kind: 'room',
    photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    showAlert: true,
  },
  {
    title: 'More rooms...',
    kind: 'more',
  },
];

const featureCards = [
  {
    title: 'AI Redesign',
    desc: 'Upload a photo - let AI recreate the interior',
    cta: 'TRY',
    media: [livingPreview, bedroomCard],
    onAction: '/dashboard',
  },
  {
    title: 'Order Design',
    desc: 'Request a complete design made just for you',
    cta: 'OPEN',
    media: [floorPlanCard, floorPlanRender],
    onAction: '/dashboard',
  },
];

const primaryNav = [
  { label: 'Home', active: true, onAction: null },
  { label: 'Designer Studio', active: false, onAction: '/dashboard' },
  { label: 'Profile', active: false, onAction: '/profile' },
  { label: 'Settings', active: false, onAction: '/settings' },
  { label: 'Quick Tour', active: false, onAction: '/onboarding' },
];

const secondaryNav = [
  { label: 'My Photos' },
  { label: 'Ideas & Likes' },
];

const footerNav = [
  { label: 'Notification' },
  { label: 'More' },
];

export default function PlannerHome() {
  const navigate = useNavigate();
  const [failedQuickPhotos, setFailedQuickPhotos] = useState({});

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
          <div className="ph-brand-copy">
            <div className="ph-brand-title">ND</div>
            <div className="ph-brand-title">Furnitures</div>
          </div>
        </div>

        <nav className="ph-nav ph-nav--primary">
          {primaryNav.map((item) => (
            <button
              className={`ph-nav-item${item.active ? ' ph-nav-item--active' : ''}`}
              type="button"
              key={item.label}
              onClick={() => item.onAction && navigate(item.onAction)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="ph-sidebar-divider" />

        <nav className="ph-nav ph-nav--secondary">
          {secondaryNav.map((item) => (
            <button className="ph-nav-item" type="button" key={item.label}>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="ph-sidebar-spacer" />

        <nav className="ph-nav ph-nav--footer">
          {footerNav.map((item) => (
            <button className="ph-nav-item" type="button" key={item.label}>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="ph-nav-item ph-nav-item--exit" type="button" onClick={signOut}>
          <span>Exit</span>
        </button>
      </aside>

      <main className="ph-main">
        <header className="ph-header">
          <h1>ND Furnitures</h1>
        </header>

        <section className="ph-reward-strip">
          <div className="ph-reward-copy">
            <span className="ph-reward-gift" aria-hidden="true">*</span>
            <div>
              <strong>Your daily reward is here</strong>
              <p>Tap to collect your rewards!</p>
            </div>
          </div>
          <button type="button" className="ph-pill-btn">Claim reward</button>
        </section>

        <section className="ph-designs-head">
          <h2>My 3D Designs</h2>
          <div className="ph-sync-strip">
            <span>Do not lose your progress</span>
            <button type="button" className="ph-pill-btn">Sync now</button>
          </div>
        </section>

        <section className="ph-quick-grid">
          {quickCards.map((card) => {
            const photoKey = `${card.title}-${card.photo || ''}`;
            return (
            <button className="ph-quick-card" type="button" key={card.title} onClick={() => navigate('/dashboard')}>
              <div className={`ph-quick-media ph-quick-media--${card.kind}`}>
                {card.kind === 'add' && <span className="ph-quick-center-icon" aria-hidden="true">+</span>}

                {card.kind === 'more' && (
                  <svg className="ph-quick-center-arrow" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}

                {(card.kind === 'plan' || card.kind === 'room') && (
                  <>
                    {card.showAlert && <span className="ph-quick-dot" aria-hidden="true" />}
                    {failedQuickPhotos[photoKey] ? (
                      <div className="ph-quick-photo-fallback" aria-hidden="true">
                        {card.title}
                      </div>
                    ) : (
                      <img
                        src={card.photo}
                        alt={card.title}
                        className="ph-quick-photo"
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailedQuickPhotos((prev) => ({ ...prev, [photoKey]: true }))}
                      />
                    )}
                  </>
                )}

                {card.kind === 'plan' && <span className="ph-quick-plan-badge">{card.badge}</span>}
                {card.kind === 'room' && <span className="ph-quick-plus" aria-hidden="true">+</span>}
              </div>
              <span className="ph-quick-title">{card.title}</span>
            </button>
            );
          })}
        </section>

        <section className="ph-feature-grid">
          {featureCards.map((card) => (
            <article className="ph-feature-card" key={card.title}>
              <div className="ph-feature-visual">
                {card.media.map((photo, idx) => (
                  <img
                    key={`${card.title}-${idx}`}
                    src={photo}
                    alt={`${card.title} preview ${idx + 1}`}
                    className="ph-feature-photo"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                <span className="ph-feature-split" aria-hidden="true" />
                <span className="ph-feature-nav" aria-hidden="true">›</span>
              </div>
              <div className="ph-feature-body">
                <div className="ph-feature-head">
                  <h3>{card.title}</h3>
                  <button type="button" className="ph-feature-cta" onClick={() => navigate(card.onAction)}>{card.cta}</button>
                </div>
                <p>{card.desc}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="ph-more">
          <h2>More</h2>
          <div className="ph-more-row">
            <button type="button">Find Ideas</button>
            <button type="button">Photo search in stores</button>
            <button type="button">Help and Feedback</button>
          </div>
        </section>
      </main>
    </div>
  );
}
