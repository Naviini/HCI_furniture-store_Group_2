import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBox from '../components/LoginBox';

export default function LoginPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ message: '', type: '' });

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
        // Route to admin dashboard if role is admin, else always show onboarding
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/onboarding');
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
    <div style={pageStyles.wrapper}>
      <div style={pageStyles.animatedGradient} aria-hidden="true" />
      <div style={pageStyles.blurOverlay} aria-hidden="true" />
      <LoginBox
        onLogin={handleLogin}
        onRegister={handleRegister}
        feedback={feedback}
        clearFeedback={() => setFeedback({ message: '', type: '' })}
      />
    </div>
  );
}

const pageStyles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0a0a0f',
    margin: 0,
    padding: 0,
    overflowY: 'auto',
  },
  animatedGradient: {
    position: 'absolute',
    inset: 0,
    backgroundSize: '400% 400%',
    backgroundImage: 'linear-gradient(120deg, #4c1d95, #be185d, #0f172a, #312e81)',
    opacity: 0.45,
    animation: 'login-gradient-shift 20s linear infinite',
    zIndex: 0,
  },
  blurOverlay: {
    position: 'absolute',
    inset: 0,
    backdropFilter: 'blur(80px)',
    WebkitBackdropFilter: 'blur(80px)',
    backgroundColor: 'rgba(10,10,15,0.65)',
    zIndex: 1,
  },
};