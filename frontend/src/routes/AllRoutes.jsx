import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Parity from '../pages/Parity';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <App />,
    children: [
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