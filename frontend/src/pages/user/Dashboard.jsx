import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ShieldCheck,
  Gift,
  CalendarCheck,
  TrendingUp,
  LogOut,
  ChevronRight,
  CreditCard,
  History,
  PhoneCall,
  Settings,
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 text-black relative">
      {/* Top Header */}
      <header className="w-full px-3.5 py-3 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-20">
        <Link to="/" className="p-1 -ml-1 text-black hover:text-blue-600 transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <h1 className="text-base font-bold text-black tracking-tight uppercase">My Account</h1>

        <Link to="/admin/recharge" className="text-xs font-semibold text-gray-400 hover:text-black">
          Admin
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* User Profile Card */}
        <div className="w-full px-3.5 pt-3">
          <div className="w-full rounded-2xl bg-white p-4 text-black shadow-xs border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                J
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-black">Jannat Player</h3>
                <p className="text-[11px] text-gray-500 font-mono">+91 98765 43210</p>
                <span className="inline-block mt-0.5 text-[9px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.2 rounded border border-blue-200">
                  ID: 88410294
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
              Verified
            </span>
          </div>
        </div>

        {/* Balance & Actions Card */}
        <div className="w-full px-3.5 pt-3">
          <div className="w-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-md">
            <span className="text-blue-100 text-[11px] font-semibold tracking-wider uppercase">
              Available Wallet Balance
            </span>
            <div className="flex items-baseline mt-1 mb-3">
              <span className="text-3xl font-black tracking-tight leading-none">
                ₹1,250.00
              </span>
              <span className="text-xs font-medium text-blue-200 ml-1.5">INR</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
              <Link
                to="/recharge"
                className="py-2 bg-white text-blue-600 font-bold text-xs rounded-xl shadow-xs text-center hover:bg-blue-50 transition-colors"
              >
                Recharge
              </Link>
              <button
                type="button"
                className="py-2 bg-blue-500/40 border border-white/20 text-white font-bold text-xs rounded-xl text-center hover:bg-blue-500/60 transition-colors cursor-pointer"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid 3 cols */}
        <div className="w-full px-3.5 py-3 grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-gray-500 block uppercase">Total Bets</span>
            <span className="text-sm font-black text-black font-mono">₹4,820</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-gray-500 block uppercase">Total Wins</span>
            <span className="text-sm font-black text-emerald-600 font-mono">₹6,150</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-gray-500 block uppercase">Commission</span>
            <span className="text-sm font-black text-blue-600 font-mono">₹1,420</span>
          </div>
        </div>

        {/* Management Links */}
        <div className="w-full px-3.5 space-y-2 mb-4">
          <Link
            to="/parity"
            className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-600 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <History size={16} />
              </div>
              <span className="text-xs font-bold text-black">Game Order Records</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </Link>

          <div className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <span className="text-xs font-bold text-black">Bank Card & UPI Setup</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          <div className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarCheck size={16} />
              </div>
              <span className="text-xs font-bold text-black">Daily Check-In Bonus</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Claim ₹10
            </span>
          </div>

          <div className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <PhoneCall size={16} />
              </div>
              <span className="text-xs font-bold text-black">24/7 Customer Support</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          <div className="w-full p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Settings size={16} />
              </div>
              <span className="text-xs font-bold text-black">Security & Password</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          {/* Logout Action */}
          <Link
            to="/login"
            className="w-full mt-3 p-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-black transition-colors"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
