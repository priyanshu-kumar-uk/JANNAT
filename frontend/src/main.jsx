import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { routes } from './routes/AllRoutes.jsx'
import AuthInitializer from './components/AuthInitializer.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthInitializer>
      <RouterProvider router={routes} />
    </AuthInitializer>
  </Provider>
)
