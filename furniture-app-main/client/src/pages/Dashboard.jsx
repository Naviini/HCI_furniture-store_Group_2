import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DesignCanvas from '../components/DesignCanvas';
import BlueprintView from '../components/BlueprintView';
import CustomModal from '../components/CustomModal';

// Modern Toast
const Toast = ({ message, type = 'info' }) => {
  const borderColors = { info: 'var(--accent)', success: 'var(--success)', error: 'var(--danger)', warning: 'var(--warning)' };
  return (
    <div className="toast" style={{ borderLeftColor: borderColors[type] || borderColors.info }}>
      {type === 'success' && '✓ '}{type === 'error' && '✗ '}{message}
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
    } catch (err) { showToast('Failed to save project', 'error'); }
  };

  const loadDesigns = async () => {
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
    } catch (err) { showToast('Failed to load designs', 'error'); }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-dark)' }}>
      
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

      <div style={{ flex: 1, position: 'relative', background: '#0a0a0a' }}>
        
        {/* Floating Toolbar */}
        <div className="floating-toolbar">
          <button className={`toolbar-btn ${mode === '3D' ? 'active' : ''}`} onClick={() => setMode('3D')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            3D View
          </button>
          <button className={`toolbar-btn ${mode === '2D' ? 'active' : ''}`} onClick={() => setMode('2D')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
            Blueprint
          </button>
          <button className={`toolbar-btn ${mode === 'Tour' ? 'active' : ''}`} onClick={() => setMode('Tour')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            Tour
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

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            <span className="status-dot" />
            <span>Ready</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span className="status-item">Mode: {mode}</span>
            <span className="status-item">Items: {items.length}</span>
            <span className="status-item">Room: {roomConfig.shape} {roomConfig.width}m × {roomConfig.depth}m</span>
          </div>
        </div>
      </div>

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