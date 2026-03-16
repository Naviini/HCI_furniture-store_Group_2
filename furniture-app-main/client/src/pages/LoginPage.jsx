import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBox from '../components/LoginBox';
import './LoginPage.css';

const LOGIN_LIVE_BACKGROUNDS = [
  {
    id: 'soft-living',
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=80',
  },
  {
    id: 'warm-loft',
    url: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=2200&q=80',
  },
  {
    id: 'designer-kitchen',
    url: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=2200&q=80',
  },
  {
    id: 'calm-bedroom',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=80',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [isLightMode, setIsLightMode] = useState(() => {
    const storedTheme =
      localStorage.getItem('app-theme') ||
      localStorage.getItem('login-theme') ||
      localStorage.getItem('intro-theme');
    return storedTheme === 'light';
  });
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % LOGIN_LIVE_BACKGROUNDS.length);
    }, 7500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('app-theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  const showFeedback = (message, type = 'error') => {
    setFeedback({ message, type });
    if (type === 'success') {
      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    }
  };

  // --- LOGIN LOGIC ---
  const handleLogin = async (username, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data));
        // Route to admin dashboard if role is admin, else open planner home
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        showFeedback(data.message || 'Invalid credentials. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showFeedback('Unable to connect to the server. Please check your connection and try again.', 'error');
    }
  };

  // --- REGISTRATION LOGIC ---
  const handleRegister = async (username, email, password, role = 'user', adminCode = '') => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role, adminCode }),
      });
      const data = await res.json();

      if (data.success) {
        const roleLabel = data.role === 'admin' ? 'Staff account' : 'Account';
        showFeedback(`${roleLabel} created successfully! Please sign in.`, 'success');
        return true;
      } else {
        showFeedback(data.message || 'Registration failed. Username or email may already be in use.', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showFeedback('Unable to connect to the server. Please try again later.', 'error');
      return false;
    }
  };

  return (
    <div className={`lp-page${isLightMode ? ' lp-page--light' : ''}`}>
      <div className="lp-live-bg" aria-hidden="true">
        {LOGIN_LIVE_BACKGROUNDS.map((bg, index) => (
          <div
            key={bg.id}
            className={`lp-live-layer${index === activeBgIndex ? ' is-active' : ''}`}
            style={{ '--lp-live-image': `url(${bg.url})` }}
          />
        ))}

        <div className="lp-aurora lp-aurora-a" />
        <div className="lp-aurora lp-aurora-b" />
        <div className="lp-grid" />
        <div className="lp-grain" />
        <div className="lp-vignette" />
      </div>

      <div className="lp-content">
        <button
          type="button"
          className={`lp-theme-toggle${isLightMode ? ' is-light' : ''}`}
          onClick={() => setIsLightMode((prev) => !prev)}
          aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-pressed={isLightMode}
        >
          <svg className="lp-theme-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.3M12 19.2v2.3M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6" />
          </svg>
        </button>

        <LoginBox
          onLogin={handleLogin}
          onRegister={handleRegister}
          feedback={feedback}
          clearFeedback={() => setFeedback({ message: '', type: '' })}
        />
      </div>
    </div>
  );
}