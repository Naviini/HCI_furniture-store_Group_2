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
        navigate('/dashboard');
      } else {
        showFeedback(data.message || 'Invalid credentials. Please try again.', 'error');
      }
    } catch (err) { 
      console.error(err);
      showFeedback('Unable to connect to the server. Please check your connection and try again.', 'error'); 
    }
  };

  // --- REGISTRATION LOGIC ---
  const handleRegister = async (username, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        showFeedback('Account created successfully! Please sign in.', 'success');
        return true; // Signal LoginBox to switch to login view
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-dark)',
    backgroundImage: `
      radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, rgba(99, 102, 241, 0.04) 0%, transparent 50%)
    `,
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  }
};