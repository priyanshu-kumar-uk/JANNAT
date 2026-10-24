import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Gift,
  CalendarCheck,
} from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 relative text-black">
      {/* 1. FIXED TOP NAVBAR */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-xs">
        <div className="w-full px-3.5 py-2.5 flex items-center justify-between">
          {/* Left Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 p-0.5 shadow-xs flex items-center justify-center">
              <img
                src="/logo/Jannat-Logo.png"
                alt="Jannat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-black tracking-tight text-black uppercase">
              Jannat
            </span>
          </Link>

          {/* Right Header Action */}
          <div className="flex items-center gap-1.5">
            <Link
              to="/login"
              className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-xs transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* 2. WALLET / BALANCE CARD */}
      <div className="w-full px-3.5 pt-3">
        <div className="w-full rounded-2xl bg-white p-4 text-black shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            {/* Left Balance Display */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-[11px] font-semibold tracking-wider uppercase">
                  Available Points
                </span>
                <span className="text-[9px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  Active
                </span>
              </div>

              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-black text-black tracking-tight leading-none">
                  ₹1,250.00
                </span>
                <span className="text-[11px] font-bold text-gray-500 ml-1.5">INR</span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                <span>ID: 9876543210</span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                to="/recharge"
                className="w-24 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-transform text-center block"
              >
                Recharge
              </Link>
              <Link
                to="/account"
                className="w-24 py-1.5 bg-white hover:bg-gray-50 border border-blue-600 text-blue-600 text-xs font-bold rounded-full active:scale-95 transition-transform text-center block"
              >
                Withdraw
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTION CARDS */}
      <div className="w-full px-3.5 py-3 grid grid-cols-2 gap-2.5">
        {/* Task Reward */}
        <Link
          to="/account"
          className="bg-white rounded-2xl p-2.5 border border-gray-200 shadow-xs flex items-center justify-between active:scale-[0.98] transition-all hover:border-blue-600 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Gift size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black">Task Reward</h4>
              <p className="text-[10px] text-gray-500">Get ₹100+ Free</p>
            </div>
          </div>
        </Link>

        {/* Daily Check-In */}
        <Link
          to="/account"
          className="bg-white rounded-2xl p-2.5 border border-gray-200 shadow-xs flex items-center justify-between active:scale-[0.98] transition-all hover:border-blue-600 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black">Check In</h4>
              <p className="text-[10px] text-gray-500">Daily Bonus</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 4. POPULAR GAMES 2x2 GRID */}
      <div className="w-full px-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame size={15} className="text-blue-600" />
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Popular Games
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-blue-600">Instant Payouts</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* CARD 1: Fast-Parity */}
          <Link
            to="/parity"
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between active:scale-[0.98] transition-all duration-150 shadow-sm relative overflow-hidden group border border-gray-200 bg-white hover:border-blue-600"
          >
            <img
              src="https://www.acewin.ink/_astro/fast-parity.Cw4eRbcT_Z591Fh.webp"
              alt="Fast-Parity"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
              30 Sec
            </div>
            <div className="relative z-10 w-full bg-black/60 backdrop-blur-xs py-1.5 px-2 rounded-xl text-center">
              <span className="text-white text-xs font-bold tracking-wide">Play Fast-Parity</span>
            </div>
          </Link>

          {/* CARD 2: MineSweeper */}
          <div className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between shadow-sm relative overflow-hidden group border border-gray-200 bg-white">
            <img
              src="/banners/sweeper.png"
              alt="MineSweeper"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
              Instant
            </div>
            <div className="relative z-10 w-full bg-black/60 backdrop-blur-xs py-1.5 px-2 rounded-xl text-center">
              <span className="text-white text-xs font-bold tracking-wide">MineSweeper</span>
            </div>
          </div>

          {/* CARD 3: Crash */}
          <div className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between shadow-sm relative overflow-hidden group border border-gray-200 bg-white">
            <img
              src="/banners/Crash.png"
              alt="Crash"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
              100x Multi
            </div>
            <div className="relative z-10 w-full bg-black/60 backdrop-blur-xs py-1.5 px-2 rounded-xl text-center">
              <span className="text-white text-xs font-bold tracking-wide">Crash Game</span>
            </div>
          </div>

          {/* CARD 4: Andar Bahar */}
          <div className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between shadow-sm relative overflow-hidden group border border-gray-200 bg-white">
            <img
              src="/banners/Andar bahr.png"
              alt="Andar Bahar"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
              Live
            </div>
            <div className="relative z-10 w-full bg-black/60 backdrop-blur-xs py-1.5 px-2 rounded-xl text-center">
              <span className="text-white text-xs font-bold tracking-wide">Andar Bahar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;