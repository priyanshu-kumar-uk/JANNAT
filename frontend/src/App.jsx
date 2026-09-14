import { Outlet } from 'react-router-dom'
import BottomNav from './components/BottomNav'

const App = () => {


  return (
    <div className='h-screen bg-black w-full flex justify-center items-center'>
      <div id="mobile" className='bg-white w-full max-w-[410px] h-full flex flex-col justify-between overflow-hidden relative shadow-2xl'>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </div>
  )
}

export default App