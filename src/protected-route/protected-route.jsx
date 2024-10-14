
// components/ProtectedRoute.js



// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token'); 
//   const location = useLocation(); 

//   if (!token) {
    
//     return <Navigate to="/login" state={{ from: location }} />;
//   }


//   const isAuthorized = true; 

//   if (!isAuthorized) {
  
//     return <Navigate to="/error403" state={{ from: location }} />;
//   }

//   return children; 
// };

// export default ProtectedRoute;

// -----------------------------------------------------------------------------

// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   const location = useLocation();

//   // If there's no token, redirect to login page
//   if (!token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // If we have a token, render the protected content
//   return children;
// };

// export default ProtectedRoute;



// -------------------------------------------------------------------------------

import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loader while checking auth state
  }

  if (!isAuthenticated) {
    window.location.href = '/login'; // Redirect to login if not authenticated
    return null; // Prevent rendering the protected component
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
