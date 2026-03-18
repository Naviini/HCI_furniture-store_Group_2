import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import livingPreview from '../assets/background images/modern_living_rooms_with_the_right_furniture.webp';
import './TemplateBrowserPage.css';

const starterTemplates = [
  {
    id: 'classic-bedroom',
    room: 'Bedroom',
    title: 'Classic Bedroom',
    image: '/template-images/classic-bedroom.jpg',
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
    image: '/template-images/cozy-bedroom.jpg',
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

const roomShapeOptions = [
  { id: 'rectangle', label: 'Rectangular' },
  { id: 'l-shape', label: 'L-shape' },
  { id: 't-shape', label: 'T-shape' },
  { id: 'cut', label: 'Cut' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'z-shape', label: 'Z-shape' },
  { id: 'custom', label: 'Draw from Scratch' },
];

function shapeIcon(shapeId) {
  switch (shapeId) {
    case 'rectangle':
      return <rect x="20" y="20" width="60" height="60" rx="2" />;
    case 'l-shape':
      return <path d="M20 20H80V80H48V62H20Z" />;
    case 't-shape':
      return <path d="M20 30H36V20H64V30H80V80H20Z" />;
    case 'cut':
      return <path d="M20 20H58L80 42V80H20Z" />;
    case 'rounded':
      return <path d="M20 80V44A30 30 0 0 1 80 44V80Z" />;
    case 'z-shape':
      return <path d="M20 20H54V36H80V80H46V64H20Z" />;
    default:
      return (
        <>
          <path d="M20 20V80H44" />
          <path d="M56 44L76 64" />
          <path d="M76 44L56 64" />
        </>
      );
  }
}

export default function TemplateBrowserPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const roomTypeId = state?.roomTypeId || 'floor-plan';
  const roomTypeLabel = state?.roomTypeLabel || 'Templates';
  const normalizeRoomTypeToTab = (value) => {
    const key = String(value || '').toLowerCase().trim();
    if (key === 'bedroom') return 'Bedroom';
    if (key === 'living-room' || key === 'living room') return 'Living Room';
    if (key === 'office' || key === 'home-office' || key === 'home office') return 'Home Office';
    return 'All';
  };

  const [templateCategory, setTemplateCategory] = useState(
    normalizeRoomTypeToTab(roomTypeId) !== 'All'
      ? normalizeRoomTypeToTab(roomTypeId)
      : normalizeRoomTypeToTab(roomTypeLabel)
  );
  const [showShapePicker, setShowShapePicker] = useState(false);

  const filteredTemplates = useMemo(() => {
    return starterTemplates.filter((tpl) => templateCategory === 'All' || tpl.room === templateCategory);
  }, [templateCategory]);

  const proceedWithTemplate = (template) => {
    localStorage.setItem('nd-selected-room-type', roomTypeId);
    localStorage.setItem('nd-start-mode', 'template');
    localStorage.setItem('nd-selected-template', JSON.stringify(template));
    navigate('/dashboard');
  };

  const proceedWithBlank = (shape) => {
    localStorage.setItem('nd-selected-room-type', roomTypeId);
    localStorage.setItem('nd-selected-room-shape', shape.id);
    localStorage.setItem('nd-start-mode', 'blank');
    navigate('/dashboard');
  };

  return (
    <div className="tpage-root">
      <header className="tpage-head">
        <button type="button" className="tpage-back" onClick={() => navigate('/home')}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          Back to Home
        </button>
        <h1>{roomTypeLabel}</h1>
        <button type="button" className="tpage-done" onClick={() => navigate('/home')}>Done</button>
      </header>

      <section className="tpage-panel">
        {!showShapePicker ? (
          <>
            <button type="button" className="tpage-blank" onClick={() => setShowShapePicker(true)}>
              + Start from Blank
            </button>

            <div className="tpage-tabs">
              {['All', 'Bedroom', 'Living Room', 'Home Office'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tpage-tab${templateCategory === tab ? ' is-active' : ''}`}
                  onClick={() => setTemplateCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tpage-grid">
              {filteredTemplates.map((template) => (
                <article key={template.id} className="tpage-card">
                  <img src={template.image} alt={template.title} loading="lazy" decoding="async" />
                  <div className="tpage-card-body">
                    <strong>{template.title}</strong>
                    <span>{template.size}</span>
                  </div>
                  <button type="button" onClick={() => proceedWithTemplate(template)}>Use Template</button>
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="tpage-shape-head">
              <button type="button" className="tpage-back-inline" onClick={() => setShowShapePicker(false)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <h2>Choose room shape</h2>
            </div>
            <div className="tpage-shape-grid">
              {roomShapeOptions.map((shape) => (
                <button key={shape.id} type="button" className="tpage-shape-card" onClick={() => proceedWithBlank(shape)}>
                  <span className="tpage-shape-glyph">
                    <svg viewBox="0 0 100 100" aria-hidden="true">{shapeIcon(shape.id)}</svg>
                  </span>
                  <span>{shape.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <img className="tpage-bg" src={livingPreview} alt="" aria-hidden="true" />
    </div>
  );
}
