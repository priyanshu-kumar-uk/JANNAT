import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './components/layouts/BottomNav';

const App = () => {
  return (
    <div className="h-screen bg-[#0E0A08] w-full flex justify-center items-center select-none overflow-hidden">
      {/* Mobile Card Device Frame */}
      <div
        id="mobile"
        className="bg-[#FAF8F5] w-full max-w-[420px] h-full flex flex-col justify-between overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-x border-[#2A1B14]"
      >
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default App;