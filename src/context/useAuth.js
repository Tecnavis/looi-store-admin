// import { useState, useEffect } from 'react';
// import axiosInstance from "../config/axiosconfig";

// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authToken, setAuthToken] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setAuthToken(token);
//       setIsAuthenticated(true);
//       axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem('token', token);
//     setAuthToken(token);
//     setIsAuthenticated(true);
//     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setAuthToken(null);
//     setIsAuthenticated(false);
//     delete axiosInstance.defaults.headers.common['Authorization'];
//   };

//   return { isAuthenticated, authToken, login, logout };
// };