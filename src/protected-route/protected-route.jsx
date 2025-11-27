import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Simplified ProtectedRoute for admin.looi.in deployment
// Uses a token in localStorage; if no token, redirect to /login.
// Does NOT use window.location.href (avoids full page reloads).

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
