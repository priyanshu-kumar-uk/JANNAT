import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/game/Home';
import Parity from '../pages/game/Parity';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

export const routes = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/parity",
        element: <Parity />
      }
    ]
  }])