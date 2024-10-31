import axios from 'axios';

export const BASE_URL = 'https://looi-store-server-1.onrender.com';

const instance = axios.create({
  // baseURL: 'http://localhost:8000',
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
