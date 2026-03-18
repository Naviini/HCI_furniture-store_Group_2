import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import BlueprintView from '../components/BlueprintView';
import CustomModal from '../components/CustomModal';
import ndLogo from '../assets/LOGO/logo.jpeg';
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

const ITEM_BOUND_RADIUS = {
  'Coffee Table': 0.7,
  'Chair': 0.4,
  'Drawer': 0.4,
  'TV Stand': 1.0,
  'TV Stand 3': 0.8,
  'File Cabinet': 0.4,
  'Computer Chair': 0.4,
  'Lounge Chair': 0.6,
  'Dining Table': 1.0,
  'Dining Set': 1.3,
  'Computer Table': 0.8,
  'Table': 0.8,
  'Industrial Table': 1.2,
  'Modern Sofa': 1.2,
  'Sofa': 1.1,
  'Sofa Chair': 0.6,
  'Bed': 1.1,
  'Poliform Bed': 1.2,
  'Desk Lamp': 0.15,
  'Floor Lamp': 0.2,
  'Eric Floor Lamp': 0.2,
  'Bathroom Asset 1': 0.8,
  'Bathroom Closet': 0.6,
  'Bathtub': 1.5,
  'Bathtub 2': 1.4,
  'Sink & Vanity': 0.8,
  'Sink with Faucet': 0.6,
  'Toilet': 0.5,
  'Toilet Vaa': 0.5,
  'Bed Agape': 1.3,
  'Chocolate Bookshelf': 0.6,
  'Modern Wardrobe': 0.8,
  'Wardrobe': 0.8,
  'Wardrobe 2': 0.8,
  'Banheira Maestri': 1.6,
  'European Cabinet': 1.0,
  'Kitchen': 2.0,
  'Kitchen Cabinet 1': 0.8,
  'Modern Fridge': 0.7,
  'Small Kitchen': 1.5,
  'Couch Complete': 1.8,
  'Dining Chair': 0.4,
  'Outdoor Sofa': 1.6,
};

const clampPositionToRoom = (position, roomConfig, itemType) => {
  if (!Array.isArray(position) || position.length < 3) return position;
  if (!roomConfig || roomConfig.shape === 'open') return position;

  const [x, y, z] = position;
  const halfW = (roomConfig.width ?? 0) / 2;
  const halfD = (roomConfig.depth ?? 0) / 2;
  const radius = ITEM_BOUND_RADIUS[itemType] ?? 0.6;
  const margin = 0.45 + radius;

  const clampedX = Math.max(-halfW + margin, Math.min(halfW - margin, x));
  const clampedZ = Math.max(-halfD + margin, Math.min(halfD - margin, z));
  return [clampedX, y, clampedZ];
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef();
  const fileMenuRef = useRef(null);

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  /* ── Undo / Redo history (NF: Error Prevention & Recovery) ── */
  const histRef = useRef({ stack: [[]], idx: 0 });
  const [histVer, setHistVer] = useState(0); // incremented to force re-render of canUndo/canRedo

  const pushHistory = useCallback((newItems) => {
    const h = histRef.current;
    const newStack = [...h.stack.slice(0, h.idx + 1), newItems];
    histRef.current = { stack: newStack, idx: newStack.length - 1 };
    setItems(newItems);
    setHistVer(v => v + 1);
  }, []);

  /* Reset history entirely when loading a template or saved design */
  const resetHistory = useCallback((newItems) => {
    histRef.current = { stack: [newItems], idx: 0 };
    setItems(newItems);
    setHistVer(v => v + 1);
  }, []);

  const undo = useCallback(() => {
    const h = histRef.current;
    if (h.idx <= 0) return;
    const newIdx = h.idx - 1;
    histRef.current = { ...h, idx: newIdx };
    setItems(h.stack[newIdx]);
    setSelectedId(null);
    setHistVer(v => v + 1);
    setToast('↩ Undo'); setToastType('info'); setTimeout(() => setToast(null), 2000);
  }, []);

  const redo = useCallback(() => {
    const h = histRef.current;
    if (h.idx >= h.stack.length - 1) return;
    const newIdx = h.idx + 1;
    histRef.current = { ...h, idx: newIdx };
    setItems(h.stack[newIdx]);
    setHistVer(v => v + 1);
    setToast('↪ Redo'); setToastType('info'); setTimeout(() => setToast(null), 2000);
  }, []);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState('3D');
  const [cameraMode, setCameraMode] = useState('TPP');
  const [drawWallMode, setDrawWallMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [roomConfig, setRoomConfig] = useState({
    shape: 'rectangle', width: 15, depth: 15,
    wallColor: '#e0e0e0', floorColor: '#ffffff',
    floorType: 'plank_flooring', lightingMode: 'Day',
    showFloorGrid: true,
    ambientIntensity: null, sunIntensity: null,
    customPoints: [],
  });

  const [windows, setWindows] = useState([]);
  const [doors, setDoors] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  /* ── Keyboard shortcuts (HCI: accelerators for expert users) ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && document.activeElement.tagName !== 'INPUT') {
        deleteItem(selectedId);
      }
      if (e.key === 'Escape') {
        setSelectedId(null);
        setShowFileMenu(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); setShowSaveModal(true); }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, items, undo, redo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
        setShowFileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/login');
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    const selectedShape = localStorage.getItem('nd-selected-room-shape');
    const startMode = localStorage.getItem('nd-start-mode');
    if (!selectedShape || startMode !== 'blank') return;

    const shapeMap = {
      rectangle: 'rectangle',
      square: 'square',
      'l-shape': 'l-shape',
      't-shape': 't-shape',
      'u-shape': 'u-shape',
      'z-shape': 'z-shape',
      cut: 'cut',
      rounded: 'rounded',
      custom: 'custom',
    };
    const nextShape = shapeMap[selectedShape] || 'rectangle';

    setRoomConfig(prev => ({
      ...prev,
      shape: nextShape,
      customPoints: nextShape === 'custom' ? [] : prev.customPoints,
    }));

    if (nextShape === 'custom') {
      setMode('2D');
      setDrawWallMode(true);
      setToast('Draw your room walls in 2D. Click points, then press Finish Drawing.');
      setToastType('info');
      setTimeout(() => setToast(null), 4500);
    } else {
      setDrawWallMode(false);
    }

    localStorage.removeItem('nd-selected-room-shape');
    localStorage.removeItem('nd-start-mode');
  }, []);

  useEffect(() => {
    const navTemplate = location.state?.selectedTemplate;
    const navStartMode = location.state?.startMode;
    const startMode = navStartMode || localStorage.getItem('nd-start-mode');
    const selectedTemplateRaw = localStorage.getItem('nd-selected-template');
    const parsedTemplate = navTemplate || (selectedTemplateRaw ? JSON.parse(selectedTemplateRaw) : null);
    if (!parsedTemplate && startMode !== 'template') return;
    if (!parsedTemplate) return;

    try {

      if (parsedTemplate?.roomConfig) setRoomConfig(parsedTemplate.roomConfig);
      if (Array.isArray(parsedTemplate?.windows)) setWindows(parsedTemplate.windows);
      if (Array.isArray(parsedTemplate?.doors)) setDoors(parsedTemplate.doors);
      if (Array.isArray(parsedTemplate?.items) && parsedTemplate.items.length > 0) {
        resetHistory(parsedTemplate.items);
      }

      const loadedTemplateName = parsedTemplate?.name || parsedTemplate?.title || 'Template Design';
      setProjectName(loadedTemplateName);
      setToast(`Loaded template: ${loadedTemplateName}`);
      setToastType('success');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Failed to load selected template');
      setToastType('error');
      setTimeout(() => setToast(null), 3000);
    } finally {
      localStorage.removeItem('nd-selected-template');
      localStorage.removeItem('nd-start-mode');
      localStorage.removeItem('nd-selected-template-version');
    }
  }, [location.state, resetHistory]);

  const handleCustomRoomCreated = useCallback((points) => {
    if (!Array.isArray(points) || points.length < 3) return;
    setRoomConfig(prev => ({
      ...prev,
      shape: 'custom',
      customPoints: points,
    }));
    setDrawWallMode(false);
    setMode('3D');
    showToast('Custom room walls created. Switched to 3D view.', 'success');
  }, []);

  const showToast = (msg, type = 'info') => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingCompleted');
    navigate('/login');
  };

  const handleSignOutClick = () => {
    setIsProfileModalOpen(false);
    setShowSignOutConfirm(true);
  };

  const addItem = (type) => {
    const DEFAULTS = {
      'Coffee Table': { y: 0, color: '#888888' },
      'Chair': { y: 0, color: '#888888' },
      'Drawer': { y: 0, color: '#888888' },
      'Lamp': { y: 0, color: '#ffaa00' },
    };
    const def = DEFAULTS[type] || { y: 0, color: '#888888' };
    const newItem = {
      id: Date.now(), type,
      position: [0, def.y, 0], rotation: [0, 0, 0], scale: [1, 1, 1],
      color: def.color, brightness: 1,
    };
    pushHistory([...histRef.current.stack[histRef.current.idx], newItem]);
    setSelectedId(newItem.id);
    showToast(`${type} added to canvas`, 'success');
  };

  const updateItem = useCallback((id, data) => {
    const current = histRef.current.stack[histRef.current.idx];
    const next = current.map(i => {
      if (i.id !== id) return i;
      const merged = { ...i, ...data };
      if (merged.position) {
        merged.position = clampPositionToRoom(merged.position, roomConfig, merged.type);
      }
      return merged;
    });
    pushHistory(next);
  }, [pushHistory, roomConfig]);

  const deleteItem = useCallback((id) => {
    const current = histRef.current.stack[histRef.current.idx];
    pushHistory(current.filter(i => i.id !== id));
    setSelectedId(null);
    showToast('Item removed', 'info');
  }, [pushHistory]);

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
      setProjectName(designName);
      setShowSaveModal(false);
    } catch {
      showToast('Failed to save. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Save as Template function ── */
  const handleSaveTemplateSubmit = async ({ name, description, category, emoji, tag, isPublic }) => {
    if (!items.length) {
      showToast('Cannot save empty design as template', 'warning');
      return;
    }

    const thumbnail = canvasRef.current?.takeScreenshot() || '';
    setIsSaving(true);
    try {
      // Generate preview items from current furniture
      const previewItems = items.slice(0, 4).map(item => {
        switch (item.type) {
          case 'Sofa': return '🛋️';
          case 'Coffee Table': return '☕';
          case 'Chair': return '💺';
          case 'Bed': return '🛏️';
          case 'Lamp': return '💡';
          case 'Drawer': return '🗄️';
          case 'Table': return '🔲';
          case 'Cabinet': return '📦';
          default: return '📦';
        }
      });

      const templateData = {
        userId: user._id,
        name,
        description,
        category: category || 'Custom',
        emoji: emoji || '⭐',
        tag: tag || 'Custom',
        tagColor: '#22c55e',
        gradient: 'linear-gradient(135deg, #059669 0%, #047857 40%, #065f46 100%)',
        previewItems,
        items,
        roomConfig,
        windows: windows || [],
        doors: doors || [],
        thumbnail,
        isPublic: isPublic || false
      };

      await fetch('http://localhost:5000/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(templateData),
      });

      showToast('Template saved successfully!', 'success');
      setShowTemplateModal(false);
    } catch {
      showToast('Failed to save template. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveAsTemplate = () => {
    setShowTemplateModal(true);
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
        resetHistory(design.items || []);
        if (design.roomConfig) setRoomConfig(design.roomConfig);
        if (design.windows) setWindows(design.windows);
        if (design.doors) setDoors(design.doors);
        showToast(`Loaded: ${design.name}`, 'success');

        setSavedDesigns(data);
        setShowLoadModal(true);

      } else {
        showToast('No saved designs found', 'info');
      }
    } catch {
      showToast('Failed to load designs. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDesign = (design) => {
    // Use resetHistory to properly initialize undo/redo state
    resetHistory(design.items || []);
    if (design.roomConfig) setRoomConfig(design.roomConfig);
    if (design.windows) setWindows(design.windows);
    if (design.doors) setDoors(design.doors);
    setProjectName(design.name);
    setShowLoadModal(false);
    showToast(`Loaded: ${design.name}`, 'success');
  };

  if (!user) return null;

  return (
    <div className="db-root">
      {/* HCI: Skip link for keyboard users */}
      <a href="#design-canvas" className="skip-link">Skip to design canvas</a>

      {/* ── SIDEBAR ── */}
      <Sidebar
        user={user}
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
        saveAsTemplate={saveAsTemplate}
        undo={undo}
        redo={redo}
        canUndo={histRef.current.idx > 0}
        canRedo={histRef.current.idx < histRef.current.stack.length - 1}
      />

      {/* ── MAIN CANVAS AREA ── */}
      <main id="design-canvas" className="db-canvas-area" role="main" aria-label="Design canvas area">

        {/* Ambient gradient orbs */}
        <div className="db-orb db-orb-1" aria-hidden="true" />
        <div className="db-orb db-orb-2" aria-hidden="true" />

        {/* ── TOP HEADER BAR ── */}
        <header className="db-header" role="banner">
          <div className="db-header-left">
            <button
              type="button"
              className="db-header-btn"
              onClick={() => navigate('/home')}
              aria-label="Back to home"
              data-tooltip="Back to Home"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Logo / Brand */}
            <div className="db-brand">
              <img className="db-brand-logo" src={ndLogo} alt="ND furniture" />
              <span className="db-brand-name">ND furniture</span>
              <span className="db-brand-sep" aria-hidden="true" />
              <span className="db-brand-sub">Design Studio</span>
            </div>

          {/* ── LEFT: View Mode Toggle ── */}
            <div className="db-mode-toggle" role="toolbar" aria-label="View mode selector">
              <button
                id="btn-3d-view"
                className={`db-mode-btn ${mode === '3D' ? 'db-mode-btn--active' : ''}`}
                onClick={() => setMode('3D')}
                aria-pressed={mode === '3D'}
                aria-label="Switch to 3D view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

          {/* ── CENTER: Project + Live status ── */}
          <div className="db-header-center" aria-label="Project context">
            <div className="db-project-title" title={projectName}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
              <span>{projectName}</span>
            </div>

            <div className="db-live-pill" aria-label="Auto-save is active">
              <span className="db-live-dot" aria-hidden="true" />
              <span>Live</span>
            </div>
          </div>

          {/* ── RIGHT: Actions + User ── */}
          <div className="db-header-right">
            {/* Action buttons group */}
            <div className="db-header-actions" role="toolbar" aria-label="Project actions">
              <button
                id="btn-templates"
                className="db-header-btn"
                onClick={() => setShowTemplateModal(true)}
                aria-label="Browse room templates"
                title="Templates"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Templates</span>
              </button>

              <button
                id="btn-save-header"
                className="db-header-btn db-header-btn--save"
                onClick={() => setShowSaveModal(true)}
                aria-label="Save design (Ctrl+S)"
                title="Save (Ctrl+S)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Save</span>
              </button>

              <button
                id="btn-undo-header"
                className="db-header-btn db-header-btn--icon"
                onClick={undo}
                disabled={histRef.current.idx <= 0}
                aria-label="Undo"
                title="Undo (Ctrl+Z)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 14L4 9l5-5" />
                  <path d="M4 9h9a7 7 0 0 1 0 14h-1" />
                </svg>
              </button>

              <button
                id="btn-redo-header"
                className="db-header-btn db-header-btn--icon"
                onClick={redo}
                disabled={histRef.current.idx >= histRef.current.stack.length - 1}
                aria-label="Redo"
                title="Redo (Ctrl+Y)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 14l5-5-5-5" />
                  <path d="M20 9h-9a7 7 0 0 0 0 14h1" />
                </svg>
              </button>
            </div>

            {/* Admin panel button */}
            {user.role === 'admin' && (
              <>
                <span className="db-header-divider" aria-hidden="true" />
                <button
                  id="btn-admin-panel"
                  className="db-header-btn db-header-btn--admin"
                  onClick={() => setShowAdminConfirm(true)}
                  aria-label="Go to admin panel"
                  title="Admin Panel"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Admin</span>
                </button>
              </>
            )}

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
              drawWallEnabled={drawWallMode}
              onCustomRoomCreated={handleCustomRoomCreated}
              onCancelDrawWall={() => setDrawWallMode(false)}
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

          {drawWallMode && mode === '2D' && (
            <div className="db-draw-hint" style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10000,
              padding: '8px 14px',
              borderRadius: '999px',
              background: 'rgba(14, 15, 30, 0.88)',
              border: '1px solid rgba(99,102,241,0.35)',
              color: '#e2e8f0',
              fontSize: '0.78rem',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}>
              Draw Wall Mode: click points to create walls, then finish drawing.
            </div>
          )}

          {/* Camera Mode Toggle Switch (TPP/FPP) */}
          {mode === '3D' && (
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '1px',
                padding: '2px',
                background: 'rgba(26, 11, 46, 0.95)',
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(233, 53, 199, 0.1)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(233, 53, 199, 0.15)',
                overflow: 'hidden',
              }}
            >
              {/* TPP Button */}
              <button
                onClick={() => setCameraMode('TPP')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: cameraMode === 'TPP'
                    ? 'linear-gradient(135deg, #E935C7 0%, #8b5cf6 100%)'
                    : 'transparent',
                  color: cameraMode === 'TPP' ? '#ffffff' : 'rgba(216, 180, 254, 0.7)',
                  border: cameraMode === 'TPP'
                    ? '1px solid rgba(233, 53, 199, 0.25)'
                    : '1px solid transparent',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  fontWeight: cameraMode === 'TPP' ? '700' : '600',
                  fontSize: '10px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: cameraMode === 'TPP'
                    ? '0 2px 8px rgba(233, 53, 199, 0.25), 0 0 12px rgba(233, 53, 199, 0.15)'
                    : 'none',
                  transform: cameraMode === 'TPP' ? 'translateY(-0.5px)' : 'none',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={(e) => {
                  if (cameraMode !== 'TPP') {
                    e.currentTarget.style.background = 'rgba(233, 53, 199, 0.08)';
                    e.currentTarget.style.color = 'rgba(245, 208, 254, 0.85)';
                    e.currentTarget.style.transform = 'translateY(-0.5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (cameraMode !== 'TPP') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(216, 180, 254, 0.7)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span style={{ lineHeight: '1', whiteSpace: 'nowrap' }}>Third</span>
              </button>

              {/* FPP Button */}
              <button
                onClick={() => setCameraMode('FPP')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  background: cameraMode === 'FPP'
                    ? 'linear-gradient(135deg, #E935C7 0%, #8b5cf6 100%)'
                    : 'transparent',
                  color: cameraMode === 'FPP' ? '#ffffff' : 'rgba(216, 180, 254, 0.7)',
                  border: cameraMode === 'FPP'
                    ? '1px solid rgba(233, 53, 199, 0.25)'
                    : '1px solid transparent',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  fontWeight: cameraMode === 'FPP' ? '700' : '600',
                  fontSize: '10px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: cameraMode === 'FPP'
                    ? '0 2px 8px rgba(233, 53, 199, 0.25), 0 0 12px rgba(233, 53, 199, 0.15)'
                    : 'none',
                  transform: cameraMode === 'FPP' ? 'translateY(-0.5px)' : 'none',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={(e) => {
                  if (cameraMode !== 'FPP') {
                    e.currentTarget.style.background = 'rgba(233, 53, 199, 0.08)';
                    e.currentTarget.style.color = 'rgba(245, 208, 254, 0.85)';
                    e.currentTarget.style.transform = 'translateY(-0.5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (cameraMode !== 'FPP') {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(216, 180, 254, 0.7)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6M12 17v6M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h6M17 12h6M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <span style={{ lineHeight: '1', whiteSpace: 'nowrap' }}>First</span>
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

      {/* ── PROFILE MODAL ── */}
      {isProfileModalOpen && (
        <div className="db-profile-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="db-profile-modal" role="dialog" aria-modal="true" aria-label="User profile" onClick={e => e.stopPropagation()}>
            <div className="db-profile-head">
              <div className="db-profile-avatar" style={user.role === 'admin' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : {}}>
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h3 className="db-profile-name">{(user.username || user.email || '').split('@')[0]}</h3>
                <p className="db-profile-email">{user.email}</p>
              </div>
            </div>

            <div className="db-profile-info-row">
              <span className="db-profile-label">Role</span>
              <span className={`db-role-badge ${user.role === 'admin' ? 'db-role-badge--admin' : 'db-role-badge--user'}`}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>

            <div className="db-profile-info-row">
              <span className="db-profile-label">Status</span>
              <span className="db-profile-status">Online</span>
            </div>

            <button type="button" className="db-profile-signout" onClick={handleSignOutClick}>
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* ── SIGN OUT CONFIRM ── */}
      {showSignOutConfirm && (
        <div className="db-signout-overlay" onClick={() => setShowSignOutConfirm(false)}>
          <div className="db-signout-modal" role="alertdialog" aria-modal="true" aria-label="Confirm sign out" onClick={e => e.stopPropagation()}>
            <h3>Sign out?</h3>
            <p>You will be returned to the login page.</p>
            <div className="db-signout-actions">
              <button type="button" className="db-signout-cancel" onClick={() => setShowSignOutConfirm(false)}>Cancel</button>
              <button type="button" className="db-signout-confirm" onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </div>
      )}

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

      {/* ── SAVE AS TEMPLATE MODAL ── */}
      {showTemplateModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowTemplateModal(false)}
          role="dialog" aria-modal="true" aria-labelledby="template-modal-title"
        >
          <div
            style={{ background: '#111421', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, width: 420, maxWidth: '92vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 28px 70px rgba(0,0,0,0.55)', position: 'relative', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
            className="animate-slideUp"
          >
            {/* Header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 id="template-modal-title" style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Save as Template</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#8b93a9', lineHeight: 1.5 }}>Create a reusable template from your current design</p>
              <button
                onClick={() => setShowTemplateModal(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#8b93a9', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Form */}
            <form
              style={{ padding: '20px 28px 28px' }}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSaveTemplateSubmit({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  category: formData.get('category'),
                  emoji: formData.get('emoji'),
                  tag: formData.get('tag'),
                  isPublic: formData.get('isPublic') === 'on'
                });
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>Template Name *</label>
                  <input
                    name="name"
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    placeholder="My Custom Room"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>Description</label>
                  <textarea
                    name="description"
                    rows="2"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'none' }}
                    placeholder="Brief description of this room template"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>Category</label>
                    <select
                      name="category"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    >
                      <option value="Custom">Custom</option>
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Dining">Dining</option>
                      <option value="Workspace">Workspace</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>Emoji</label>
                    <input
                      name="emoji"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
                      placeholder="⭐"
                      defaultValue="⭐"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>Tag (optional)</label>
                  <input
                    name="tag"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit' }}
                    placeholder="Custom"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                  <input type="checkbox" name="isPublic" id="isPublic" style={{ width: 16, height: 16 }} />
                  <label htmlFor="isPublic" style={{ fontSize: '0.85rem', color: '#e2e8f0', cursor: 'pointer' }}>Make this template public (others can use it)</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #22c55e, #059669)', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(34,197,94,0.35)', transition: 'all 0.18s', opacity: isSaving ? 0.6 : 1 }}
                >
                  {isSaving ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LOAD PREVIOUS MODAL ── */}
      {showLoadModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowLoadModal(false)}
          role="dialog" aria-modal="true" aria-labelledby="load-modal-title"
        >
          <div
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: 420, maxWidth: '92vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
            className="animate-slideUp"
          >
            {/* Header */}
            <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 id="load-modal-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Load Previous Project</h3>
              <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{savedDesigns.length} saved design{savedDesigns.length !== 1 ? 's' : ''} found</p>
              <button
                onClick={() => setShowLoadModal(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Design list */}
            <div style={{ overflowY: 'auto', padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...savedDesigns].reverse().map((design) => (
                <div
                  key={design._id}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  {/* Load area */}
                  <button
                    onClick={() => handleLoadDesign(design)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', minWidth: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e8ecf4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{design.name}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {design.items?.length ?? 0} item{design.items?.length !== 1 ? 's' : ''}
                        {design.createdAt ? ` · ${new Date(design.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteDesign(e, design._id)}
                    title="Delete this design"
                    style={{ flexShrink: 0, width: 36, height: 36, margin: '0 10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8, color: '#ef4444', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN PANEL CONFIRM ── */}
      {showAdminConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#111421',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 20,
            padding: '36px 32px',
            width: 'min(420px, 90vw)',
            textAlign: 'center',
            boxShadow: '0 28px 70px rgba(0,0,0,0.55)',
            animation: 'db-modal-in 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Warning icon */}
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'rgba(245,158,11,0.12)',
              border: '2px solid rgba(245,158,11,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', margin: '0 auto 18px',
            }}>⚠️</div>

            <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              Leave Current Design?
            </h3>
            <p style={{ margin: '0 0 10px', fontSize: '0.84rem', color: '#8b93a9', lineHeight: 1.6 }}>
              You are about to navigate to the <strong style={{ color: '#fbbf24' }}>Admin Panel</strong>.
            </p>
            <p style={{
              margin: '0 0 26px', fontSize: '0.82rem', lineHeight: 1.6,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.22)',
              borderRadius: 10, padding: '10px 14px',
              color: '#fca5a5',
            }}>
              ⚠ Any unsaved changes to your current furniture design will be <strong>lost</strong>.
              Make sure to save before leaving.
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setShowAdminConfirm(false)}
                style={{
                  flex: 1, padding: '10px 18px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.color='#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#94a3b8'; }}
              >
                ← Keep Designing
              </button>
              <button
                onClick={() => navigate('/admin')}
                style={{
                  flex: 1, padding: '10px 18px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  color: '#fff', fontSize: '0.84rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(245,158,11,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(245,158,11,0.35)'; }}
              >
                Go to Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}