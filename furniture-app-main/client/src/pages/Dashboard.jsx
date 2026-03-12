import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import BlueprintView from '../components/BlueprintView';
import CustomModal from '../components/CustomModal';
import TemplatesPage from '../components/TemplatesPage';
import './Dashboard.css';

/* ── Toast Notification (HCI: Visibility of system status) ── */
const Toast = ({ message, type = 'info', onDismiss }) => {
  const configs = {
    success: { icon: '✓', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
    error: { icon: '✕', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
    warning: { icon: '⚠', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
    info: { icon: 'ℹ', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
  };
  const cfg = configs[type] || configs.info;
  return (
    <div className="db-toast" role="alert" aria-live="assertive"
      style={{ background: cfg.bg, borderColor: cfg.border }}>
      <span className="db-toast-icon" style={{ color: cfg.color, background: `${cfg.color}20` }}>
        {cfg.icon}
      </span>
      <span className="db-toast-msg">{message}</span>
      <button className="db-toast-close" onClick={onDismiss} aria-label="Dismiss notification">×</button>
    </div>
  );
};

/* ── Loading Overlay ── */
const LoadingOverlay = ({ text }) => (
  <div className="db-loading-overlay">
    <div className="db-loading-card">
      <div className="db-loading-spinner" />
      <span className="db-loading-text">{text}</span>
    </div>
  </div>
);

/* ── Mode Badge ── */
const ModeBadge = ({ mode }) => {
  const is3D = mode === '3D';
  return (
    <div className="db-mode-badge" style={{ color: is3D ? '#a78bfa' : '#38bdf8' }}>
      <span className="db-mode-dot" style={{ background: is3D ? '#a78bfa' : '#38bdf8' }} />
      {is3D ? '3D Render' : 'Blueprint'}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const canvasRef = useRef();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('3D');
  const [cameraMode, setCameraMode] = useState('TPP');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [roomConfig, setRoomConfig] = useState({
    shape: 'rectangle', width: 15, depth: 15,
    wallColor: '#e0e0e0', floorColor: '#5c3a21',
    floorType: 'plank_flooring', lightingMode: 'Day',
  });

  const [windows, setWindows] = useState([]);
  const [doors, setDoors] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  /* ── Keyboard shortcuts (HCI: accelerators for expert users) ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && document.activeElement.tagName !== 'INPUT') {
        deleteItem(selectedId);
      }
      if (e.key === 'Escape') setSelectedId(null);
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); setShowSaveModal(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, items]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/login');
    else {
      setUser(JSON.parse(storedUser));
      // Show templates picker on very first visit (empty canvas)
      setShowTemplates(true);
    }
  }, [navigate]);

  const showToast = (msg, type = 'info') => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  const addItem = (type) => {
    const DEFAULTS = {
      'Coffee Table': { y: 0, color: '#888888' },
      'Chair': { y: 0, color: '#888888' },
      'Drawer': { y: 0, color: '#888888' },
      'Lamp': { y: 0.5, color: '#ffaa00' },
    };
    const def = DEFAULTS[type] || { y: 0.5, color: '#888888' };
    const newItem = {
      id: Date.now(), type,
      position: [0, def.y, 0], rotation: [0, 0, 0], scale: [1, 1, 1],
      color: def.color,
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
    showToast(`${type} added to canvas`, 'success');
  };

  const updateItem = (id, data) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelectedId(null);
    showToast('Item removed', 'info');
  };

  /* ── Window management ── */
  const addWindow = (wall) => {
    const newWin = {
      id: `win-${Date.now()}`, wall,
      position: 0.5, width: 2, height: 2, sillHeight: 1,
    };
    setWindows(prev => [...prev, newWin]);
    showToast(`Window added to ${wall} wall`, 'success');
  };

  const updateWindow = (id, data) =>
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...data } : w));

  const deleteWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    showToast('Window removed', 'info');
  };

  /* ── Door management ── */
  const addDoor = (wall) => {
    const newDoor = {
      id: `door-${Date.now()}`, wall,
      position: 0.5, width: 1.2, height: 2.4,
    };
    setDoors(prev => [...prev, newDoor]);
    showToast(`Door added to ${wall} wall`, 'success');
  };

  const updateDoor = (id, data) =>
    setDoors(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));

  const deleteDoor = (id) => {
    setDoors(prev => prev.filter(d => d.id !== id));
    showToast('Door removed', 'info');
  };

  const handleSaveSubmit = async (designName) => {
    const thumbnail = canvasRef.current?.takeScreenshot() || '';
    setIsSaving(true);
    try {
      await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user._id, name: designName, items, roomConfig, windows, doors, thumbnail }),
      });
      showToast('Project saved successfully!', 'success');
      setShowSaveModal(false);
    } catch {
      showToast('Failed to save. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const loadDesigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/designs/${user._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.length > 0) {
        const design = data[data.length - 1];
        setItems(design.items);
        if (design.roomConfig) setRoomConfig(design.roomConfig);
        if (design.windows) setWindows(design.windows);
        if (design.doors) setDoors(design.doors);
        showToast(`Loaded: ${design.name}`, 'success');
      } else {
        showToast('No saved designs found', 'info');
      }
    } catch {
      showToast('Failed to load designs. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Load a template ── */
  const handleSelectTemplate = (template) => {
    setItems(template.items.map(item => ({ ...item, id: Date.now() + Math.random() })));
    setRoomConfig(template.roomConfig);
    setWindows(template.windows || []);
    setDoors(template.doors || []);
    setShowTemplates(false);
    showToast(`Loaded template: ${template.name}`, 'success');
  };

  if (!user) return null;

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="db-root">
      {/* HCI: Skip link for keyboard users */}
      <a href="#design-canvas" className="skip-link">Skip to design canvas</a>

      {/* ── SIDEBAR ── */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        addItem={addItem}
        selectedId={selectedId}
        items={items}
        updateItem={updateItem}
        deleteItem={deleteItem}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        windows={windows}
        addWindow={addWindow}
        updateWindow={updateWindow}
        deleteWindow={deleteWindow}
        doors={doors}
        addDoor={addDoor}
        updateDoor={updateDoor}
        deleteDoor={deleteDoor}
        saveDesign={() => setShowSaveModal(true)}
        loadDesigns={loadDesigns}
        downloadScreenshot={() => {
          const link = document.createElement('a');
          link.download = `design-${Date.now()}.jpg`;
          link.href = canvasRef.current.takeScreenshot();
          link.click();
          showToast('Screenshot downloaded!', 'success');
        }}
      />

      {/* ── MAIN CANVAS AREA ── */}
      <main id="design-canvas" className="db-canvas-area" role="main" aria-label="Design canvas area">

        {/* Ambient gradient orbs */}
        <div className="db-orb db-orb-1" aria-hidden="true" />
        <div className="db-orb db-orb-2" aria-hidden="true" />

        {/* ── TOP HEADER BAR ── */}
        <header className="db-header" role="banner">
          <div className="db-header-left">
            {/* Logo / Brand */}
            <div className="db-brand">
              <div className="db-brand-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="db-brand-name">RoomCraft</span>
              <span className="db-brand-sep" aria-hidden="true" />
              <span className="db-brand-sub">Design Studio</span>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="db-shortcut-hints" aria-label="Keyboard shortcuts">
              <span className="db-hint"><kbd>Del</kbd> Remove</span>
              <span className="db-hint"><kbd>Esc</kbd> Deselect</span>
              <span className="db-hint"><kbd>Ctrl</kbd>+<kbd>S</kbd> Save</span>
            </div>
          </div>

          <div className="db-header-center">
            {/* ── View Mode Toggle ── */}
            <div className="db-mode-toggle" role="toolbar" aria-label="View mode selector">
              <button
                id="btn-3d-view"
                className={`db-mode-btn ${mode === '3D' ? 'db-mode-btn--active' : ''}`}
                onClick={() => setMode('3D')}
                aria-pressed={mode === '3D'}
                aria-label="Switch to 3D view"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>3D View</span>
              </button>
              <button
                id="btn-blueprint-view"
                className={`db-mode-btn ${mode === '2D' ? 'db-mode-btn--active' : ''}`}
                onClick={() => setMode('2D')}
                aria-pressed={mode === '2D'}
                aria-label="Switch to 2D Blueprint view"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
                <span>Blueprint</span>
              </button>
            </div>
          </div>

          <div className="db-header-right">
            {/* Selected item indicator */}
            {selectedItem && (
              <div className="db-selected-badge" aria-live="polite">
                <span className="db-selected-dot" aria-hidden="true" />
                <span>{selectedItem.type} selected</span>
              </div>
            )}

            {/* Quick actions */}
            {/* Templates button */}
            <button
              id="btn-templates"
              className="db-header-btn"
              onClick={() => setShowTemplates(true)}
              aria-label="Browse room templates"
              data-tooltip="Templates"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              <span>Templates</span>
            </button>

            <button
              className="db-header-btn db-header-btn--save"
              onClick={() => setShowSaveModal(true)}
              aria-label="Save design (Ctrl+S)"
              data-tooltip="Save (Ctrl+S)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Save</span>
            </button>

            <button
              id="btn-screenshot-header"
              className="db-header-btn"
              onClick={() => {
                const link = document.createElement('a');
                link.download = `design-${Date.now()}.jpg`;
                link.href = canvasRef.current.takeScreenshot();
                link.click();
                showToast('Screenshot downloaded!', 'success');
              }}
              aria-label="Download screenshot"
              data-tooltip="Screenshot"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>Capture</span>
            </button>

            {/* Admin panel shortcut (only visible to admin users) */}
            {user.role === 'admin' && (
              <button
                id="btn-admin-panel"
                className="db-header-btn"
                onClick={() => navigate('/admin')}
                aria-label="Go to admin panel"
                data-tooltip="Admin Panel"
                style={{ background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)', color: '#fbbf24' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>Admin Panel</span>
              </button>
            )}

            {/* User avatar */}
            <div className="db-user-chip" aria-label={`Logged in as ${user.username || user.email}`} data-tooltip={user.username || user.email}>
              <div className="db-avatar" aria-hidden="true"
                style={user.role === 'admin' ? { background: 'rgba(245,158,11,0.18)', color: '#fbbf24' } : {}}>
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span className="db-username">{(user.username || user.email || '').split('@')[0]}</span>
                {user.role === 'admin' ? (
                  <span style={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Designer</span>
                ) : (
                  <span style={{ fontSize: '0.6rem', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>User</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── CANVAS / BLUEPRINT ── */}
        <div className="db-canvas-wrapper">
          {mode === '2D' ? (
            <BlueprintView
              roomConfig={roomConfig}
              items={items}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              updateItem={updateItem}
              windows={windows}
              doors={doors}
            />
          ) : (
            <DesignCanvas
              ref={canvasRef}
              items={items}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              updateItem={updateItem}
              mode={mode}
              cameraMode={cameraMode}
              roomConfig={roomConfig}
              windows={windows}
              doors={doors}
            />
          )}

          {/* Camera Mode Toggle Switch (TPP/FPP) */}
          {mode === '3D' && (
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                background: 'rgba(30, 30, 40, 0.85)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* TPP Button */}
              <button
                onClick={() => setCameraMode('TPP')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: cameraMode === 'TPP' ? '#6366f1' : 'transparent',
                  color: cameraMode === 'TPP' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: cameraMode === 'TPP' ? 'bold' : 'normal',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxShadow: cameraMode === 'TPP' ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>TPP</span>
              </button>

              {/* FPP Button */}
              <button
                onClick={() => setCameraMode('FPP')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: cameraMode === 'FPP' ? '#6366f1' : 'transparent',
                  color: cameraMode === 'FPP' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: cameraMode === 'FPP' ? 'bold' : 'normal',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  boxShadow: cameraMode === 'FPP' ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="12" y1="4" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="20" />
                </svg>
                <span>FPP</span>
              </button>
            </div>
          )}

          {/* Empty state overlay */}
          {items.length === 0 && !isLoading && (
            <div className="db-empty-state" aria-live="polite">
              <div className="db-empty-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <p className="db-empty-title">Your canvas is empty</p>
              <p className="db-empty-sub">Add furniture from the sidebar to start designing your room</p>
            </div>
          )}
        </div>

        {/* ── STATUS BAR ── */}
        <footer className="db-status-bar" role="status" aria-live="polite" aria-label="Design status">
          <div className="db-status-left">
            <span className="db-status-indicator">
              <span className={`db-status-dot ${isSaving || isLoading ? 'db-status-dot--busy' : ''}`} aria-hidden="true" />
              <span className="db-status-text">
                {isSaving ? 'Saving…' : isLoading ? 'Loading…' : 'Ready'}
              </span>
            </span>
            <span className="db-status-divider" aria-hidden="true" />
            <ModeBadge mode={mode} />
          </div>

          <div className="db-status-right">
            <span className="db-stat" aria-label={`${items.length} furniture items placed`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
            <span className="db-stat" aria-label={`${windows.length} windows`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" /><line x1="3" y1="12" x2="21" y2="12" /></svg>
              {windows.length} {windows.length === 1 ? 'window' : 'windows'}
            </span>
            <span className="db-stat" aria-label={`Room: ${roomConfig.shape}, ${roomConfig.width} by ${roomConfig.depth} metres`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1" /></svg>
              {roomConfig.shape} · {roomConfig.width}m × {roomConfig.depth}m
            </span>
            <span className="db-stat db-stat--price" aria-label={`Total cost: $${items.reduce((sum, item) => {
              const prices = { 'Coffee Table': 49.99, 'Chair': 29.99, 'Drawer': 149.99, 'Table': 89.99, 'Bed': 299.99, 'Lamp': 39.99, 'Sofa': 499.99, 'Cabinet': 79.99 };
              return sum + (prices[item.type] || 0);
            }, 0).toFixed(2)}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              ${items.reduce((sum, item) => {
                const prices = { 'Coffee Table': 49.99, 'Chair': 29.99, 'Drawer': 149.99, 'Table': 89.99, 'Bed': 299.99, 'Lamp': 39.99, 'Sofa': 499.99, 'Cabinet': 79.99 };
                return sum + (prices[item.type] || 0);
              }, 0).toFixed(2)}
            </span>
            <span className="db-stat db-stat--muted" aria-hidden="true">
              <kbd>Del</kbd> remove &nbsp;·&nbsp; <kbd>Esc</kbd> deselect
            </span>
          </div>
        </footer>

        {/* Loading overlay */}
        {(isSaving || isLoading) && (
          <LoadingOverlay text={isSaving ? 'Saving your design…' : 'Loading your design…'} />
        )}
      </main>

      {/* ── TOAST ── */}
      {toast && <Toast message={toast} type={toastType} onDismiss={() => setToast(null)} />}

      {/* ── SAVE MODAL ── */}
      <CustomModal
        isOpen={showSaveModal}
        title="Save Project"
        subtitle="Save your current room design to your portfolio"
        placeholder="Enter project name…"
        confirmLabel="Save"
        onClose={() => setShowSaveModal(false)}
        onSubmit={handleSaveSubmit}
      />

      {/* ── TEMPLATES PICKER ── */}
      {showTemplates && (
        <TemplatesPage
          onSelectTemplate={handleSelectTemplate}
          onSkip={() => setShowTemplates(false)}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}