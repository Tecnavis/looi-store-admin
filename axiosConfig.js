import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',

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
