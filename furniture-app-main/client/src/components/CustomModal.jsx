import React, { useState, useEffect, useRef } from 'react';

export default function CustomModal({ title, subtitle, isOpen, onClose, onSubmit, placeholder, confirmLabel = 'Confirm' }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // HCI: Trap focus within modal and handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-subtitle">
      <div style={styles.modal} onClick={e => e.stopPropagation()} className="animate-slideUp">
        {/* Close button */}
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div style={styles.header}>
          <h3 id="modal-title" style={styles.title}>{title}</h3>
          {subtitle && <p id="modal-subtitle" style={styles.subtitle}>{subtitle}</p>}
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="modal-input" className="sr-only">{placeholder}</label>
          <input
            id="modal-input"
            ref={inputRef}
            style={styles.input}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-required="true"
          />
          <div style={styles.buttons}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={{
              ...styles.confirmBtn,
              opacity: inputValue.trim() ? 1 : 0.5,
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            }} disabled={!inputValue.trim()}>
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    padding: '28px',
    borderRadius: 'var(--radius-lg)',
    width: '380px',
    boxShadow: 'var(--shadow-lg)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: '16px', right: '16px',
    background: 'transparent', border: 'none', color: 'var(--text-muted)',
    cursor: 'pointer', padding: '4px', borderRadius: 'var(--radius-sm)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)',
  },
  subtitle: {
    margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4,
  },
  input: {
    width: '100%', padding: '12px 14px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color var(--transition-fast)',
    marginBottom: '20px',
  },
  buttons: {
    display: 'flex', justifyContent: 'flex-end', gap: '10px',
  },
  cancelBtn: {
    padding: '10px 20px', cursor: 'pointer',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
    fontSize: '0.85rem', fontWeight: 500, fontFamily: 'inherit',
    transition: 'all var(--transition-fast)',
  },
  confirmBtn: {
    padding: '10px 24px', cursor: 'pointer',
    background: 'var(--accent)', border: 'none',
    borderRadius: 'var(--radius-md)', color: 'white',
    fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
    boxShadow: '0 2px 8px var(--accent-glow)',
    transition: 'all var(--transition-fast)',
  },
};