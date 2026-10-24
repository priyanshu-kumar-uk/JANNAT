import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/game/Home';
import Parity from '../pages/game/Parity';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/user/Dashboard';
import Recharge from '../pages/recharge/Recharge';
import Invite from '../pages/invite/Invite';
import AdminRecharge from '../admin/pages/AdminRecharge';

export const routes = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
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
        path: '/invite',
        element: <Invite />,
      },
      {
        path: '/recharge',
        element: <Recharge />,
      },
      {
        path: '/account',
        element: <Dashboard />,
      },
      {
        path: '/admin/recharge',
        element: <AdminRecharge />,
      },
    ],
  },
]);

export default routes;
