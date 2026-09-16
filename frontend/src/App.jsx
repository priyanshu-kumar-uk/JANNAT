import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'

const App = () => {
  const location = useLocation()
  const isGamePage = location.pathname.startsWith('/parity')

  return (
    <div className='h-screen bg-black w-full flex justify-center items-center'>
      <div id="mobile" className='bg-white w-full max-w-[410px] h-full flex flex-col justify-between overflow-hidden relative shadow-2xl'>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        {!isGamePage && <BottomNav />}
      </div>
    </div>
  )
}

export default App