import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';

const LoginContent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // CORRECTED: Use '/admin-login' instead of '/admin/login'
      const response = await axiosInstance.post('/api/admin-login', {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      // Save the real token from API response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/', { replace: true });
      } else {
        setError('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
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
            disabled={loading}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 6,
              border: 'none',
              background: loading ? '#666' : '#22c55e',
              color: '#000',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 12, color: '#888', textAlign: 'center' }}>
          Note: This login connects to your backend API
        </div>
      </div>
    </div>
  );
};

export default LoginContent;