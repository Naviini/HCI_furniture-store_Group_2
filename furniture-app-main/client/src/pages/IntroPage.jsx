import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Room Types ──────────────────────────────────── */
const ROOMS = [
  {
    id: 'bedroom',
    label: 'Bedroom',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v11a1 1 0 001 1h16a1 1 0 001-1V7" />
        <path d="M21 10H3" />
        <path d="M7 10V7a2 2 0 012-2h6a2 2 0 012 2v3" />
        <path d="M5 19v1" /><path d="M19 19v1" />
      </svg>
    ),
    size: '12–25 m²',
    color: '#8b5cf6',
  },
  {
    id: 'living',
    label: 'Living Room',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4" />
        <path d="M3 11h18v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" />
        <path d="M5 18v2" /><path d="M19 18v2" />
      </svg>
    ),
    size: '15–40 m²',
    color: '#6366f1',
  },
  {
    id: 'dining',
    label: 'Dining Room',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14" />
        <path d="M5 8h14" />
        <path d="M7 8v11" /><path d="M17 8v11" />
        <path d="M7 19h10" />
      </svg>
    ),
    size: '10–20 m²',
    color: '#ec4899',
  },
  {
    id: 'office',
    label: 'Home Office',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="12" rx="2" />
        <path d="M6 20h12" /><path d="M12 16v4" />
      </svg>
    ),
    size: '8–15 m²',
    color: '#14b8a6',
  },
  {
    id: 'kids',
    label: "Children's Room",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a4 4 0 018 0" />
        <path d="M17 13l2 2-2 2" />
      </svg>
    ),
    size: '10–18 m²',
    color: '#f59e0b',
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1" /><path d="M18.36 5.64l-.71.71" /><path d="M21 12h-1" />
        <path d="M18.36 18.36l-.71-.71" /><path d="M12 20v1" />
        <path d="M5.64 18.36l.71-.71" /><path d="M3 12h1" /><path d="M5.64 5.64l.71.71" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    size: '20+ m²',
    color: '#22c55e',
  },
];

/* ─── Gallery Items ──────────────────────────────── */
const GALLERY = [
  {
    title: 'Calm Scandinavian Bedroom',
    room: 'Bedroom',
    area: '21 m²',
    style: 'Scandinavian',
    gradient: 'linear-gradient(135deg, #667eea33 0%, #764ba233 100%)',
    accentColor: '#8b5cf6',
    icon: '🛏️',
  },
  {
    title: 'Modern Playful Workspace',
    room: 'Office',
    area: '23 m²',
    style: 'Modern',
    gradient: 'linear-gradient(135deg, #43e97b33 0%, #38f9d733 100%)',
    accentColor: '#14b8a6',
    icon: '🖥️',
  },
  {
    title: 'Contemporary Living Lounge',
    room: 'Living Room',
    area: '16 m²',
    style: 'Contemporary',
    gradient: 'linear-gradient(135deg, #fa709a33 0%, #fee14033 100%)',
    accentColor: '#ec4899',
    icon: '🛋️',
  },
  {
    title: 'Cozy Family Dining',
    room: 'Dining',
    area: '18 m²',
    style: 'Classic',
    gradient: 'linear-gradient(135deg, #a18cd133 0%, #fbc2eb33 100%)',
    accentColor: '#6366f1',
    icon: '🍽️',
  },
  {
    title: 'Bright Kids Playroom',
    room: "Children's",
    area: '20 m²',
    style: 'Playful',
    gradient: 'linear-gradient(135deg, #ffecd233 0%, #fcb69f33 100%)',
    accentColor: '#f59e0b',
    icon: '🧸',
  },
  {
    title: 'Natural Outdoor Terrace',
    room: 'Outdoor',
    area: '30 m²',
    style: 'Natural',
    gradient: 'linear-gradient(135deg, #d4fc7933 0%, #96e6a133 100%)',
    accentColor: '#22c55e',
    icon: '🌿',
  },
];

/* ─── Features ──────────────────────────────────── */
const TOOLS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 3v18" /></svg>
    ),
    title: 'Room Builder',
    desc: 'Set exact room dimensions, wall colors, and floor materials. Build any shape room to match real spaces.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
    ),
    title: '3D Visualization',
    desc: 'Real-time Three.js rendering with day, golden hour, and night lighting presets.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r="2.5" /><path d="M17 17.5c2.38-1.3 3-3.7 3-5.5a6 6 0 00-12 0c0 1.8.62 4.2 3 5.5" /><path d="M8.5 14L4 20h16l-4.5-6" /></svg>
    ),
    title: 'Furniture Library',
    desc: 'Tables, chairs, sofas, beds, lamps, and shelves. Drag, drop, and place with one click.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" /></svg>
    ),
    title: 'Customize Everything',
    desc: 'Color, position, rotation, and scale. Transform controls for each object in 3D space.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    ),
    title: 'Save & Load Designs',
    desc: 'Cloud-based storage powered by MongoDB. Pick up right where you left off, from any device.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
    ),
    title: '2D Blueprint View',
    desc: 'Switch to a top-down bird\'s-eye view for precise furniture placement and measurement.',
  },
];

/* ─── Steps ──────────────────────────────────────── */
const STEPS = [
  {
    num: '1',
    title: 'Choose your room',
    desc: 'Pick a room type and set dimensions to match the real space. Choose wall and floor colors.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
    ),
  },
  {
    num: '2',
    title: 'Add furniture',
    desc: 'Browse the library, select pieces and place them in your room. Resize, recolor, rotate freely.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4" /><path d="M3 11h18v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" /><path d="M5 18v2" /><path d="M19 18v2" /></svg>
    ),
  },
  {
    num: '3',
    title: 'Visualize & save',
    desc: 'View in 3D with realistic lighting. Save your design to the cloud or capture a screenshot.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
  },
];


/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
export default function IntroPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [hoveredGallery, setHoveredGallery] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const pageRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) { navigate('/dashboard'); return; }
    requestAnimationFrame(() => setVisible(true));
  }, [navigate]);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const handleScroll = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const startDesigning = () => navigate('/login');

  return (
    <div ref={pageRef} style={st.page}>
      {/* ── Ambient BG ──────────────────────────── */}
      <div style={st.bgNoise} />
      <div style={{ ...st.bgOrb, top: '-15%', left: '-8%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
      <div style={{ ...st.bgOrb, bottom: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      {/* ── Navbar ───────────────────────────────── */}
      <nav style={{ ...st.nav, borderBottomColor: scrollY > 30 ? 'var(--border)' : 'transparent', background: scrollY > 30 ? 'rgba(12,15,23,0.92)' : 'transparent' }}>
        <div style={st.navInner}>
          <div style={st.brand}>
            <div style={st.brandIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
            </div>
            <span style={st.brandName}>FurnishStudio</span>
          </div>
          <div style={st.navRight}>
            <a href="#rooms" style={st.navLink}>Rooms</a>
            <a href="#gallery" style={st.navLink}>Gallery</a>
            <a href="#tools" style={st.navLink}>Tools</a>
            <button style={st.navSignIn} onClick={startDesigning}>
              Sign in
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────── */}
      <section style={{ ...st.hero, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }} aria-label="Welcome">
        <div style={st.heroBadge} aria-hidden="true">
          <span style={st.heroDot} /> Design & Planning Tool
        </div>

        <h1 style={st.heroH1}>
          Design your perfect space<br />
          <span style={st.heroAccent}>with FurnishStudio</span>
        </h1>

        <p style={st.heroP}>
          Visualise, plan, and create room layouts in 3D. Drag furniture into your space,
          customise everything, and see how it all comes together — before you buy.
        </p>

        <div style={st.heroBtns}>
          <button style={st.heroStart} onClick={startDesigning}>
            Start designing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
          <button style={st.heroExplore} onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore rooms
          </button>
        </div>
      </section>

      {/* ── Room Selector ────────────────────────── */}
      <section id="rooms" style={st.section}>
        <div style={st.sectionHead}>
          <span style={st.sectionTag}>Plan your room</span>
          <h2 style={st.sectionH2}>Choose a room to start designing</h2>
          <p style={st.sectionP}>Select a room type below and jump straight into the designer. Set dimensions, add furniture, and visualise in 3D.</p>
        </div>

        <div style={st.roomGrid} role="list" aria-label="Room types">
          {ROOMS.map((room) => {
            const isHovered = hoveredRoom === room.id;
            return (
              <button
                key={room.id}
                role="listitem"
                aria-label={`Design a ${room.label}, typical size ${room.size}`}
                style={{
                  ...st.roomCard,
                  borderColor: isHovered ? room.color : 'var(--border)',
                  background: isHovered ? `${room.color}0a` : 'var(--bg-panel)',
                  transform: isHovered ? 'translateY(-4px)' : 'none',
                  boxShadow: isHovered ? `0 12px 32px ${room.color}18` : '0 2px 8px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={startDesigning}
              >
                <div style={{ ...st.roomIcon, color: room.color, background: `${room.color}15` }}>
                  {room.icon}
                </div>
                <div style={st.roomLabel}>{room.label}</div>
                <div style={st.roomSize}>{room.size}</div>
                <div style={{ ...st.roomArrow, color: room.color, opacity: isHovered ? 1 : 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────── */}
      <section id="gallery" style={st.section}>
        <div style={st.sectionHead}>
          <span style={st.sectionTag}>Inspiration</span>
          <h2 style={st.sectionH2}>Furnished room ideas</h2>
          <p style={st.sectionP}>Browse pre-designed rooms for inspiration. Each can be customised to your taste.</p>
        </div>

        <div style={st.galleryGrid}>
          {GALLERY.map((item, i) => {
            const isHovered = hoveredGallery === i;
            return (
              <div
                key={i}
                style={{
                  ...st.galleryCard,
                  transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'none',
                  boxShadow: isHovered ? '0 16px 40px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={() => setHoveredGallery(i)}
                onMouseLeave={() => setHoveredGallery(null)}
              >
                <div style={{ ...st.galleryVisual, background: item.gradient }}>
                  <span style={st.galleryEmoji}>{item.icon}</span>
                  <div style={{ ...st.galleryBadge, background: `${item.accentColor}22`, color: item.accentColor, borderColor: `${item.accentColor}33` }}>
                    {item.style}
                  </div>
                </div>
                <div style={st.galleryBody}>
                  <h3 style={st.galleryTitle}>{item.title}</h3>
                  <div style={st.galleryMeta}>
                    <span style={st.galleryMetaItem}>{item.room}</span>
                    <span style={st.galleryMetaDot}>·</span>
                    <span style={st.galleryMetaItem}>{item.area}</span>
                  </div>
                  <button
                    style={{ ...st.galleryBtn, background: isHovered ? item.accentColor : 'var(--bg-card)', color: isHovered ? '#fff' : 'var(--text-secondary)', borderColor: isHovered ? item.accentColor : 'var(--border)' }}
                    onClick={startDesigning}
                  >
                    Design this room →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ─────────────────────────── */}
      <section style={st.section}>
        <div style={st.sectionHead}>
          <span style={st.sectionTag}>How it works</span>
          <h2 style={st.sectionH2}>Design in three simple steps</h2>
        </div>

        <div style={st.stepsRow}>
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <div style={st.stepCard}>
                <div style={st.stepIcon}>{step.icon}</div>
                <div style={st.stepNum}>Step {step.num}</div>
                <h3 style={st.stepTitle}>{step.title}</h3>
                <p style={st.stepDesc}>{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div style={st.stepConnector}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── Tools / Features ─────────────────────── */}
      <section id="tools" style={st.section}>
        <div style={st.sectionHead}>
          <span style={st.sectionTag}>Planning tools</span>
          <h2 style={st.sectionH2}>Everything you need, in one place</h2>
          <p style={st.sectionP}>A complete toolkit for in-store and at-home furniture visualization.</p>
        </div>

        <div style={st.toolsGrid}>
          {TOOLS.map((t, i) => (
            <div key={i} style={st.toolCard}>
              <div style={st.toolIcon}>{t.icon}</div>
              <h3 style={st.toolTitle}>{t.title}</h3>
              <p style={st.toolDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section style={st.section}>
        <div style={st.ctaBanner}>
          <div style={st.ctaContent}>
            <h2 style={st.ctaH2}>Ready to design your dream room?</h2>
            <p style={st.ctaP}>
              Create your free account and start visualising furniture layouts in 3D — no downloads, no installation.
            </p>
            <button style={st.ctaBtn} onClick={startDesigning}>
              Start designing — it's free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          {/* Decorative grid dots */}
          <div style={st.ctaDots} />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer style={st.footer} role="contentinfo">
        <div style={st.footerInner}>
          <div style={st.footerLeft}>
            <div style={st.brand}>
              <div style={{ ...st.brandIcon, width: 28, height: 28 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
              </div>
              <span style={{ ...st.brandName, fontSize: '0.85rem' }}>FurnishStudio</span>
            </div>
            <span style={st.footerCopy}>Built with React · Three.js · Node.js · MongoDB</span>
          </div>
          <div style={st.footerLinks}>
            <a href="#rooms" style={st.footerLink}>Rooms</a>
            <a href="#gallery" style={st.footerLink}>Gallery</a>
            <a href="#tools" style={st.footerLink}>Tools</a>
            <span style={st.footerLink} onClick={startDesigning}>Sign In</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════ */
const st = {
  /* Page */
  page: {
    minHeight: '100vh',
    background: 'var(--bg-dark)',
    color: 'var(--text-main)',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    fontFamily: 'inherit',
    scrollBehavior: 'smooth',
  },

  /* Background */
  bgNoise: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
    `,
    backgroundSize: '72px 72px',
  },
  bgOrb: {
    position: 'fixed', width: 600, height: 600,
    borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
  },

  /* Nav */
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid transparent',
    transition: 'all 0.3s ease',
  },
  navInner: {
    maxWidth: 1140, margin: '0 auto',
    padding: '12px 36px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 32, height: 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--accent-subtle)', borderRadius: 8,
  },
  brandName: { fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.02em' },
  navRight: { display: 'flex', alignItems: 'center', gap: 28 },
  navLink: {
    color: 'var(--text-secondary)', textDecoration: 'none',
    fontSize: '0.82rem', fontWeight: 500, transition: 'color 0.2s',
    cursor: 'pointer',
  },
  navSignIn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 18px',
    background: 'var(--accent)', color: '#fff', border: 'none',
    borderRadius: 8, fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 2px 12px var(--accent-glow)',
    transition: 'all 0.2s',
  },

  /* Hero */
  hero: {
    position: 'relative', zIndex: 1,
    maxWidth: 780, margin: '0 auto',
    padding: '150px 36px 70px',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '5px 16px', marginBottom: 28,
    background: 'var(--accent-subtle)',
    border: '1px solid rgba(99,102,241,0.18)',
    borderRadius: 20,
    fontSize: '0.76rem', fontWeight: 600, color: 'var(--accent-hover)',
    letterSpacing: '0.02em',
  },
  heroDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)',
  },
  heroH1: {
    fontSize: 'clamp(2rem, 4.8vw, 3.2rem)',
    fontWeight: 800, lineHeight: 1.12,
    letterSpacing: '-0.03em',
    margin: '0 0 20px',
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroP: {
    fontSize: '1.05rem', lineHeight: 1.65,
    color: 'var(--text-secondary)',
    maxWidth: 540, margin: '0 auto 32px',
  },
  heroBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  heroStart: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '13px 30px',
    background: 'var(--accent)', color: '#fff', border: 'none',
    borderRadius: 10, fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 24px var(--accent-glow)',
    transition: 'all 0.2s',
  },
  heroExplore: {
    padding: '13px 30px',
    background: 'var(--bg-card)', color: 'var(--text-main)',
    border: '1px solid var(--border)',
    borderRadius: 10, fontSize: '0.95rem', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
  },

  /* Sections (shared) */
  section: {
    position: 'relative', zIndex: 1,
    maxWidth: 1140, margin: '0 auto',
    padding: '60px 36px',
  },
  sectionHead: { textAlign: 'center', marginBottom: 44 },
  sectionTag: {
    display: 'inline-block',
    padding: '4px 14px', marginBottom: 14,
    background: 'var(--accent-subtle)',
    border: '1px solid rgba(99,102,241,0.12)',
    borderRadius: 14,
    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.8px', color: 'var(--accent-hover)',
  },
  sectionH2: {
    fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
    fontWeight: 800, letterSpacing: '-0.02em',
    margin: '0 0 10px',
  },
  sectionP: {
    fontSize: '0.95rem', color: 'var(--text-secondary)',
    maxWidth: 500, margin: '0 auto', lineHeight: 1.55,
  },

  /* Room grid */
  roomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 14,
  },
  roomCard: {
    position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 10, padding: '28px 16px 22px',
    border: '1px solid var(--border)',
    borderRadius: 14,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.25s ease',
    textAlign: 'center',
  },
  roomIcon: {
    width: 52, height: 52,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 14,
  },
  roomLabel: { fontSize: '0.88rem', fontWeight: 650, color: 'var(--text-main)' },
  roomSize: { fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 },
  roomArrow: {
    position: 'absolute', top: 12, right: 12,
    transition: 'opacity 0.2s',
  },

  /* Gallery */
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 18,
  },
  galleryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  galleryVisual: {
    position: 'relative',
    height: 170,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  galleryEmoji: { fontSize: '3.5rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' },
  galleryBadge: {
    position: 'absolute', top: 12, right: 12,
    padding: '3px 10px',
    border: '1px solid',
    borderRadius: 8,
    fontSize: '0.65rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  galleryBody: { padding: '18px 20px 20px' },
  galleryTitle: { fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px' },
  galleryMeta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 },
  galleryMetaItem: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 },
  galleryMetaDot: { color: 'var(--text-muted)', fontSize: '0.6rem' },
  galleryBtn: {
    width: '100%',
    padding: '9px 0',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.8rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.2s',
  },

  /* Steps */
  stepsRow: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    gap: 12, flexWrap: 'wrap',
  },
  stepCard: {
    flex: '1 1 240px', maxWidth: 280,
    padding: '32px 24px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    textAlign: 'center',
  },
  stepIcon: {
    width: 52, height: 52,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px',
    background: 'var(--accent-subtle)',
    borderRadius: 14,
    color: 'var(--accent)',
  },
  stepNum: {
    fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-hover)',
    textTransform: 'uppercase', letterSpacing: '1.2px',
    marginBottom: 6,
  },
  stepTitle: { fontSize: '1rem', fontWeight: 700, margin: '0 0 8px' },
  stepDesc: { fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 },
  stepConnector: {
    display: 'flex', alignItems: 'center', alignSelf: 'center',
    padding: '0 4px', opacity: 0.4,
  },

  /* Tools */
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 14,
  },
  toolCard: {
    padding: '26px 24px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    transition: 'border-color 0.2s',
  },
  toolIcon: {
    width: 42, height: 42,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--accent-subtle)',
    borderRadius: 10,
    color: 'var(--accent)',
    marginBottom: 14,
  },
  toolTitle: { fontSize: '0.92rem', fontWeight: 700, margin: '0 0 6px' },
  toolDesc: { fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 },

  /* CTA */
  ctaBanner: {
    position: 'relative',
    padding: '60px 48px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 50%, rgba(236,72,153,0.06) 100%)',
    border: '1px solid rgba(99,102,241,0.18)',
    borderRadius: 24,
    overflow: 'hidden',
    textAlign: 'center',
  },
  ctaContent: { position: 'relative', zIndex: 1 },
  ctaDots: {
    position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3,
    backgroundImage: 'radial-gradient(circle, var(--accent) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    pointerEvents: 'none',
  },
  ctaH2: {
    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
    fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px',
  },
  ctaP: {
    fontSize: '0.95rem', color: 'var(--text-secondary)',
    maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.55,
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '14px 34px',
    background: 'var(--accent)', color: '#fff', border: 'none',
    borderRadius: 10, fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 24px var(--accent-glow)',
    transition: 'all 0.2s',
  },

  /* Footer */
  footer: {
    position: 'relative', zIndex: 1,
    borderTop: '1px solid var(--border)',
    marginTop: 20,
  },
  footerInner: {
    maxWidth: 1140, margin: '0 auto',
    padding: '24px 36px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 16,
  },
  footerLeft: { display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  footerCopy: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: {
    color: 'var(--text-muted)', textDecoration: 'none',
    fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
    transition: 'color 0.2s',
  },
};
