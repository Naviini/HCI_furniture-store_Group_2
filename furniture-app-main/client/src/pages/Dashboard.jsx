import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import BlueprintView from '../components/BlueprintView';
import CustomModal from '../components/CustomModal';

// Modern Toast (HCI: Visibility of system status)
const Toast = ({ message, type = 'info' }) => {
  const borderColors = { info: 'var(--accent)', success: 'var(--success)', error: 'var(--danger)', warning: 'var(--warning)' };
  const icons = { success: '✓ ', error: '✗ ', warning: '⚠ ', info: 'ⓘ ' };
  return (
    <div className="toast" role="alert" aria-live="assertive" style={{ borderLeftColor: borderColors[type] || borderColors.info }}>
      <span aria-hidden="true">{icons[type] || ''}</span>{message}
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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [roomConfig, setRoomConfig] = useState({
    shape: 'rectangle', width: 15, depth: 15, wallColor: '#e0e0e0', floorColor: '#5c3a21', lightingMode: 'Day'
  });

  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('info');
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/login');
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  const showToast = (msg, type = 'info') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  // HCI: Keyboard shortcuts for efficiency (accelerators for expert users)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete/Backspace to remove selected item
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && document.activeElement.tagName !== 'INPUT') {
        deleteItem(selectedId);
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, items]);

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

  const addItem = (type) => {
    const DEFAULTS = {
      'Coffee Table': { y: 0, color: '#888888' },
      'Chair':        { y: 0, color: '#888888' },
      'Drawer':       { y: 0, color: '#888888' },
      'Lamp':         { y: 0.5, color: '#ffaa00' },
    };
    const def = DEFAULTS[type] || { y: 0.5, color: '#888888' };
    const newItem = { 
      id: Date.now(), type, 
      position: [0, def.y, 0], rotation: [0, 0, 0], scale: [1, 1, 1], 
      color: def.color 
    };
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
    showToast(`${type} added to canvas`, 'success');
  };

  const updateItem = (id, data) => setItems(prev => prev.map(i => i.id === id ? {...i, ...data} : i));
  
  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    setSelectedId(null);
    showToast('Item removed', 'info');
  };

  const handleSaveSubmit = async (designName) => {
    const thumbnail = canvasRef.current?.takeScreenshot() || '';
    setIsSaving(true);
    try {
      await fetch('http://localhost:5000/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ userId: user._id, name: designName, items, roomConfig, thumbnail }),
      });
      showToast('Project saved successfully', 'success');
      setShowSaveModal(false);
    } catch (err) { showToast('Failed to save project. Please try again.', 'error'); }
    finally { setIsSaving(false); }
  };

  const loadDesigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/designs/${user._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.length > 0) {
        const design = data[data.length - 1];
        setItems(design.items);
        if(design.roomConfig) setRoomConfig(design.roomConfig);
        showToast(`Loaded: ${design.name}`, 'success');
      } else showToast('No saved designs found', 'info');
    } catch (err) { showToast('Failed to load designs. Please try again.', 'error'); }
    finally { setIsLoading(false); }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-dark)' }}>
      {/* HCI: Skip link for keyboard users */}
      <a href="#design-canvas" className="skip-link">Skip to design canvas</a>
      
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
        saveDesign={() => setShowSaveModal(true)}
        loadDesigns={loadDesigns}
        downloadScreenshot={() => {
          const link = document.createElement('a');
          link.download = `design-${Date.now()}.jpg`;
          link.href = canvasRef.current.takeScreenshot();
          link.click();
          showToast('Screenshot downloaded', 'success');
        }}
      />

      <main id="design-canvas" style={{ flex: 1, position: 'relative', background: '#0a0a0a' }} role="main" aria-label="Design canvas area">
        
        {/* Floating Toolbar - HCI: Clear mode indicators with visual feedback */}
        <div className="floating-toolbar" role="toolbar" aria-label="View mode selector">
          <button 
            className={`toolbar-btn ${mode === '3D' ? 'active' : ''}`} 
            onClick={() => setMode('3D')}
            aria-pressed={mode === '3D'}
            aria-label="Switch to 3D view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            3D View
          </button>
          <button 
            className={`toolbar-btn ${mode === '2D' ? 'active' : ''}`} 
            onClick={() => setMode('2D')}
            aria-pressed={mode === '2D'}
            aria-label="Switch to 2D Blueprint view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
            Blueprint
          </button>

        </div>

        {/* Canvas / Blueprint */}
        {mode === '2D' ? (
          <BlueprintView
            roomConfig={roomConfig}
            items={items}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateItem={updateItem}
          />
        ) : (
          <DesignCanvas
            ref={canvasRef}
            items={items}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateItem={updateItem}
            mode={mode}
            roomConfig={roomConfig}
          />
        )}

        {/* Status Bar - HCI: Visibility of system status */}
        <div className="status-bar" role="status" aria-live="polite" aria-label="Design status information">
          <div className="status-item">
            <span className="status-dot" aria-hidden="true" />
            <span>{isSaving ? 'Saving...' : isLoading ? 'Loading...' : 'Ready'}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span className="status-item" aria-label={`Current mode: ${mode}`}>Mode: {mode}</span>
            <span className="status-item" aria-label={`${items.length} items placed`}>Items: {items.length}</span>
            <span className="status-item" aria-label={`Room shape: ${roomConfig.shape}, dimensions: ${roomConfig.width} by ${roomConfig.depth} meters`}>Room: {roomConfig.shape} {roomConfig.width}m × {roomConfig.depth}m</span>
            <span className="status-item" style={{ opacity: 0.5, fontSize: '0.65rem' }}>Del: remove • Esc: deselect</span>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast} type={toastType} />}
      
      <CustomModal 
        isOpen={showSaveModal}
        title="Save Project"
        subtitle="Save your current room design to your portfolio"
        placeholder="Enter project name..."
        confirmLabel="Save"
        onClose={() => setShowSaveModal(false)}
        onSubmit={handleSaveSubmit}
      />
    </div>
  );
}