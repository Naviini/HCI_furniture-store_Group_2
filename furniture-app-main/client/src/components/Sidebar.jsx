import React, { useState, useCallback } from 'react';

const TABS = { 
  LIBRARY: 'library', 
  PROPERTIES: 'properties', 
  ROOM: 'room', 
  GLOBAL: 'global' 
};

const FURNITURE_ITEMS = [
  // ── 3D Models (glTF) ──
  { name: 'Coffee Table', icon: '☕', desc: 'Round coffee table (3D)', model: true },
  { name: 'Chair',        icon: '💺', desc: 'Monobloc chair (3D)',    model: true },
  { name: 'Drawer',       icon: '🗄️', desc: 'Vintage drawer (3D)',   model: true },
  // ── Basic shapes ──
  { name: 'Table',   icon: '🔲', desc: 'Dining / Work table' },
  { name: 'Bed',     icon: '🛏️', desc: 'King / Queen bed' },
  { name: 'Lamp',    icon: '💡', desc: 'Floor lamp' },
  { name: 'Sofa',    icon: '🛋️', desc: 'Lounge sofa' },
  { name: 'Cabinet', icon: '🚪', desc: 'Storage cabinet' },
];

export default function Sidebar({ 
  user, onLogout, addItem, selectedId, items, updateItem, deleteItem,
  roomConfig, setRoomConfig, saveDesign, loadDesigns, downloadScreenshot 
}) {
  const [activeTab, setActiveTab] = useState(TABS.LIBRARY);
  const [collapsed, setCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const selectedItem = items.find(i => i.id === selectedId);
  const updateRoom = (key, value) => setRoomConfig(prev => ({ ...prev, [key]: value }));

  // HCI: Confirmation before destructive actions (error prevention)
  const handleDelete = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    deleteItem(selectedId);
    setShowDeleteConfirm(false);
  }, [deleteItem, selectedId]);

  if (collapsed) {
    return (
      <aside style={styles.collapsedSidebar} aria-label="Sidebar collapsed">
        <button style={styles.expandBtn} onClick={() => setCollapsed(false)} title="Expand sidebar" aria-label="Expand sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <nav style={styles.collapsedIcons} aria-label="Quick navigation">
          <CollapsedIcon icon="➕" label="Library" active={activeTab === TABS.LIBRARY} onClick={() => { setActiveTab(TABS.LIBRARY); setCollapsed(false); }} />
          <CollapsedIcon icon="🎨" label="Edit" active={activeTab === TABS.PROPERTIES} onClick={() => { setActiveTab(TABS.PROPERTIES); setCollapsed(false); }} />
          <CollapsedIcon icon="🏠" label="Room" active={activeTab === TABS.ROOM} onClick={() => { setActiveTab(TABS.ROOM); setCollapsed(false); }} />
          <CollapsedIcon icon="⚙️" label="Settings" active={activeTab === TABS.GLOBAL} onClick={() => { setActiveTab(TABS.GLOBAL); setCollapsed(false); }} />
        </nav>
      </aside>
    );
  }

  return (
    <aside style={styles.sidebar} aria-label="Design tools sidebar">
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon} aria-hidden="true">🛋️</div>
            <div>
              <div style={styles.logoTitle}>Design Studio</div>
              <div style={styles.logoSub}>v2.0 Professional</div>
            </div>
          </div>
          <button style={styles.collapseBtn} onClick={() => setCollapsed(true)} title="Collapse sidebar" aria-label="Collapse sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>
        <div style={styles.userBadge} aria-label={`Logged in as ${user.username}`}>
          <div style={styles.avatar} aria-hidden="true">{user.username?.charAt(0).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user.username}</span>
            <span style={styles.userRole}>Designer</span>
          </div>
        </div>
      </div>

      {/* Tabs - HCI: Clear navigation with active state indicators */}
      <nav style={styles.tabBar} role="tablist" aria-label="Sidebar sections">
        <TabButton label="Library" icon="➕" active={activeTab === TABS.LIBRARY} onClick={() => setActiveTab(TABS.LIBRARY)} />
        <TabButton label="Edit" icon="🎨" active={activeTab === TABS.PROPERTIES} onClick={() => setActiveTab(TABS.PROPERTIES)} />
        <TabButton label="Room" icon="🏠" active={activeTab === TABS.ROOM} onClick={() => setActiveTab(TABS.ROOM)} />
        <TabButton label="Settings" icon="⚙️" active={activeTab === TABS.GLOBAL} onClick={() => setActiveTab(TABS.GLOBAL)} />
      </nav>

      {/* Content */}
      <div style={styles.content} role="tabpanel" aria-label={`${activeTab} panel`}>
        
        {/* LIBRARY - HCI: Recognition rather than recall */}
        {activeTab === TABS.LIBRARY && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <div className="section-title">
              <span>Furniture Library</span>
              <span style={styles.badge} aria-label={`${items.length} items placed`}>{items.length} placed</span>
            </div>
            {/* HCI: Help text for new users (help & documentation) */}
            <p style={styles.helpText}>Click any item below to add it to your room canvas.</p>
            <div style={styles.libraryGrid} role="list" aria-label="Available furniture items">
              {FURNITURE_ITEMS.map(f => (
                <LibraryCard key={f.name} {...f} onClick={() => addItem(f.name)} />
              ))}
            </div>
          </div>
        )}

        {/* PROPERTIES - HCI: Direct manipulation & immediate feedback */}
        {activeTab === TABS.PROPERTIES && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            {!selectedItem ? (
              <div style={styles.emptyState} role="status">
                <div style={styles.emptyIcon} aria-hidden="true">🎯</div>
                <p style={styles.emptyTitle}>No Selection</p>
                <p style={styles.emptyDesc}>Click on a furniture item in the canvas to edit its properties.</p>
                <p style={styles.helpHint}>💡 Tip: You can also select items from the 2D Blueprint view for precise placement.</p>
              </div>
            ) : (
              <>
                <div className="section-title">
                  <span>{selectedItem.type} Properties</span>
                </div>

                {/* Color */}
                <div className="input-group">
                  <label className="label">Material Color</label>
                  <div className="color-picker-wrap">
                    <div className="color-swatch">
                      <input 
                        type="color" 
                        value={selectedItem.color} 
                        onChange={(e) => updateItem(selectedId, { color: e.target.value })} 
                      />
                    </div>
                    <span className="color-hex">{selectedItem.color}</span>
                  </div>
                </div>

                {/* Position */}
                <div className="input-group">
                  <label className="label">Position (X / Y / Z)</label>
                  <div style={styles.tripleInput}>
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis} style={styles.inputWithLabel}>
                        <span style={styles.axisLabel}>{axis}</span>
                        <input 
                          type="number" step="0.1" className="input" style={styles.numInput}
                          value={selectedItem.position[i].toFixed(2)}
                          onChange={(e) => {
                            const newPos = [...selectedItem.position];
                            newPos[i] = parseFloat(e.target.value);
                            updateItem(selectedId, { position: newPos });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rotation */}
                <div className="input-group">
                  <label className="label">Rotation</label>
                  <div style={styles.sliderWrap}>
                    <input 
                      type="range" min="0" max={Math.PI * 2} step="0.1"
                      value={selectedItem.rotation[1]}
                      onChange={(e) => {
                        const newRot = [...selectedItem.rotation];
                        newRot[1] = parseFloat(e.target.value);
                        updateItem(selectedId, { rotation: newRot });
                      }}
                    />
                    <span style={styles.sliderValue}>{Math.round(selectedItem.rotation[1] * (180 / Math.PI))}°</span>
                  </div>
                </div>

                {/* Scale */}
                <div className="input-group">
                  <label className="label">Scale</label>
                  <div style={styles.sliderWrap}>
                    <input 
                      type="range" min="0.5" max="3" step="0.1"
                      value={selectedItem.scale[0]}
                      onChange={(e) => {
                        const s = parseFloat(e.target.value);
                        updateItem(selectedId, { scale: [s, s, s] });
                      }}
                    />
                    <span style={styles.sliderValue}>{selectedItem.scale[0].toFixed(1)}x</span>
                  </div>
                </div>

                <div style={styles.divider} />
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleDelete} aria-label={`Delete ${selectedItem.type}`}>
                  🗑️ Delete {selectedItem.type}
                </button>
              </>
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog (HCI: Error prevention) */}
        {showDeleteConfirm && selectedItem && (
          <div className="confirm-overlay" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" onClick={() => setShowDeleteConfirm(false)}>
            <div style={styles.confirmDialog} onClick={e => e.stopPropagation()} className="animate-slideUp">
              <div style={styles.confirmIcon} aria-hidden="true">⚠️</div>
              <h3 id="delete-title" style={styles.confirmTitle}>Delete {selectedItem.type}?</h3>
              <p style={styles.confirmDesc}>This action cannot be undone. The item will be permanently removed from your design.</p>
              <div style={styles.confirmBtns}>
                <button className="btn" onClick={() => setShowDeleteConfirm(false)} autoFocus>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete} style={{ background: 'var(--danger)', color: 'white', borderColor: 'var(--danger)' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ROOM - HCI: Constraints to guide valid input */}
        {activeTab === TABS.ROOM && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <div className="section-title"><span>Room Shape</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {[
                { id: 'rectangle', label: 'Rectangle', svg: <svg viewBox="0 0 40 28" width="40" height="28"><rect x="2" y="2" width="36" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/></svg> },
                { id: 'square', label: 'Square', svg: <svg viewBox="0 0 32 32" width="28" height="28"><rect x="2" y="2" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/></svg> },
                { id: 'l-shape', label: 'L-Shape', svg: <svg viewBox="0 0 36 36" width="28" height="28"><path d="M4 4 h16 v16 h12 v12 h-28 z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
                { id: 't-shape', label: 'T-Shape', svg: <svg viewBox="0 0 36 36" width="28" height="28"><path d="M4 4 h28 v12 h-10 v16 h-8 v-16 h-10 z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
                { id: 'u-shape', label: 'U-Shape', svg: <svg viewBox="0 0 36 36" width="28" height="28"><path d="M4 4 h8 v20 h12 v-20 h8 v28 h-28 z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
                { id: 'open', label: 'Open', svg: <svg viewBox="0 0 36 36" width="28" height="28"><rect x="2" y="2" width="32" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3"/></svg> },
              ].map(shape => (
                <button
                  key={shape.id}
                  onClick={() => updateRoom('shape', shape.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    padding: '10px 4px', borderRadius: '8px', cursor: 'pointer',
                    border: roomConfig.shape === shape.id ? '2px solid var(--accent, #6366f1)' : '2px solid transparent',
                    background: roomConfig.shape === shape.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    color: roomConfig.shape === shape.id ? 'var(--accent, #6366f1)' : '#aaa',
                    transition: 'all 0.2s ease',
                    fontSize: '10px', fontWeight: 500,
                  }}
                >
                  {shape.svg}
                  {shape.label}
                </button>
              ))}
            </div>

            <div className="section-title"><span>Room Dimensions</span></div>
            
            <div className="input-group">
              <label className="label" htmlFor="room-width">Width (meters)</label>
              <input id="room-width" type="number" className="input" min="3" max="50" value={roomConfig.width} onChange={e => updateRoom('width', Number(e.target.value))} aria-describedby="width-hint" />
              <small id="width-hint" style={styles.inputHint}>Min: 3m — Max: 50m</small>
            </div>
            <div className="input-group">
              <label className="label" htmlFor="room-depth">Depth (meters)</label>
              <input id="room-depth" type="number" className="input" min="3" max="50" value={roomConfig.depth} onChange={e => updateRoom('depth', Number(e.target.value))} aria-describedby="depth-hint" />
              <small id="depth-hint" style={styles.inputHint}>Min: 3m — Max: 50m</small>
            </div>

            <div className="section-title" style={{ marginTop: '20px' }}><span>Materials</span></div>

            <div className="input-group">
              <label className="label" htmlFor="wall-color">Wall Color</label>
              <div className="color-picker-wrap">
                <div className="color-swatch">
                  <input id="wall-color" type="color" value={roomConfig.wallColor} onChange={e => updateRoom('wallColor', e.target.value)} aria-label="Wall color picker" />
                </div>
                <span className="color-hex">{roomConfig.wallColor}</span>
              </div>
            </div>
            <div className="input-group">
              <label className="label" htmlFor="floor-color">Floor Color</label>
              <div className="color-picker-wrap">
                <div className="color-swatch">
                  <input id="floor-color" type="color" value={roomConfig.floorColor} onChange={e => updateRoom('floorColor', e.target.value)} aria-label="Floor color picker" />
                </div>
                <span className="color-hex">{roomConfig.floorColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL - HCI: Flexibility & efficiency of use */}
        {activeTab === TABS.GLOBAL && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <div className="section-title"><span>Environment</span></div>

            <div className="input-group">
              <label className="label" htmlFor="lighting-mode">Lighting Mode</label>
              <select id="lighting-mode" className="input" value={roomConfig.lightingMode} onChange={e => updateRoom('lightingMode', e.target.value)} aria-label="Select lighting mode">
                <option value="Day">☀️  Daylight</option>
                <option value="Golden">🌅  Golden Hour</option>
                <option value="Night">🌙  Night Mode</option>
              </select>
            </div>

            <div className="section-title" style={{ marginTop: '24px' }}><span>Project</span></div>
            
            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '8px' }} onClick={saveDesign} aria-label="Save current project">
              💾 Save Project
            </button>
            <button className="btn" style={{ width: '100%', marginBottom: '8px' }} onClick={loadDesigns} aria-label="Load a previous project">
              📂 Load Previous
            </button>
            <button className="btn" style={{ width: '100%' }} onClick={downloadScreenshot} aria-label="Download screenshot of current design">
              📸 Screenshot
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={onLogout} aria-label="Sign out of your account">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ============================
   SUB-COMPONENTS
   ============================ */
const CollapsedIcon = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} title={label} aria-label={label} style={{
    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: active ? 'var(--accent-subtle)' : 'transparent',
    border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
    borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1.1rem',
    transition: 'all var(--transition-fast)',
  }}>
    {icon}
  </button>
);

const TabButton = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    role="tab"
    aria-selected={active}
    aria-label={`${label} tab`}
    style={{
      flex: 1, 
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
      padding: '10px 4px',
      background: active ? 'var(--accent-subtle)' : 'transparent',
      border: 'none', 
      borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
      color: active ? 'var(--accent-hover)' : 'var(--text-muted)', 
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      fontFamily: 'inherit',
    }}
  >
    <span style={{ fontSize: '1.1rem' }} aria-hidden="true">{icon}</span>
    <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
  </button>
);

const LibraryCard = ({ name, icon, desc, onClick }) => (
  <button 
    onClick={onClick}
    role="listitem"
    aria-label={`Add ${name} to room. ${desc}`}
    style={{
      background: 'var(--bg-card)', 
      border: '1px solid var(--border)', 
      borderRadius: 'var(--radius-md)',
      padding: '16px 12px', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      cursor: 'pointer', 
      transition: 'all var(--transition-fast)', 
      color: 'var(--text-main)',
      fontFamily: 'inherit',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
      e.currentTarget.style.background = 'var(--bg-hover)';
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.background = 'var(--bg-card)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <span style={{ fontSize: '1.6rem' }} aria-hidden="true">{icon}</span>
    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{name}</span>
    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{desc}</span>
  </button>
);

/* ============================
   STYLES
   ============================ */
const styles = {
  sidebar: {
    width: '320px', height: '100%', 
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    transition: 'width var(--transition-normal)',
  },
  collapsedSidebar: {
    width: '56px', height: '100%',
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: '12px', gap: '8px',
  },
  collapsedIcons: {
    display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px',
  },
  expandBtn: {
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)', cursor: 'pointer',
  },
  collapseBtn: {
    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)', cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  header: {
    padding: '16px 16px 12px',
    borderBottom: '1px solid var(--border)',
  },
  headerTop: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px',
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  logoIcon: {
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--accent-subtle)', borderRadius: 'var(--radius-md)',
    fontSize: '1.2rem',
  },
  logoTitle: {
    fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)',
  },
  logoSub: {
    fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500,
  },
  userBadge: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
  },
  avatar: {
    width: 32, height: 32, 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
    borderRadius: '50%',
    fontSize: '0.8rem', fontWeight: 700, color: 'white',
  },
  userInfo: {
    display: 'flex', flexDirection: 'column',
  },
  userName: {
    fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)',
  },
  userRole: {
    fontSize: '0.65rem', color: 'var(--text-muted)',
  },
  tabBar: {
    display: 'flex', borderBottom: '1px solid var(--border)',
  },
  content: {
    flex: 1, overflowY: 'auto', padding: '16px',
  },
  libraryGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
  },
  badge: {
    marginLeft: 'auto',
    fontSize: '0.65rem', fontWeight: 600,
    background: 'var(--accent-subtle)',
    color: 'var(--accent-hover)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  emptyState: {
    textAlign: 'center', padding: '40px 16px',
  },
  emptyIcon: {
    fontSize: '2.5rem', marginBottom: '12px', opacity: 0.6,
  },
  emptyTitle: {
    fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px',
  },
  emptyDesc: {
    fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5,
  },
  tripleInput: {
    display: 'flex', gap: '6px',
  },
  inputWithLabel: {
    flex: 1, position: 'relative',
  },
  axisLabel: {
    position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)',
    fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', pointerEvents: 'none',
  },
  numInput: {
    paddingLeft: '22px',
  },
  sliderWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  sliderValue: {
    fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-hover)',
    minWidth: '36px', textAlign: 'right', fontFamily: "'SF Mono', 'Fira Code', monospace",
  },
  divider: {
    height: '1px', background: 'var(--border)', margin: '16px 0',
  },
  helpText: {
    fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0',
    lineHeight: 1.5, fontStyle: 'italic',
  },
  helpHint: {
    fontSize: '0.75rem', color: 'var(--accent-hover)', margin: '16px 0 0 0',
    lineHeight: 1.5, padding: '10px 12px',
    background: 'var(--accent-subtle)', borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(99,102,241,0.15)',
  },
  inputHint: {
    display: 'block', fontSize: '0.67rem', color: 'var(--text-muted)',
    marginTop: '4px', fontWeight: 400,
  },
  confirmDialog: {
    background: 'var(--bg-panel)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px',
    maxWidth: '360px', width: '90%', textAlign: 'center',
    boxShadow: 'var(--shadow-lg)',
  },
  confirmIcon: {
    fontSize: '2rem', marginBottom: '12px',
  },
  confirmTitle: {
    fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)',
    marginBottom: '8px',
  },
  confirmDesc: {
    fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5,
    marginBottom: '20px',
  },
  confirmBtns: {
    display: 'flex', gap: '10px', justifyContent: 'center',
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid var(--border)',
  },
};