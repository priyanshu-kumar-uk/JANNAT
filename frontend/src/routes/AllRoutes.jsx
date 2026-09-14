import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';

export const routes = createBrowserRouter([{
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />
        }
    ]
}])