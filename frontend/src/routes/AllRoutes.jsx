import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/game/Home';
import Parity from '../pages/game/Parity';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PublicRoute from './PublicRoute';

export const routes = createBrowserRouter([
  // Public/Guest-only routes (redirects to '/' if already logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  // Main App (Home page accessible to public, feature actions intercepted for unauthenticated visitors)
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/parity',
        element: <Parity />,
      },
      {
        path: '*',
        element: <Home />,
      },
    ],
  },
]);

export default routes;
