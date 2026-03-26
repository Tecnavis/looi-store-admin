import axios from 'axios';

const BASE_URL =
  import.meta.env?.VITE_BASE_URL ||
  'https://looi-store-server-izvs.onrender.com/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token
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

// ✅ Handle 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/#/login'; // 🔥 FIXED
    }
    return Promise.reject(error);
  }
);

export default instance;