import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './components/layouts/BottomNav';

const App = () => {
  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-[#0E0A08] flex justify-center items-center select-none overflow-hidden overscroll-none">
      {/* Mobile Card Device Frame */}
      <div
        id="mobile"
        className="bg-[#FAF8F5] w-full max-w-[440px] h-full max-h-[100dvh] flex flex-col justify-between overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:border-x border-[#2A1B14]"
      >
        <main className="flex-1 overflow-y-auto no-scrollbar w-full min-h-0 relative overscroll-contain">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default App;