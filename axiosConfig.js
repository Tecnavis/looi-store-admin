import axios from 'axios';

const BASE_URL = import.meta.env?.VITE_BASE_URL || 
                 process.env?.REACT_APP_BASE_URL || 
                 'https://looi-store-server-ypdx.onrender.com';

const instance = axios.create({
  // baseURL: 'http://localhost:8000',
  // baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: BASE_URL,

  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear any existing auth tokens
      localStorage.removeItem('token');
      // Redirect to login page
      navigate("/login", { replace: true });
    }
    return Promise.reject(error);
  }
);

export default instance;
