import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Clear dummy token immediately on mount (synchronous)
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Clear dummy token immediately
    if (token === 'dummy-token') {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setLoading(false);
      return; // Exit early
    }
  }, []); // Empty dependency array = runs once on mount

  // Then check for valid token
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && token !== 'dummy-token') {
      // Optional: Validate token format here
      const isValidToken = token.length > 20; // Basic check for JWT token
      
      if (isValidToken) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};