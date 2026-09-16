import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PublicRoute (Guest Route) Component
 * Restricts access for already-authenticated users from viewing login/register pages.
 * If user is authenticated, redirects to home or previously intended route.
 */
const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen bg-[#FAF6F0] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#8B3A13]/20 border-t-[#8B3A13] rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium text-[#7D6B60] tracking-wide">Loading session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
