import React, { useState } from 'react';
import './TemplatesPage.css';
import bgImage from '../assets/background images/modern_living_rooms_with_the_right_furniture.webp';

/* ─────────────────────────────────────────────
   PRE-DESIGNED ROOM TEMPLATES
   Each template defines: roomConfig + items + windows
───────────────────────────────────────────── */
const TEMPLATES = [
    /* ── LIVING ROOM ── */
    {
        id: 'living-cozy',
        category: 'Living Room',
        name: 'Cosy Living Room',
        desc: 'A warm, inviting space with a sofa, coffee table, and ambient lamp.',
        tag: 'Popular',
        tagColor: '#6366f1',
        emoji: '🛋️',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        previewItems: ['🛋️', '☕', '💡', '💺'],
        roomConfig: {
            shape: 'rectangle',
            width: 14,
            depth: 12,
            wallColor: '#f5f0e8',
            floorColor: '#8b6914',
            floorType: 'plank_flooring',
            lightingMode: 'Day',
        },
        items: [
            { id: 1001, type: 'Sofa', position: [0, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#d1fae5' },
            { id: 1002, type: 'Coffee Table', position: [0, 0, -1], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#836009' },
            { id: 1003, type: 'Sofa', position: [-3, 0, -1], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#d1fae5' },
            { id: 1004, type: 'Sofa', position: [3, 0, -1], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#d1fae5' },
            { id: 1005, type: 'Lamp', position: [-4.5, 0.5, -4], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#fbbf24' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 2.5, height: 1.8, sillHeight: 0.9 },
        ],
    },
    {
        id: 'living-modern',
        category: 'Living Room',
        name: 'Modern Lounge',
        desc: 'Minimalist open-plan living with clean lines and neutral tones.',
        emoji: '🏠',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
        previewItems: ['🛋️', '☕', '🗄️', '💡'],
        roomConfig: {
            shape: 'l-shape',
            width: 16,
            depth: 14,
            wallColor: '#f8f8f8',
            floorColor: '#c0bdb7',
            floorType: 'grey_cartago',
            lightingMode: 'Golden',
        },
        items: [
            { id: 2001, type: 'Sofa', position: [-2, 0, -3], rotation: [0, 0, 0], scale: [1.2, 1, 1.2], color: '#1e293b' },
            { id: 2002, type: 'Coffee Table', position: [-2, 0, -0.8], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#292524' },
            { id: 2003, type: 'Lamp', position: [3, 0.5, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 2004, type: 'Drawer', position: [-5, 0, -4], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#292524' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.35, width: 3, height: 2.2, sillHeight: 0.8 },
            { id: 'w2', wall: 'left', position: 0.5, width: 2, height: 1.8, sillHeight: 1 },
        ],
    },

    /* ── BEDROOM ── */
    {
        id: 'bedroom-classic',
        category: 'Bedroom',
        name: 'Classic Bedroom',
        desc: 'A timeless bedroom layout with bed, drawer, and reading lamp.',
        tag: 'Starter',
        tagColor: '#059669',
        emoji: '🛏️',
        gradient: 'linear-gradient(135deg, #1a0a00 0%, #431407 40%, #7c2d12 100%)',
        previewItems: ['🛏️', '🗄️', '💡', '💺'],
        roomConfig: {
            shape: 'rectangle',
            width: 12,
            depth: 10,
            wallColor: '#fef3c7',
            floorColor: '#92400e',
            floorType: 'plank_flooring',
            lightingMode: 'Night',
        },
        items: [
            { id: 3001, type: 'Bed', position: [0, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f5f5f4' },
            { id: 3002, type: 'Drawer', position: [-4, 0, -3.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#a16207' },
            { id: 3003, type: 'Drawer', position: [4, 0, -3.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#a16207' },
            { id: 3004, type: 'Lamp', position: [-4, 0.5, -3], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fbbf24' },
            { id: 3005, type: 'Lamp', position: [4, 0.5, -3], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fbbf24' },
            { id: 3006, type: 'Chair', position: [3, 0, 1.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#e7e5e4' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 1.8, height: 1.4, sillHeight: 1.0 },
        ],
    },
    {
        id: 'bedroom-scandinavian',
        category: 'Bedroom',
        name: 'Scandinavian Bedroom',
        desc: 'Light, airy Scandi style — white tones and natural wood accents.',
        emoji: '🌿',
        gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 100%)',
        previewItems: ['🛏️', '🗄️', '💡'],
        roomConfig: {
            shape: 'square',
            width: 11,
            depth: 11,
            wallColor: '#ffffff',
            floorColor: '#d6b899',
            floorType: 'plank_flooring',
            lightingMode: 'Day',
        },
        items: [
            { id: 4001, type: 'Bed', position: [0, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 4002, type: 'Drawer', position: [-3.5, 0, -4.5], rotation: [0, Math.PI / 2, 0], scale: [0.9, 0.9, 0.9], color: '#fef9c3' },
            { id: 4004, type: 'Lamp', position: [-3.5, 0.5, -2.5], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#e2e8f0' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.4, width: 2.2, height: 1.6, sillHeight: 0.9 },
            { id: 'w2', wall: 'right', position: 0.5, width: 1.5, height: 1.4, sillHeight: 1.0 },
        ],
    },

    /* ── DINING ROOM ── */
    {
        id: 'dining-formal',
        category: 'Dining',
        name: 'Formal Dining Room',
        desc: 'An elegant dining setup with a central table and matching chairs.',
        tag: 'Classic',
        tagColor: '#d97706',
        emoji: '🍽️',
        gradient: 'linear-gradient(135deg, #1c1400 0%, #451a03 40%, #78350f 100%)',
        previewItems: ['🔲', '💺', '💺', '💡'],
        roomConfig: {
            shape: 'rectangle',
            width: 13,
            depth: 11,
            wallColor: '#fdf4ff',
            floorColor: '#422006',
            floorType: 'plank_flooring',
            lightingMode: 'Golden',
        },
        items: [
            { id: 5001, type: 'Table', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.5, 1, 1.5], color: '#292524' },
            { id: 5002, type: 'Chair', position: [-2.2, 0, 0], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5003, type: 'Chair', position: [2.2, 0, 0], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5004, type: 'Chair', position: [0, 0, 1.8], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5005, type: 'Chair', position: [0, 0, -1.8], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5007, type: 'Lamp', position: [0, 0.7, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fef08a' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.3, width: 1.6, height: 1.4, sillHeight: 1.0 },
            { id: 'w2', wall: 'back', position: 0.7, width: 1.6, height: 1.4, sillHeight: 1.0 },
        ],
    },
    {
        id: 'dining-casual',
        category: 'Dining',
        name: 'Casual Kitchen Diner',
        desc: 'Relaxed open-plan kitchen feel with a small round table.',
        emoji: '☕',
        gradient: 'linear-gradient(135deg, #0c0a00 0%, #1c1700 40%, #3d2a00 100%)',
        previewItems: ['🔲', '💺', '☕'],
        roomConfig: {
            shape: 'rectangle',
            width: 10,
            depth: 8,
            wallColor: '#ecfdf5',
            floorColor: '#b3b3b3',
            floorType: 'granite_tile',
            lightingMode: 'Day',
        },
        items: [
            { id: 6001, type: 'Coffee Table', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.2, 1, 1.2], color: '#f5f5f4' },
            { id: 6002, type: 'Chair', position: [-1.8, 0, 0], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 6003, type: 'Chair', position: [1.8, 0, 0], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 6004, type: 'Chair', position: [0, 0, 1.6], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#d6d3d1' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 2, height: 1.5, sillHeight: 0.8 },
        ],
    },

    /* ── WORKSPACE ── */
    {
        id: 'workspace-home',
        category: 'Workspace',
        name: 'Home Office',
        desc: 'A productive home office with desk, chair, and cabinet storage.',
        tag: 'New',
        tagColor: '#0ea5e9',
        emoji: '💻',
        gradient: 'linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e3a5f 100%)',
        previewItems: ['🔲', '💺', '🗄️', '💡'],
        roomConfig: {
            shape: 'square',
            width: 9,
            depth: 9,
            wallColor: '#f1f5f9',
            floorColor: '#c8b89a',
            floorType: 'plank_flooring',
            lightingMode: 'Day',
        },
        items: [
            { id: 7001, type: 'Table', position: [0, 0, -2.5], rotation: [0, 0, 0], scale: [1.3, 1, 0.8], color: '#f5f5f0' },
            { id: 7002, type: 'Chair', position: [0, 0, -1], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#1e293b' },
            { id: 7005, type: 'Lamp', position: [1.5, 0.5, -2.5], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#0ea5e9' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 1.8, height: 1.6, sillHeight: 0.9 },
        ],
    },

    /* ── STUDIO APARTMENT ── */
    {
        id: 'studio-compact',
        category: 'Studio',
        name: 'Compact Studio',
        desc: 'Multi-functional studio layout — living, sleeping and dining all in one.',
        tag: 'Smart',
        tagColor: '#7c3aed',
        emoji: '🏡',
        gradient: 'linear-gradient(135deg, #0f0820 0%, #1e1040 40%, #3b0764 100%)',
        previewItems: ['🛏️', '🛋️', '🔲', '☕'],
        roomConfig: {
            shape: 'rectangle',
            width: 12,
            depth: 8,
            wallColor: '#f8fafc',
            floorColor: '#b0967a',
            floorType: 'plank_flooring',
            lightingMode: 'Golden',
        },
        items: [
            { id: 8001, type: 'Bed', position: [-3.5, 0, -2.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 8002, type: 'Sofa', position: [2, 0, -1], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#475569' },
            { id: 8003, type: 'Coffee Table', position: [2, 0, 0.8], rotation: [0, 0, 0], scale: [0.8, 1, 0.8], color: '#292524' },
            { id: 8004, type: 'Table', position: [-3, 0, 2], rotation: [0, 0, 0], scale: [0.7, 1, 0.7], color: '#f5f5f4' },
            { id: 8005, type: 'Chair', position: [-3, 0, 3.5], rotation: [0, Math.PI, 0], scale: [0.9, 0.9, 0.9], color: '#e2e8f0' },
            { id: 8006, type: 'Lamp', position: [-5.5, 0.5, -3], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#fbbf24' },
            { id: 8007, type: 'Drawer', position: [-5.5, 0, -1], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#fef9c3' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.25, width: 1.5, height: 1.4, sillHeight: 0.9 },
            { id: 'w2', wall: 'back', position: 0.75, width: 1.5, height: 1.4, sillHeight: 0.9 },
        ],
    },
];

const CATEGORIES = ['All', 'Living Room', 'Bedroom', 'Dining', 'Workspace', 'Studio'];

const CAT_META = {
    'All': { icon: '🏠', color: '#6366f1' },
    'Living Room': { icon: '🛋️', color: '#8b5cf6' },
    'Bedroom': { icon: '🛏️', color: '#ec4899' },
    'Dining': { icon: '🍽️', color: '#f59e0b' },
    'Workspace': { icon: '💻', color: '#0ea5e9' },
    'Studio': { icon: '🏡', color: '#7c3aed' },
};

/* ══════════════════════════════════════════════
   TEMPLATES PAGE COMPONENT
══════════════════════════════════════════════ */
export default function TemplatesPage({ onSelectTemplate, onSkip, onClose }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const filtered = activeCategory === 'All'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === activeCategory);

    const handleSelect = (template) => {
        setSelectedId(template.id);
        // Short delay for visual feedback, then invoke callback
        setTimeout(() => onSelectTemplate(template), 320);
    };

    return (
        <div className="tp-backdrop" role="dialog" aria-modal="true" aria-label="Choose a room template"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="tp-modal">

                {/* ── Header ── */}
                <header className="tp-header">
                    <div className="tp-header-left">
                        <div className="tp-header-icon">🏠</div>
                        <div>
                            <h2 className="tp-title">Start with a Template</h2>
                            <p className="tp-subtitle">Choose a pre-designed room or start with a blank canvas</p>
                        </div>
                    </div>
                    <button className="tp-close-btn" onClick={onClose} aria-label="Close templates">✕</button>
                </header>

                {/* ── Category tabs ── */}
                <nav className="tp-categories" aria-label="Room categories">
                    {CATEGORIES.map(cat => {
                        const meta = CAT_META[cat];
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                className={`tp-cat-btn ${isActive ? 'tp-cat-btn--active' : ''}`}
                                style={isActive ? { '--cat-color': meta.color, borderColor: meta.color, color: meta.color, background: `${meta.color}18` } : {}}
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={isActive}
                            >
                                <span className="tp-cat-icon">{meta.icon}</span>
                                {cat}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Template grid ── */}
                <div className="tp-grid" role="list">
                    {filtered.map(template => {
                        const isHovered = hoveredId === template.id;
                        const isSelected = selectedId === template.id;
                        return (
                            <button
                                key={template.id}
                                className={`tp-card ${isSelected ? 'tp-card--selected' : ''}`}
                                role="listitem"
                                aria-label={`Load ${template.name} template`}
                                onMouseEnter={() => setHoveredId(template.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => handleSelect(template)}
                            >
                                {/* Preview area */}
                                <div className="tp-card-preview" style={{ background: template.gradient }}>
                                    <div className="tp-card-emoji">{template.emoji}</div>

                                    {/* Mini furniture icons */}
                                    <div className="tp-card-mini-items">
                                        {template.previewItems.map((icon, i) => (
                                            <span key={i} className="tp-mini-item"
                                                style={{ animationDelay: `${i * 0.08}s` }}>
                                                {icon}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Tag badge */}
                                    {template.tag && (
                                        <div className="tp-card-tag" style={{ background: template.tagColor }}>
                                            {template.tag}
                                        </div>
                                    )}

                                    {/* Selected check */}
                                    {isSelected && <div className="tp-card-check">✓</div>}
                                </div>

                                {/* Card body */}
                                <div className="tp-card-body">
                                    <div className="tp-card-header-row">
                                        <span className="tp-card-category">{template.category}</span>
                                        <span className="tp-card-shape">
                                            {template.roomConfig.shape.replace(/-/g, ' ')}
                                        </span>
                                    </div>
                                    <h3 className="tp-card-name">{template.name}</h3>
                                    <p className="tp-card-desc">{template.desc}</p>

                                    {/* Detail grid */}
                                    <div className="tp-card-details">
                                        <div className="tp-detail">
                                            <span>📐</span>
                                            <span>{template.roomConfig.width}×{template.roomConfig.depth} m</span>
                                        </div>
                                        <div className="tp-detail">
                                            <span>🪑</span>
                                            <span>{template.items.length} items</span>
                                        </div>
                                        <div className="tp-detail">
                                            <span>🪟</span>
                                            <span>{template.windows.length} window{template.windows.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="tp-detail">
                                            <span>
                                                {template.roomConfig.lightingMode === 'Day' ? '☀️' :
                                                    template.roomConfig.lightingMode === 'Golden' ? '🌅' : '🌙'}
                                            </span>
                                            <span>{template.roomConfig.lightingMode}</span>
                                        </div>
                                    </div>

                                    <div className="tp-card-cta">
                                        {isSelected ? '⏳ Loading…' : 'Use Template →'}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── Footer ── */}
                <footer className="tp-footer">
                    <button className="tp-skip-btn" onClick={onSkip}>
                        Start with blank canvas instead
                    </button>
                </footer>
            </div>
        </div>
    );
}

export { TEMPLATES };
