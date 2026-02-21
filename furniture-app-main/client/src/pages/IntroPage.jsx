import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ndLogo from '../assets/LOGO/logo.jpeg';
import './IntroPage.css';

/* ─── Data ───────────────────────────────────────────────── */
const ROOMS = [
  {
    id: 'bedroom', label: 'Bedroom', size: '12–25 m²', color: '#8b5cf6',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v11a1 1 0 001 1h16a1 1 0 001-1V7" /><path d="M21 10H3" />
        <path d="M7 10V7a2 2 0 012-2h6a2 2 0 012 2v3" /><path d="M5 19v1" /><path d="M19 19v1" />
      </svg>
    ),
  },
  {
    id: 'living', label: 'Living Room', size: '15–40 m²', color: '#6366f1',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4" /><path d="M3 11h18v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" />
        <path d="M5 18v2" /><path d="M19 18v2" />
      </svg>
    ),
  },
  {
    id: 'dining', label: 'Dining Room', size: '10–20 m²', color: '#ec4899',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14" /><path d="M5 8h14" /><path d="M7 8v11" /><path d="M17 8v11" /><path d="M7 19h10" />
      </svg>
    ),
  },
  {
    id: 'office', label: 'Home Office', size: '8–15 m²', color: '#14b8a6',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="12" rx="2" /><path d="M6 20h12" /><path d="M12 16v4" />
      </svg>
    ),
  },
  {
    id: 'kids', label: "Children's", size: '10–18 m²', color: '#f59e0b',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 018 0" /><path d="M17 13l2 2-2 2" />
      </svg>
    ),
  },
  {
    id: 'outdoor', label: 'Outdoor', size: '20+ m²', color: '#22c55e',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1" /><path d="M18.36 5.64l-.71.71" /><path d="M21 12h-1" />
        <path d="M18.36 18.36l-.71-.71" /><path d="M12 20v1" />
        <path d="M5.64 18.36l.71-.71" /><path d="M3 12h1" /><path d="M5.64 5.64l.71.71" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

const GALLERY = [
  {
    title: 'Calm Scandinavian Bedroom', room: 'Bedroom', area: '21 m²', style: 'Scandinavian',
    gradient: 'linear-gradient(135deg, #312e8133 0%, #4c1d9533 100%)', accentColor: '#8b5cf6', icon: '🛏️'
  },
  {
    title: 'Modern Playful Workspace', room: 'Office', area: '23 m²', style: 'Modern',
    gradient: 'linear-gradient(135deg, #06402133 0%, #06474733 100%)', accentColor: '#14b8a6', icon: '🖥️'
  },
  {
    title: 'Contemporary Living Lounge', room: 'Living', area: '16 m²', style: 'Contemporary',
    gradient: 'linear-gradient(135deg, #83177733 0%, #4338ca33 100%)', accentColor: '#ec4899', icon: '🛋️'
  },
  {
    title: 'Cozy Family Dining', room: 'Dining', area: '18 m²', style: 'Classic',
    gradient: 'linear-gradient(135deg, #312e8133 0%, #6d28d933 100%)', accentColor: '#6366f1', icon: '🍽️'
  },
  {
    title: 'Bright Kids Playroom', room: "Children's", area: '20 m²', style: 'Playful',
    gradient: 'linear-gradient(135deg, #78350f33 0%, #92400e33 100%)', accentColor: '#f59e0b', icon: '🧸'
  },
  {
    title: 'Natural Outdoor Terrace', room: 'Outdoor', area: '30 m²', style: 'Natural',
    gradient: 'linear-gradient(135deg, #14532d33 0%, #16652633 100%)', accentColor: '#22c55e', icon: '🌿'
  },
];

const TOOLS = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 3v18" /></svg>,
    title: 'Room Builder', desc: 'Set exact room dimensions, wall colors, and floor materials. Build any room shape to match real spaces.'
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
    title: '3D Visualization', desc: 'Real-time Three.js rendering with day, golden hour, and night lighting presets for stunning previews.'
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r="2.5" /><path d="M17 17.5c2.38-1.3 3-3.7 3-5.5a6 6 0 00-12 0c0 1.8.62 4.2 3 5.5" /><path d="M8.5 14L4 20h16l-4.5-6" /></svg>,
    title: 'Furniture Library', desc: 'Tables, chairs, sofas, beds, lamps, and shelves. Place and customize with one click.'
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" /></svg>,
    title: 'Customize Everything', desc: 'Color, position, rotation, and scale. Full transform controls for every object in 3D space.'
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    title: 'Save & Load Designs', desc: 'Cloud-based storage powered by MongoDB. Pick up right where you left off, from any device.'
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>,
    title: '2D Blueprint View', desc: 'Switch to top-down bird\'s-eye view for precise furniture placement and measurements.'
  },
];

const STEPS = [
  {
    num: '01', label: 'Step 1', title: 'Choose your room', desc: 'Pick a room type and set dimensions to match your real space. Choose wall and floor colors.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
  },
  {
    num: '02', label: 'Step 2', title: 'Add furniture', desc: 'Browse the library, select pieces and place them. Resize, recolor, rotate anything freely.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4" /><path d="M3 11h18v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" /><path d="M5 18v2" /><path d="M19 18v2" /></svg>
  },
  {
    num: '03', label: 'Step 3', title: 'Visualize & save', desc: 'View in 3D with realistic lighting. Save to cloud or capture a high-quality screenshot.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  },
];

/* ─── Scroll-reveal hook ─────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.ip-reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ip-visible'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function IntroPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [hoveredGallery, setHoveredGallery] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const pageRef = useRef(null);

  useReveal();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) { navigate('/dashboard'); return; }
    requestAnimationFrame(() => setHeroVisible(true));
  }, [navigate]);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const go = useCallback(() => navigate('/login'), [navigate]);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={pageRef} className="ip-page">
      {/* ── Background ──────────────────────────────────── */}
      <div className="ip-bg-grid" aria-hidden="true" />
      <div className="ip-orb ip-orb-1" aria-hidden="true" />
      <div className="ip-orb ip-orb-2" aria-hidden="true" />
      <div className="ip-orb ip-orb-3" aria-hidden="true" />

      {/* ── NAVBAR ──────────────────────────────────────── */}
      <nav className={`ip-nav${scrollY > 40 ? ' ip-nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="ip-nav-inner">
          <div className="ip-brand" role="img" aria-label="ND Furniture logo">
            <img src={ndLogo} alt="ND Furniture" className="ip-brand-logo" />
            <span className="ip-brand-name">ND Furniture</span>
            
          </div>
          <div className="ip-nav-links" role="list">
            <button className="ip-nav-link" onClick={() => scrollTo('rooms')} role="listitem">Rooms</button>
            <button className="ip-nav-link" onClick={() => scrollTo('gallery')} role="listitem">Gallery</button>
            <button className="ip-nav-link" onClick={() => scrollTo('tools')} role="listitem">Features</button>
          </div>
          <button id="btn-nav-signin" className="ip-nav-cta" onClick={go} aria-label="Sign in to start designing">
            Get Started
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section
        className="ip-hero"
        style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(28px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1)' }}
        aria-label="Hero: Welcome to ND Furniture"
      >
        <div className="ip-hero-eyebrow" aria-hidden="true">
          <span className="ip-hero-eyebrow-pill">New</span>
          <span className="ip-hero-dot" />
          Design & Planning Tool 
        </div>

        <h1 className="ip-hero-h1">
          Design your perfect space
          <span className="ip-hero-h1-line2"><br />with ND Furniture</span>
        </h1>

        <p className="ip-hero-sub">
          Visualise, plan, and create room layouts in real-time 3D.
          Drag furniture, customise everything, and see it come together — before you buy.
        </p>

        <div className="ip-hero-actions">
          <button id="btn-hero-start" className="ip-btn-primary" onClick={go} aria-label="Start designing — sign in">
            Start designing free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </button>
          <button id="btn-hero-explore" className="ip-btn-secondary" onClick={() => scrollTo('rooms')} aria-label="Explore room types">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
            Explore rooms
          </button>
        </div>

        {/* Stats strip */}
        <div className="ip-hero-stats" role="list" aria-label="Platform statistics">
          {[
            { num: '6+', label: 'Room Types' },
            null,
            { num: '3D', label: 'Real-time Render' },
            null,
            { num: '2D', label: 'Blueprint View' },
            null,
            { num: '∞', label: 'Customization' },
          ].map((item, i) =>
            item === null
              ? <div key={i} className="ip-stat-sep" aria-hidden="true" />
              : (
                <div key={i} className="ip-stat" role="listitem">
                  <div className="ip-stat-num">{item.num}</div>
                  <div className="ip-stat-label">{item.label}</div>
                </div>
              )
          )}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="ip-divider"><div className="ip-divider-line" /></div>

      {/* ── ROOM SELECTOR ───────────────────────────────── */}
      <section id="rooms" className="ip-section" aria-labelledby="rooms-heading">
        <div className="ip-section-head ip-reveal">
          <span className="ip-section-tag">
            <span className="ip-section-tag-dot" aria-hidden="true" />
            Plan your room
          </span>
          <h2 id="rooms-heading" className="ip-section-h2">Choose a room to start designing</h2>
          <p className="ip-section-p">Select a room type below and jump straight into the 3D designer. Set dimensions, add furniture, and visualise instantly.</p>
        </div>

        <div className="ip-rooms-grid" role="list" aria-label="Room types">
          {ROOMS.map((room, i) => {
            const hov = hoveredRoom === room.id;
            return (
              <button
                key={room.id}
                id={`btn-room-${room.id}`}
                className={`ip-room-card ip-reveal ip-reveal-delay-${Math.min(i + 1, 5)}`}
                role="listitem"
                aria-label={`Design a ${room.label}, typical size ${room.size}`}
                style={{
                  borderColor: hov ? `${room.color}50` : undefined,
                  background: hov ? `rgba(${hexToRgb(room.color)}, 0.08)` : undefined,
                  boxShadow: hov ? `0 16px 40px rgba(${hexToRgb(room.color)}, 0.15)` : undefined,
                }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={go}
              >
                <div className="ip-room-card-glow" style={{ background: room.color }} aria-hidden="true" />
                <div className="ip-room-icon-wrap" style={{ color: room.color, background: `${room.color}18` }}>
                  {room.icon}
                </div>
                <span className="ip-room-name">{room.label}</span>
                <span className="ip-room-size">{room.size}</span>
                <span className="ip-room-arrow" style={{ color: room.color }} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="ip-divider"><div className="ip-divider-line" /></div>

      {/* ── GALLERY ─────────────────────────────────────── */}
      <section id="gallery" className="ip-section" aria-labelledby="gallery-heading">
        <div className="ip-section-head ip-reveal">
          <span className="ip-section-tag">
            <span className="ip-section-tag-dot" aria-hidden="true" />
            Inspiration
          </span>
          <h2 id="gallery-heading" className="ip-section-h2">Furnished room ideas</h2>
          <p className="ip-section-p">Browse pre-designed rooms for inspiration. Each style can be fully customised to your own taste.</p>
        </div>

        <div className="ip-gallery-grid">
          {GALLERY.map((item, i) => {
            const hov = hoveredGallery === i;
            return (
              <article
                key={i}
                className={`ip-gallery-card ip-reveal ip-reveal-delay-${Math.min(i % 3 + 1, 5)}`}
                onMouseEnter={() => setHoveredGallery(i)}
                onMouseLeave={() => setHoveredGallery(null)}
                aria-label={`Gallery item: ${item.title}`}
              >
                <div className="ip-gallery-visual" style={{ background: item.gradient }}>
                  <span className="ip-gallery-emoji" role="img" aria-label={item.room}>{item.icon}</span>
                  <div className="ip-gallery-shimmer" aria-hidden="true" />
                  <span
                    className="ip-gallery-style-badge"
                    style={{ background: `${item.accentColor}18`, color: item.accentColor, borderColor: `${item.accentColor}35` }}
                  >
                    {item.style}
                  </span>
                </div>
                <div className="ip-gallery-body">
                  <h3 className="ip-gallery-title">{item.title}</h3>
                  <div className="ip-gallery-meta">
                    <span className="ip-gallery-meta-tag">{item.room}</span>
                    <span className="ip-gallery-meta-tag">{item.area}</span>
                  </div>
                  <button
                    className="ip-gallery-btn"
                    style={{
                      background: hov ? item.accentColor : 'rgba(255,255,255,0.04)',
                      color: hov ? '#fff' : 'rgba(255,255,255,0.45)',
                      borderColor: hov ? item.accentColor : 'rgba(255,255,255,0.08)',
                    }}
                    onClick={go}
                    aria-label={`Design ${item.title}`}
                  >
                    Design this room →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="ip-divider"><div className="ip-divider-line" /></div>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section className="ip-section" aria-labelledby="steps-heading">
        <div className="ip-section-head ip-reveal">
          <span className="ip-section-tag">
            <span className="ip-section-tag-dot" aria-hidden="true" />
            How it works
          </span>
          <h2 id="steps-heading" className="ip-section-h2">Design in three simple steps</h2>
          <p className="ip-section-p">Getting from blank room to finished design takes just minutes.</p>
        </div>

        <div className="ip-steps-row" role="list" aria-label="Design steps">
          {STEPS.map((step, i) => (
            <div key={i} className={`ip-step-item ip-reveal ip-reveal-delay-${i + 1}`} role="listitem">
              <div className="ip-step-num-wrap">
                <div className="ip-step-num-ring">
                  <span className="ip-step-n">{step.num}</span>
                </div>
              </div>
              <div className="ip-step-icon-box">{step.icon}</div>
              <div className="ip-step-label">{step.label}</div>
              <h3 className="ip-step-title">{step.title}</h3>
              <p className="ip-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="ip-divider"><div className="ip-divider-line" /></div>

      {/* ── FEATURES / TOOLS ────────────────────────────── */}
      <section id="tools" className="ip-section" aria-labelledby="tools-heading">
        <div className="ip-section-head ip-reveal">
          <span className="ip-section-tag">
            <span className="ip-section-tag-dot" aria-hidden="true" />
            Planning tools
          </span>
          <h2 id="tools-heading" className="ip-section-h2">Everything you need, in one place</h2>
          <p className="ip-section-p">A complete toolkit for furniture visualization — in-store and at home.</p>
        </div>

        <div className="ip-tools-grid">
          {TOOLS.map((t, i) => (
            <div key={i} className={`ip-tool-card ip-reveal ip-reveal-delay-${i % 3 + 1}`}>
              <div className="ip-tool-icon">{t.icon}</div>
              <h3 className="ip-tool-title">{t.title}</h3>
              <p className="ip-tool-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────── */}
      <div className="ip-cta-wrap">
        <div className="ip-cta-banner ip-reveal" role="complementary" aria-labelledby="cta-heading">
          <div className="ip-cta-noise" aria-hidden="true" />
          <div className="ip-cta-glow-l" aria-hidden="true" />
          <div className="ip-cta-glow-r" aria-hidden="true" />
          <div className="ip-cta-content">
            <h2 id="cta-heading" className="ip-cta-h2">Ready to design your dream room?</h2>
            <p className="ip-cta-p">
              Create your free account and start visualising furniture layouts in 3D.<br />
              No downloads. No installation. Just design.
            </p>
            <button id="btn-cta-start" className="ip-btn-primary" onClick={go} aria-label="Create free account and start designing">
              Start designing — it's free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
            </button>
            <div className="ip-cta-trust" aria-label="Trust signals">
              {[
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, text: 'No credit card required' },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>, text: 'Free forever plan' },
                { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>, text: 'Cloud saves included' },
              ].map((t, i) => (
                <span key={i} className="ip-cta-trust-item">
                  {t.icon}{t.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="ip-footer" role="contentinfo">
        <div className="ip-footer-inner">
          <div className="ip-footer-left">
            <div className="ip-brand">
              <img src={ndLogo} alt="ND Furniture" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.6)' }}>ND Furniture</span>
            </div>
            <span className="ip-footer-copy">Built with React · Three.js · Node.js · MongoDB</span>
          </div>
          <nav className="ip-footer-links" aria-label="Footer navigation">
            <button className="ip-footer-link" onClick={() => scrollTo('rooms')}>Rooms</button>
            <button className="ip-footer-link" onClick={() => scrollTo('gallery')}>Gallery</button>
            <button className="ip-footer-link" onClick={() => scrollTo('tools')}>Features</button>
            <button className="ip-footer-link" onClick={go}>Sign In</button>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/* ─── Utility ────────────────────────────────────────────── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
