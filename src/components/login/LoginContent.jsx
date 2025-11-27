import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Very simple login form for admin.looi.in
// On submit it sets a dummy token in localStorage and redirects to the dashboard (/).

const LoginContent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      // TODO: Replace this with real API call if needed.
      // For now, just mark user as "logged in".
      localStorage.setItem('token', 'dummy-token');
      setError('');
      navigate('/', { replace: true });
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 24, borderRadius: 12, background: '#111', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Store Admin Login</h2>
        {error && (
          <div style={{ marginBottom: 16, padding: 8, borderRadius: 6, background: '#331111', color: '#ff8080', fontSize: 13 }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #444', background: '#000', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #444', background: '#000', color: '#fff' }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 6,
              border: 'none',
              background: '#22c55e',
              color: '#000',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginContent;
