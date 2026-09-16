import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Parity from '../pages/Parity';

export const routes = createBrowserRouter([{
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