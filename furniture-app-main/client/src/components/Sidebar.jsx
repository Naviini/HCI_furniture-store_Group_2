import React, { useState, useCallback, useMemo } from 'react';
import ndLogo from '../assets/LOGO/logo.jpeg';

const TABS = {
  LIBRARY: 'library',
  PROPERTIES: 'properties',
  ROOM: 'room',
  GLOBAL: 'global',
};

const FURNITURE_ITEMS = [
  { name: 'Coffee Table', icon: '☕',  desc: 'Round coffee table (3D)', model: true, category: '3D' },
  { name: 'Chair',        icon: '💺',  desc: 'Monobloc chair (3D)',    model: true, category: '3D' },
  { name: 'Drawer',       icon: '🗄️', desc: 'Vintage drawer (3D)',   model: true, category: '3D' },
  { name: 'Table',        icon: '🔲',  desc: 'Dining / Work table',   category: 'Basic' },
  { name: 'Bed',          icon: '🛏️', desc: 'King / Queen bed',      category: 'Basic' },
  { name: 'Lamp',         icon: '💡',  desc: 'Floor lamp',            category: 'Basic' },
  { name: 'Sofa',         icon: '🛋️', desc: 'Lounge sofa',           category: 'Basic' },
  { name: 'Cabinet',      icon: '🚪',  desc: 'Storage cabinet',       category: 'Basic' },
];

/* ── SVG icon helpers ── */
const Icons = {
  chevronRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
  ),
  chevronLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  palette: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg>
  ),
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ),
  trash: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
  ),
  save: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
  ),
  camera: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  ),
  move: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
  ),
  rotate: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
  ),
  maximize: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
  ),
  windowIcon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
  ),
};

const TAB_META = [
  { id: TABS.LIBRARY,    label: 'Library',  icon: Icons.plus },
  { id: TABS.PROPERTIES, label: 'Edit',     icon: Icons.palette },
  { id: TABS.ROOM,       label: 'Room',     icon: Icons.home },
  { id: TABS.GLOBAL,     label: 'Settings', icon: Icons.settings },
];

export default function Sidebar({
  user, onLogout, addItem, selectedId, items, updateItem, deleteItem,
  roomConfig, setRoomConfig, saveDesign, loadDesigns, downloadScreenshot,
  windows = [], addWindow, updateWindow, deleteWindow,
}) {
  const [activeTab, setActiveTab] = useState(TABS.LIBRARY);
  const [collapsed, setCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedItem = items.find(i => i.id === selectedId);
  const updateRoom = (key, value) => setRoomConfig(prev => ({ ...prev, [key]: value }));

  const filteredFurniture = useMemo(() => {
    if (!searchQuery.trim()) return FURNITURE_ITEMS;
    const q = searchQuery.toLowerCase();
    return FURNITURE_ITEMS.filter(f =>
      f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q) || f.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleDelete = useCallback(() => setShowDeleteConfirm(true), []);
  const confirmDelete = useCallback(() => {
    deleteItem(selectedId);
    setShowDeleteConfirm(false);
  }, [deleteItem, selectedId]);

  /* ── Collapsed rail ── */
  if (collapsed) {
    return (
      <aside style={S.rail} aria-label="Sidebar collapsed">
        <button style={S.railToggle} onClick={() => setCollapsed(false)} title="Expand sidebar" aria-label="Expand sidebar">
          {Icons.chevronRight}
        </button>
        <nav style={S.railNav} aria-label="Quick navigation">
          {TAB_META.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setCollapsed(false); }}
              title={t.label}
              aria-label={t.label}
              style={{
                ...S.railIcon,
                ...(activeTab === t.id ? S.railIconActive : {}),
              }}
            >
              {t.icon}
            </button>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside style={S.sidebar} aria-label="Design tools sidebar">

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.headerRow}>
          <div style={S.brand}>
            <img src={ndLogo} alt="ND Furniture" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
            <div>
              <div style={S.brandTitle}>ND Furniture</div>
              <div style={S.brandSub}>Design Studio</div>
            </div>
          </div>
          <button style={S.collapseBtn} onClick={() => setCollapsed(true)} title="Collapse sidebar" aria-label="Collapse sidebar">
            {Icons.chevronLeft}
          </button>
        </div>

        {/* User */}
        <div style={S.userCard} aria-label={`Logged in as ${user.username}`}>
          <div style={S.avatar} aria-hidden="true">{user.username?.charAt(0).toUpperCase()}</div>
          <div style={S.userMeta}>
            <span style={S.userName}>{user.username}</span>
            <span style={S.userRole}>Designer</span>
          </div>
          <div style={S.onlineDot} title="Online" />
        </div>
      </header>

      {/* ── Tab bar ── */}
      <nav style={S.tabBar} role="tablist" aria-label="Sidebar sections">
        {TAB_META.map(t => (
          <TabButton key={t.id} {...t} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
        ))}
      </nav>

      {/* ── Panel content ── */}
      <div style={S.content} role="tabpanel" aria-label={`${activeTab} panel`}>

        {/* ─── LIBRARY ─── */}
        {activeTab === TABS.LIBRARY && (
          <div style={S.fadeIn}>
            <SectionHeader title="Furniture Library" badge={`${items.length} placed`} />

            {/* Search */}
            <div style={S.searchWrap}>
              <span style={S.searchIcon}>{Icons.search}</span>
              <input
                type="text"
                placeholder="Search furniture…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={S.searchInput}
                aria-label="Search furniture library"
              />
              {searchQuery && (
                <button style={S.searchClear} onClick={() => setSearchQuery('')} aria-label="Clear search">&times;</button>
              )}
            </div>

            {filteredFurniture.length === 0 ? (
              <div style={S.emptyState}>
                <p style={S.emptyTitle}>No results</p>
                <p style={S.emptyDesc}>Try a different search term.</p>
              </div>
            ) : (
              <div style={S.libraryGrid} role="list" aria-label="Available furniture items">
                {filteredFurniture.map(f => (
                  <LibraryCard key={f.name} {...f} onClick={() => addItem(f.name)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── PROPERTIES ─── */}
        {activeTab === TABS.PROPERTIES && (
          <div style={S.fadeIn}>
            {!selectedItem ? (
              <div style={S.emptyState} role="status">
                <div style={S.emptyIconWrap} aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8" opacity=".4"/></svg>
                </div>
                <p style={S.emptyTitle}>No Selection</p>
                <p style={S.emptyDesc}>Click on a furniture item in the canvas to edit its properties.</p>
                <div style={S.tip}>
                  <span style={S.tipIcon}>💡</span>
                  <span>Use 2D Blueprint view for precise positioning.</span>
                </div>
              </div>
            ) : (
              <>
                {/* Selected item header */}
                <div style={S.propHeader}>
                  <div style={S.propHeaderLeft}>
                    <div style={S.propIcon}>{FURNITURE_ITEMS.find(f => f.name === selectedItem.type)?.icon || '📦'}</div>
                    <div>
                      <div style={S.propName}>{selectedItem.type}</div>
                      <div style={S.propId}>ID: {String(selectedId)?.slice(0, 8)}</div>
                    </div>
                  </div>
                  <button style={S.deleteIconBtn} onClick={handleDelete} title={`Delete ${selectedItem.type}`} aria-label={`Delete ${selectedItem.type}`}>
                    {Icons.trash}
                  </button>
                </div>

                {/* Color */}
                <PropertySection title="Material Color" icon={Icons.palette}>
                  <div className="color-picker-wrap">
                    <div className="color-swatch">
                      <input type="color" value={selectedItem.color} onChange={e => updateItem(selectedId, { color: e.target.value })} />
                    </div>
                    <span className="color-hex">{selectedItem.color}</span>
                  </div>
                </PropertySection>

                {/* Position */}
                <PropertySection title="Position" icon={Icons.move}>
                  <div style={S.tripleInput}>
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis} style={S.axisField}>
                        <span style={S.axisTag}>{axis}</span>
                        <input
                          type="number" step="0.1" className="input" style={S.numInput}
                          value={selectedItem.position[i].toFixed(2)}
                          onChange={e => {
                            const newPos = [...selectedItem.position];
                            newPos[i] = parseFloat(e.target.value);
                            updateItem(selectedId, { position: newPos });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </PropertySection>

                {/* Rotation */}
                <PropertySection title="Rotation" icon={Icons.rotate}>
                  <div style={S.sliderRow}>
                    <input
                      type="range" min="0" max={Math.PI * 2} step="0.1"
                      value={selectedItem.rotation[1]}
                      onChange={e => {
                        const newRot = [...selectedItem.rotation];
                        newRot[1] = parseFloat(e.target.value);
                        updateItem(selectedId, { rotation: newRot });
                      }}
                      style={{ flex: 1 }}
                    />
                    <span style={S.sliderVal}>{Math.round(selectedItem.rotation[1] * (180 / Math.PI))}°</span>
                  </div>
                </PropertySection>

                {/* Scale */}
                <PropertySection title="Scale" icon={Icons.maximize}>
                  <div style={S.sliderRow}>
                    <input
                      type="range" min="0.5" max="3" step="0.1"
                      value={selectedItem.scale[0]}
                      onChange={e => {
                        const s = parseFloat(e.target.value);
                        updateItem(selectedId, { scale: [s, s, s] });
                      }}
                      style={{ flex: 1 }}
                    />
                    <span style={S.sliderVal}>{selectedItem.scale[0].toFixed(1)}x</span>
                  </div>
                </PropertySection>
              </>
            )}
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && selectedItem && (
          <div className="confirm-overlay" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" onClick={() => setShowDeleteConfirm(false)}>
            <div style={S.confirmDialog} onClick={e => e.stopPropagation()} className="animate-slideUp">
              <div style={S.confirmIconWrap} aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h3 id="delete-title" style={S.confirmTitle}>Delete {selectedItem.type}?</h3>
              <p style={S.confirmDesc}>This action cannot be undone. The item will be permanently removed from your design.</p>
              <div style={S.confirmBtns}>
                <button className="btn" onClick={() => setShowDeleteConfirm(false)} autoFocus>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete} style={{ background: 'var(--danger)', color: 'white', borderColor: 'var(--danger)' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── ROOM ─── */}
        {activeTab === TABS.ROOM && (
          <div style={S.fadeIn}>
            <SectionHeader title="Room Shape" />
            <div style={S.shapeGrid}>
              {[
                { id: 'rectangle', label: 'Rectangle', svg: <svg viewBox="0 0 40 28" width="36" height="24"><rect x="2" y="2" width="36" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg> },
                { id: 'square',    label: 'Square',    svg: <svg viewBox="0 0 32 32" width="24" height="24"><rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg> },
                { id: 'l-shape',   label: 'L-Shape',   svg: <svg viewBox="0 0 36 36" width="24" height="24"><path d="M4 4 h16 v16 h12 v12 h-28 z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
                { id: 't-shape',   label: 'T-Shape',   svg: <svg viewBox="0 0 36 36" width="24" height="24"><path d="M4 4 h28 v12 h-10 v16 h-8 v-16 h-10 z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
                { id: 'u-shape',   label: 'U-Shape',   svg: <svg viewBox="0 0 36 36" width="24" height="24"><path d="M4 4 h8 v20 h12 v-20 h8 v28 h-28 z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
                { id: 'open',      label: 'Open',      svg: <svg viewBox="0 0 36 36" width="24" height="24"><rect x="2" y="2" width="32" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/></svg> },
              ].map(shape => (
                <ShapeButton key={shape.id} shape={shape} active={roomConfig.shape === shape.id} onClick={() => updateRoom('shape', shape.id)} />
              ))}
            </div>

            <SectionHeader title="Room Dimensions" />
            <div className="input-group">
              <label className="label" htmlFor="room-width">Width (m)</label>
              <input id="room-width" type="number" className="input" min="3" max="50" value={roomConfig.width} onChange={e => updateRoom('width', Number(e.target.value))} />
              <small style={S.inputHint}>3 – 50 meters</small>
            </div>
            <div className="input-group">
              <label className="label" htmlFor="room-depth">Depth (m)</label>
              <input id="room-depth" type="number" className="input" min="3" max="50" value={roomConfig.depth} onChange={e => updateRoom('depth', Number(e.target.value))} />
              <small style={S.inputHint}>3 – 50 meters</small>
            </div>

            <SectionHeader title="Materials" />
            <div className="input-group">
              <label className="label" htmlFor="wall-color">Wall Color</label>
              <div className="color-picker-wrap">
                <div className="color-swatch"><input id="wall-color" type="color" value={roomConfig.wallColor} onChange={e => updateRoom('wallColor', e.target.value)} /></div>
                <span className="color-hex">{roomConfig.wallColor}</span>
              </div>
            </div>
            <div className="input-group">
              <label className="label" htmlFor="floor-color">Floor Color</label>
              <div className="color-picker-wrap">
                <div className="color-swatch"><input id="floor-color" type="color" value={roomConfig.floorColor} onChange={e => updateRoom('floorColor', e.target.value)} /></div>
                <span className="color-hex">{roomConfig.floorColor}</span>
              </div>
            </div>

            {/* ── Windows ── */}
            <SectionHeader title="Windows" badge={`${windows.length}`} />
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
              Add windows to walls. They cast natural sunlight & shadows.
            </p>

            {/* Add window buttons */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {['back', 'left', 'right'].map(wall => (
                <button
                  key={wall}
                  onClick={() => addWindow(wall)}
                  style={S.addWindowBtn}
                  aria-label={`Add window to ${wall} wall`}
                >
                  {Icons.windowIcon}
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'capitalize' }}>{wall}</span>
                </button>
              ))}
            </div>

            {/* Window list */}
            {windows.map((win, idx) => (
              <div key={win.id} style={S.windowCard}>
                <div style={S.windowCardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#60a5fa', display: 'flex' }}>{Icons.windowIcon}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e8ecf4', textTransform: 'capitalize' }}>
                      {win.wall} Wall #{idx + 1}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteWindow(win.id)}
                    style={S.windowDeleteBtn}
                    aria-label="Remove window"
                  >
                    {Icons.trash}
                  </button>
                </div>
                <div style={S.windowCardBody}>
                  <div style={S.windowField}>
                    <label style={S.windowLabel}>Position</label>
                    <div style={S.sliderRow}>
                      <input type="range" min="0.1" max="0.9" step="0.05" value={win.position}
                        onChange={e => updateWindow(win.id, { position: parseFloat(e.target.value) })} style={{ flex: 1 }} />
                      <span style={S.sliderVal}>{Math.round(win.position * 100)}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ ...S.windowField, flex: 1 }}>
                      <label style={S.windowLabel}>Width (m)</label>
                      <input type="number" className="input" min="0.5" max="6" step="0.25" value={win.width}
                        onChange={e => updateWindow(win.id, { width: parseFloat(e.target.value) || 1 })} />
                    </div>
                    <div style={{ ...S.windowField, flex: 1 }}>
                      <label style={S.windowLabel}>Height (m)</label>
                      <input type="number" className="input" min="0.5" max="4" step="0.25" value={win.height}
                        onChange={e => updateWindow(win.id, { height: parseFloat(e.target.value) || 1 })} />
                    </div>
                  </div>
                  <div style={S.windowField}>
                    <label style={S.windowLabel}>Sill Height (m)</label>
                    <div style={S.sliderRow}>
                      <input type="range" min="0.3" max="3" step="0.1" value={win.sillHeight}
                        onChange={e => updateWindow(win.id, { sillHeight: parseFloat(e.target.value) })} style={{ flex: 1 }} />
                      <span style={S.sliderVal}>{win.sillHeight.toFixed(1)}m</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
            }
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {activeTab === TABS.GLOBAL && (
          <div style={S.fadeIn}>
            <SectionHeader title="Environment" />
            <div style={S.lightingCards}>
              {[
                { value: 'Day',    label: 'Daylight',    icon: '☀️', desc: 'Bright & natural' },
                { value: 'Golden', label: 'Golden Hour',  icon: '🌅', desc: 'Warm sunset tones' },
                { value: 'Night',  label: 'Night Mode',   icon: '🌙', desc: 'Soft ambient light' },
              ].map(mode => (
                <button
                  key={mode.value}
                  onClick={() => updateRoom('lightingMode', mode.value)}
                  style={{
                    ...S.lightingCard,
                    ...(roomConfig.lightingMode === mode.value ? S.lightingCardActive : {}),
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{mode.icon}</span>
                  <div>
                    <div style={S.lightingLabel}>{mode.label}</div>
                    <div style={S.lightingDesc}>{mode.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <SectionHeader title="Project Actions" />
            <div style={S.actionStack}>
              <ActionButton icon={Icons.save} label="Save Project" primary onClick={saveDesign} />
              <ActionButton icon={Icons.folder} label="Load Previous" onClick={loadDesigns} />
              <ActionButton icon={Icons.camera} label="Screenshot" onClick={downloadScreenshot} />
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={S.footer}>
        <button style={S.signOutBtn} onClick={onLogout} aria-label="Sign out of your account">
          {Icons.logout}
          <span>Sign Out</span>
        </button>
      </footer>
    </aside>
  );
}

/* ============================
   SUB-COMPONENTS
   ============================ */

function SectionHeader({ title, badge }) {
  return (
    <div style={S.sectionHeader}>
      <span style={S.sectionTitle}>{title}</span>
      {badge && <span style={S.sectionBadge}>{badge}</span>}
    </div>
  );
}

function PropertySection({ title, icon, children }) {
  return (
    <div style={S.propSection}>
      <div style={S.propSectionHeader}>
        <span style={S.propSectionIcon}>{icon}</span>
        <span style={S.propSectionTitle}>{title}</span>
      </div>
      <div style={S.propSectionBody}>{children}</div>
    </div>
  );
}

function ShapeButton({ shape, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={shape.label}
      style={{
        ...S.shapeBtn,
        ...(active ? S.shapeBtnActive : {}),
      }}
    >
      {shape.svg}
      <span style={S.shapeLabel}>{shape.label}</span>
    </button>
  );
}

function ActionButton({ icon, label, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...S.actionBtn,
        ...(primary ? S.actionBtnPrimary : {}),
      }}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

const TabButton = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    role="tab"
    aria-selected={active}
    aria-label={`${label} tab`}
    style={{
      ...S.tab,
      ...(active ? S.tabActive : {}),
    }}
  >
    <span style={{ opacity: active ? 1 : 0.5 }}>{icon}</span>
    <span style={S.tabLabel}>{label}</span>
    {active && <div style={S.tabIndicator} />}
  </button>
);

const LibraryCard = ({ name, icon, desc, category, onClick }) => (
  <button
    onClick={onClick}
    role="listitem"
    aria-label={`Add ${name} to room. ${desc}`}
    className="sidebar-library-card"
    style={S.libraryCard}
  >
    <div style={S.cardIconWrap}>
      <span style={S.cardIcon}>{icon}</span>
      {category === '3D' && <span style={S.badge3d}>3D</span>}
    </div>
    <span style={S.cardName}>{name}</span>
    <span style={S.cardDesc}>{desc}</span>
  </button>
);

/* ============================
   STYLES
   ============================ */
const S = {
  /* Sidebar shell */
  sidebar: {
    width: 310,
    height: '100%',
    background: 'linear-gradient(180deg, rgba(20,24,32,0.97) 0%, rgba(16,19,28,0.99) 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(20px)',
    transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
  },

  /* Rail (collapsed) */
  rail: {
    width: 56,
    height: '100%',
    background: 'linear-gradient(180deg, rgba(20,24,32,0.97) 0%, rgba(16,19,28,0.99) 100%)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 14,
    gap: 6,
  },
  railToggle: {
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  railNav: {
    display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8,
  },
  railIcon: {
    width: 38, height: 38,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: 10,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  railIconActive: {
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.25)',
    color: 'var(--accent)',
  },

  /* Header */
  header: {
    padding: '18px 18px 14px',
  },
  headerRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  brandIcon: {
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
    borderRadius: 10,
    color: 'var(--accent)',
  },
  brandTitle: {
    fontSize: '0.92rem', fontWeight: 700, color: '#f0f2f7', letterSpacing: '-0.01em',
  },
  brandSub: {
    fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase',
  },
  collapseBtn: {
    width: 30, height: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  /* User card */
  userCard: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: 10,
    fontSize: '0.82rem', fontWeight: 700, color: 'white',
    flexShrink: 0,
  },
  userMeta: {
    display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0,
  },
  userName: {
    fontSize: '0.82rem', fontWeight: 600, color: '#e8ecf4',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  userRole: {
    fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500,
  },
  onlineDot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px rgba(34,197,94,0.5)',
    flexShrink: 0,
  },

  /* Tabs */
  tabBar: {
    display: 'flex',
    padding: '0 6px',
    gap: 2,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    padding: '12px 4px 10px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    position: 'relative',
    borderRadius: '8px 8px 0 0',
  },
  tabActive: {
    color: 'var(--accent)',
    background: 'rgba(99,102,241,0.06)',
  },
  tabLabel: {
    fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  tabIndicator: {
    position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2,
    background: 'var(--accent)',
    borderRadius: '2px 2px 0 0',
  },

  /* Content */
  content: {
    flex: 1, overflowY: 'auto', padding: '16px 16px 20px',
  },
  fadeIn: {
    animation: 'fadeIn 0.2s ease-out',
  },

  /* Section header */
  sectionHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, paddingBottom: 8,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.8px',
  },
  sectionBadge: {
    fontSize: '0.6rem', fontWeight: 600,
    background: 'rgba(99,102,241,0.12)',
    color: '#818cf8',
    padding: '2px 8px',
    borderRadius: 8,
  },

  /* Search */
  searchWrap: {
    position: 'relative', marginBottom: 14,
  },
  searchIcon: {
    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '9px 32px 9px 32px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10,
    color: '#e8ecf4',
    fontSize: '0.82rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s',
  },
  searchClear: {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '1.1rem', lineHeight: 1, padding: '2px 4px',
  },

  /* Library grid */
  libraryGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
  },
  libraryCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '14px 10px 12px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
    color: '#e8ecf4',
    fontFamily: 'inherit',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIconWrap: {
    position: 'relative',
    width: 44, height: 44,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(99,102,241,0.08)',
    borderRadius: 12,
    marginBottom: 2,
  },
  cardIcon: {
    fontSize: '1.3rem',
  },
  badge3d: {
    position: 'absolute', top: -3, right: -6,
    fontSize: '0.5rem', fontWeight: 700,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '1px 5px',
    borderRadius: 5,
    letterSpacing: '0.3px',
  },
  cardName: {
    fontSize: '0.78rem', fontWeight: 600,
  },
  cardDesc: {
    fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3,
  },

  /* Properties panel */
  propHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  propHeaderLeft: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  propIcon: {
    width: 38, height: 38,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(99,102,241,0.1)',
    borderRadius: 10,
    fontSize: '1.2rem',
  },
  propName: {
    fontSize: '0.88rem', fontWeight: 600, color: '#f0f2f7',
  },
  propId: {
    fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: "'SF Mono','Fira Code',monospace",
  },
  deleteIconBtn: {
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: 8,
    color: 'var(--danger)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  propSection: {
    marginBottom: 14,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  propSectionHeader: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  propSectionIcon: {
    color: 'var(--text-muted)', display: 'flex',
  },
  propSectionTitle: {
    fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.4px',
  },
  propSectionBody: {
    padding: '10px 12px',
  },
  tripleInput: {
    display: 'flex', gap: 6,
  },
  axisField: {
    flex: 1, position: 'relative',
  },
  axisTag: {
    position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
    fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', pointerEvents: 'none',
  },
  numInput: {
    paddingLeft: 22,
  },
  sliderRow: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  sliderVal: {
    fontSize: '0.72rem', fontWeight: 600, color: '#818cf8',
    minWidth: 36, textAlign: 'right',
    fontFamily: "'SF Mono','Fira Code',monospace",
  },

  /* Empty state */
  emptyState: {
    textAlign: 'center', padding: '36px 16px',
  },
  emptyIconWrap: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 64, height: 64,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: '0.92rem', fontWeight: 600, color: '#e8ecf4', marginBottom: 6,
  },
  emptyDesc: {
    fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55,
  },
  tip: {
    display: 'flex', alignItems: 'flex-start', gap: 8,
    marginTop: 18, padding: '10px 14px',
    background: 'rgba(99,102,241,0.06)',
    borderRadius: 10,
    border: '1px solid rgba(99,102,241,0.1)',
    fontSize: '0.72rem', color: '#818cf8',
    lineHeight: 1.5, textAlign: 'left',
  },
  tipIcon: {
    flexShrink: 0, fontSize: '0.9rem', marginTop: 1,
  },

  /* Room shape buttons */
  shapeGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 20,
  },
  shapeBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '10px 4px',
    borderRadius: 10,
    cursor: 'pointer',
    border: '1.5px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    color: 'var(--text-muted)',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  shapeBtnActive: {
    border: '1.5px solid rgba(99,102,241,0.5)',
    background: 'rgba(99,102,241,0.1)',
    color: 'var(--accent)',
  },
  shapeLabel: {
    fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.2px',
  },
  inputHint: {
    display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 400,
  },

  /* Lighting cards */
  lightingCards: {
    display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20,
  },
  lightingCard: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    color: 'var(--text-main)',
    textAlign: 'left',
  },
  lightingCardActive: {
    border: '1.5px solid rgba(99,102,241,0.45)',
    background: 'rgba(99,102,241,0.08)',
  },
  lightingLabel: {
    fontSize: '0.8rem', fontWeight: 600, color: '#e8ecf4',
  },
  lightingDesc: {
    fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1,
  },

  /* Action buttons */
  actionStack: {
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    fontSize: '0.82rem',
    fontWeight: 500,
    textAlign: 'left',
  },
  actionBtnPrimary: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
    border: '1px solid rgba(99,102,241,0.3)',
    color: '#c7d2fe',
    fontWeight: 600,
  },

  /* Confirm dialog */
  confirmDialog: {
    background: 'var(--bg-panel)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '30px',
    maxWidth: 360, width: '90%',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  confirmIconWrap: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 56, height: 56,
    background: 'rgba(239,68,68,0.08)',
    borderRadius: 14,
    marginBottom: 14,
  },
  confirmTitle: {
    fontSize: '1.05rem', fontWeight: 700, color: '#f0f2f7', marginBottom: 8,
  },
  confirmDesc: {
    fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 22,
  },
  confirmBtns: {
    display: 'flex', gap: 10, justifyContent: 'center',
  },

  /* Footer */
  footer: {
    padding: '10px 14px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  signOutBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    width: '100%',
    padding: '9px 12px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: 8,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    fontWeight: 500,
  },

  /* Window controls */
  addWindowBtn: {
    flex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '10px 6px',
    borderRadius: 10,
    border: '1.5px dashed rgba(96,165,250,0.3)',
    background: 'rgba(96,165,250,0.05)',
    color: '#60a5fa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  windowCard: {
    marginBottom: 10,
    borderRadius: 10,
    border: '1px solid rgba(96,165,250,0.15)',
    background: 'rgba(96,165,250,0.04)',
    overflow: 'hidden',
  },
  windowCardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 10px',
    borderBottom: '1px solid rgba(96,165,250,0.1)',
  },
  windowCardBody: {
    padding: '10px',
  },
  windowDeleteBtn: {
    width: 28, height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: 6,
    color: 'var(--danger)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  windowField: {
    marginBottom: 8,
  },
  windowLabel: {
    display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 4,
  },
};