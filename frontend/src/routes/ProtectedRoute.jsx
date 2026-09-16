import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute Component
 * Guards routes that require active authentication.
 * If user is not authenticated, redirects to /login and saves current location in state.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  // Show a clean loading state while verifying initial authentication
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen bg-[#FAF6F0] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#8B3A13]/20 border-t-[#8B3A13] rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium text-[#7D6B60] tracking-wide">Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
