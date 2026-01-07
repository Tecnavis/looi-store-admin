import axios from 'axios';

const BASE_URL = import.meta.env?.VITE_BASE_URL || 
                 process.env?.REACT_APP_BASE_URL || 
                 'https://looi-store-server-ypdx.onrender.com';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Create a function to setup interceptors that accepts navigate
export const setupInterceptors = (navigate) => {
  // Request interceptor to add token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        
        // Use the navigate function passed as parameter
        if (navigate) {
          navigate("/login", { replace: true });
        } else {
          // Fallback if navigate is not available
          if (typeof window !== 'undefined') {
            window.location.href = '/#/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );
  
  return instance;
};

export default instance;