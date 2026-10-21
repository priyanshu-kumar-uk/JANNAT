import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './components/layouts/BottomNav';

const App = () => {
  return (
    <div className="h-screen bg-zinc-500 w-full flex justify-center items-center select-none overflow-hidden">
      {/* Mobile Card Device Frame */}
      <div
        id="mobile"
        className="bg-white w-full max-w-[420px] h-full flex flex-col justify-between overflow-hidden relative shadow-[0_4px_25px_rgba(0,0,0,0.06)] border-x border-gray-200"
      >
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default App;