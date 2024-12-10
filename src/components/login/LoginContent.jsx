
import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import Footer from '../footer/Footer';
import { DigiContext } from '../../context/DigiContext';
import { useAuth } from '../../context/AuthContext';

const LoginContent = () => {
  const { passwordVisible, togglePasswordVisibility } = useContext(DigiContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login from AuthContext

  const validateInput = () => {
    let isValid = true;

    // Username validation
    if (username.length < 5) {
      setUsernameError('Username must contain at least 5 characters ');
      isValid = false;
    } else {
      setUsernameError('');
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) {
      return;
    }

    try {
      const response = await axiosInstance.post('/admin-login', {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        login(response.data.token); // Update authentication state via context
        navigate('/'); // Navigate to the desired route after login
        console.log(response.data.token);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="main-content login-panel">
      <div className="login-body">
        <div className="top d-flex justify-content-between align-items-center">
          <div className="logo">
            {/* <img src="assets/images/logo-big.png" alt="Logo" /> */}
          </div>
          <Link to="/">
            <i className="fa-duotone fa-house-chimney"></i>
          </Link>
        </div>
        <div className="bottom">
          <h3 className="panel-title">Admin Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-30">
              <span className="input-group-text">
                <i className="fa-regular fa-user"></i>
              </span>
              <input
                type="text"
                className={`form-control ${usernameError ? 'is-invalid' : ''}`}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {usernameError && <div className="invalid-feedback">{usernameError}</div>}
            </div>
            <div className="input-group mb-20">
              <span className="input-group-text">
                <i className="fa-regular fa-lock"></i>
              </span>
              <input
                type={passwordVisible ? 'text' : 'password'}
                className={`form-control rounded-end ${passwordError ? 'is-invalid' : ''}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link
                role="button"
                className="password-show"
                onClick={togglePasswordVisibility}
              >
                <i className="fa-duotone fa-eye"></i>
              </Link>
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100 login-btn mt-5">
              Sign in
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginContent;
