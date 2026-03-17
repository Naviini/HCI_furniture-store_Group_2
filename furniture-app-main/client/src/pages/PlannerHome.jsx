import React, { useRef, useState } from 'react';
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
    title: 'Create 3D design',
    desc: 'Start from templates or blank canvas and design your room',
    cta: 'TRY',
    media: [livingPreview, bedroomCard],
    onAction: 'create-flow',
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

const roomTypeOptions = [
  { id: 'floor-plan', label: 'Floor Plan', image: floorPlanRender, badge: '1 design', full: true },
  { id: 'bedroom', label: 'Bedroom', image: bedroomCard, notify: true },
  { id: 'living-room', label: 'Living Room', image: livingPreview, notify: true },
  { id: 'kitchen', label: 'Kitchen', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=80', notify: true },
  { id: 'patio', label: 'Yard or Patio', image: 'https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=1400&q=80', notify: true },
  { id: 'kids', label: 'Baby & Kids', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80', notify: true },
  { id: 'bathroom', label: 'Bathroom', image: 'https://images.unsplash.com/photo-1564540583246-934409427776?auto=format&fit=crop&w=1400&q=80', notify: true },
  { id: 'closet', label: 'Closet', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=80', notify: true },
  { id: 'store', label: 'Store', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1400&q=80', notify: true },
  { id: 'office', label: 'Home Office', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80', notify: true },
  { id: 'cinema', label: 'Home Cinema', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1400&q=80', notify: true },
];

const roomShapeOptions = [
  { id: 'rectangle', label: 'Rectangular' },
  { id: 'l-shape', label: 'L-shape' },
  { id: 't-shape', label: 'T-shape' },
  { id: 'cut', label: 'Cut' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'z-shape', label: 'Z-shape' },
  { id: 'custom', label: 'Draw from Scratch' },
];

const starterTemplates = [
  {
    id: 'classic-bedroom',
    room: 'Bedroom',
    title: 'Classic Bedroom',
    image: 'https://images.unsplash.com/photo-1616594039964-3b8f09c6e6f1?auto=format&fit=crop&w=1200&q=80',
    size: '12 x 10 m',
  },
  {
    id: 'modern-lounge',
    room: 'Living Room',
    title: 'Modern Lounge',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    size: '16 x 14 m',
  },
  {
    id: 'cozy-bedroom',
    room: 'Bedroom',
    title: 'Cozy Bedroom',
    image: bedroomCard,
    size: '14 x 12 m',
  },
  {
    id: 'minimal-office',
    room: 'Home Office',
    title: 'Minimal Office',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    size: '11 x 9 m',
  },
];

export default function PlannerHome() {
  const navigate = useNavigate();
  const [failedQuickPhotos, setFailedQuickPhotos] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [showBlankModal, setShowBlankModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [templateCategory, setTemplateCategory] = useState('All');
  const [uploadMessage, setUploadMessage] = useState('');
  const floorPlanInputRef = useRef(null);

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    navigate('/login');
  };

  const handleQuickCardClick = (card) => {
    if (card.kind === 'add') {
      setUploadMessage('');
      setShowAddModal(true);
      return;
    }

    const mappedRoom =
      card.title.toLowerCase().includes('bedroom')
        ? roomTypeOptions.find((room) => room.id === 'bedroom')
        : card.title.toLowerCase().includes('living')
          ? roomTypeOptions.find((room) => room.id === 'living-room')
          : roomTypeOptions.find((room) => room.id === 'floor-plan');

    setSelectedRoomType(mappedRoom || roomTypeOptions[0]);
    setShowGetStartedModal(true);
  };

  const handleFeatureAction = (action) => {
    if (action === 'create-flow') {
      setSelectedRoomType(roomTypeOptions.find((room) => room.id === 'living-room') || roomTypeOptions[0]);
      setShowGetStartedModal(true);
      return;
    }

    navigate(action);
  };

  const handleCreateFloorPlan = () => {
    setShowAddModal(false);
    setShowRoomTypeModal(true);
  };

  const handleRoomTypeSelect = (roomType) => {
    setShowRoomTypeModal(false);
    setSelectedRoomType(roomType);
    setShowGetStartedModal(true);
  };

  const startFromBlank = () => {
    setShowGetStartedModal(false);
    setShowBlankModal(true);
  };

  const startFromTemplate = () => {
    setShowGetStartedModal(false);
    setShowTemplateModal(true);
  };

  const proceedWithBlank = (shape) => {
    localStorage.setItem('nd-selected-room-type', selectedRoomType?.id || 'floor-plan');
    localStorage.setItem('nd-selected-room-shape', shape.id);
    localStorage.setItem('nd-start-mode', 'blank');
    setShowBlankModal(false);
    navigate('/dashboard');
  };

  const proceedWithTemplate = (template) => {
    localStorage.setItem('nd-selected-room-type', selectedRoomType?.id || 'floor-plan');
    localStorage.setItem('nd-start-mode', 'template');
    localStorage.setItem('nd-selected-template', JSON.stringify(template));
    setShowTemplateModal(false);
    navigate('/dashboard');
  };

  const handleUploadFloorPlan = () => {
    floorPlanInputRef.current?.click();
  };

  const onFloorPlanSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadInfo = {
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      uploadedAt: Date.now(),
    };

    localStorage.setItem('nd-uploaded-floor-plan', JSON.stringify(uploadInfo));
    setUploadMessage(`Uploaded: ${file.name}`);
    event.target.value = '';
  };

  const shapeIcon = (shapeId) => {
    switch (shapeId) {
      case 'rectangle':
        return (
          <svg viewBox="0 0 100 100" className="ph-shape-svg" aria-hidden="true">
            <rect x="20" y="20" width="60" height="60" rx="2" />
            <circle cx="20" cy="20" r="4" /><circle cx="80" cy="20" r="4" />
            <circle cx="20" cy="80" r="4" /><circle cx="80" cy="80" r="4" />
          </svg>
        );
      case 'l-shape':
        return (
          <svg viewBox="0 0 100 100" className="ph-shape-svg" aria-hidden="true">
            <path d="M20 20H80V80H48V62H20Z" />
            <circle cx="20" cy="20" r="4" /><circle cx="80" cy="20" r="4" />
            <circle cx="80" cy="80" r="4" /><circle cx="48" cy="80" r="4" />
            <circle cx="48" cy="62" r="4" /><circle cx="20" cy="62" r="4" />
          </svg>
        );
      case 't-shape':
        return (
          <svg viewBox="0 0 100 100" className="ph-shape-svg" aria-hidden="true">
            <path d="M20 30H36V20H64V30H80V80H20Z" />
            <circle cx="20" cy="30" r="4" /><circle cx="36" cy="30" r="4" />
            <circle cx="36" cy="20" r="4" /><circle cx="64" cy="20" r="4" />
            <circle cx="64" cy="30" r="4" /><circle cx="80" cy="30" r="4" />
            <circle cx="80" cy="80" r="4" /><circle cx="20" cy="80" r="4" />
          </svg>
        );
      case 'cut':
        return (
          <svg viewBox="0 0 100 100" className="ph-shape-svg" aria-hidden="true">
            <path d="M20 20H58L80 42V80H20Z" />
            <circle cx="20" cy="20" r="4" /><circle cx="58" cy="20" r="4" />
            <circle cx="80" cy="42" r="4" /><circle cx="80" cy="80" r="4" />
            <circle cx="20" cy="80" r="4" />
          </svg>
        );
      case 'rounded':
        return (
          <svg viewBox="0 0 100 100" className="ph-shape-svg" aria-hidden="true">
            <path d="M20 80V44A30 30 0 0 1 80 44V80Z" />
            <circle cx="20" cy="80" r="4" /><circle cx="80" cy="80" r="4" /><circle cx="50" cy="22" r="4" />
          </svg>
        );
      case 'z-shape':
        return (
          <svg viewBox="0 0 100 100" className="ph-shape-svg" aria-hidden="true">
            <path d="M20 20H54V36H80V80H46V64H20Z" />
            <circle cx="20" cy="20" r="4" /><circle cx="54" cy="20" r="4" />
            <circle cx="54" cy="36" r="4" /><circle cx="80" cy="36" r="4" />
            <circle cx="80" cy="80" r="4" /><circle cx="46" cy="80" r="4" />
            <circle cx="46" cy="64" r="4" /><circle cx="20" cy="64" r="4" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="ph-shape-svg" aria-hidden="true">
            <path d="M20 20V80H44" />
            <path d="M56 44L76 64" />
            <path d="M76 44L56 64" />
            <circle cx="20" cy="20" r="4" /><circle cx="20" cy="80" r="4" /><circle cx="44" cy="80" r="4" />
          </svg>
        );
    }
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
            <button className="ph-quick-card" type="button" key={card.title} onClick={() => handleQuickCardClick(card)}>
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
                  <button type="button" className="ph-feature-cta" onClick={() => handleFeatureAction(card.onAction)}>{card.cta}</button>
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

        <input
          ref={floorPlanInputRef}
          type="file"
          accept="image/*,.pdf"
          className="ph-hidden-upload"
          onChange={onFloorPlanSelected}
        />

        {showBlankModal && (
          <section className="ph-blank-screen" role="dialog" aria-modal="true" aria-label="Choose room shape">
            <header className="ph-blank-head">
              <button
                type="button"
                className="ph-blank-back"
                onClick={() => {
                  setShowBlankModal(false);
                  setShowGetStartedModal(true);
                }}
                aria-label="Back"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <h3>Choose room shape</h3>
            </header>

            <div className="ph-blank-grid">
              {roomShapeOptions.map((shape) => (
                <button key={shape.id} type="button" className="ph-blank-card" onClick={() => proceedWithBlank(shape)}>
                  <span className="ph-blank-glyph">{shapeIcon(shape.id)}</span>
                  <span className="ph-blank-label">{shape.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {showAddModal && (
        <div className="ph-sheet-overlay" role="dialog" aria-modal="true" aria-label="Add room or floor plan" onClick={() => setShowAddModal(false)}>
          <div className="ph-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Add Room or Floor Plan</h3>
            <button type="button" className="ph-sheet-option" onClick={handleCreateFloorPlan}>Create...</button>
            <button type="button" className="ph-sheet-option" onClick={handleUploadFloorPlan}>Upload Floor Plan</button>
            {uploadMessage && <p className="ph-sheet-status">{uploadMessage}</p>}
            <button type="button" className="ph-sheet-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showRoomTypeModal && (
        <div className="ph-room-overlay" role="dialog" aria-modal="true" aria-label="Select room type" onClick={() => setShowRoomTypeModal(false)}>
          <div className="ph-room-modal" onClick={(e) => e.stopPropagation()}>
            <header className="ph-room-head">
              <h3>Select room type</h3>
              <button
                type="button"
                className="ph-room-close"
                aria-label="Close room type selector"
                onClick={() => setShowRoomTypeModal(false)}
              >
                x
              </button>
            </header>

            <div className="ph-room-grid">
              {roomTypeOptions.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  className={`ph-room-card${room.full ? ' ph-room-card--full' : ''}`}
                  onClick={() => handleRoomTypeSelect(room)}
                >
                  <img src={room.image} alt={room.label} loading="lazy" decoding="async" />
                  {room.notify && <span className="ph-room-dot" aria-hidden="true" />}
                  {room.badge && <span className="ph-room-badge">{room.badge}</span>}
                  <span className="ph-room-label">{room.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showGetStartedModal && (
        <div className="ph-center-overlay" role="dialog" aria-modal="true" aria-label="Get started" onClick={() => setShowGetStartedModal(false)}>
          <div className="ph-center-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Get Started</h3>
            <button type="button" className="ph-center-option" onClick={startFromBlank}>Start from Blank</button>
            <button type="button" className="ph-center-option" onClick={startFromTemplate}>Start from Template</button>
            <button type="button" className="ph-center-cancel" onClick={() => setShowGetStartedModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="ph-center-overlay" role="dialog" aria-modal="true" aria-label="Start from template" onClick={() => setShowTemplateModal(false)}>
          <div className="ph-template-modal" onClick={(e) => e.stopPropagation()}>
            <header className="ph-template-head">
              <h3>{selectedRoomType?.label || 'Templates'}</h3>
              <button type="button" className="ph-template-close" onClick={() => setShowTemplateModal(false)}>Done</button>
            </header>

            <button type="button" className="ph-template-blank" onClick={() => { setShowTemplateModal(false); setShowBlankModal(true); }}>
              + Start from Blank
            </button>

            <div className="ph-template-tabs">
              {['All', 'Bedroom', 'Living Room', 'Home Office'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`ph-template-tab${templateCategory === tab ? ' is-active' : ''}`}
                  onClick={() => setTemplateCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="ph-template-grid">
              {starterTemplates
                .filter((tpl) => templateCategory === 'All' || tpl.room === templateCategory)
                .map((template) => (
                  <article key={template.id} className="ph-template-card">
                    <img src={template.image} alt={template.title} loading="lazy" decoding="async" />
                    <div className="ph-template-body">
                      <strong>{template.title}</strong>
                      <span>{template.size}</span>
                    </div>
                    <button type="button" onClick={() => proceedWithTemplate(template)}>Use Template</button>
                  </article>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
