import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const GooglePayIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <svg viewBox="0 0 48 48" className="w-7 h-7">
      <path fill="#4285F4" d="M43.6 20.1H42V20H24v8h11.3C33.7 33.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#34A853" d="m6.3 14.7 6.6 4.8C14.7 15.6 19 12 24 12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.5 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#FBBC05" d="M24 44c5.2 0 10-1.9 13.6-5.2l-6.3-5.2c-2 1.4-4.5 2.4-7.3 2.4-5.3 0-9.7-3.5-11.3-8.2l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
      <path fill="#EA4335" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.4-2.2 4.4-4 5.8l6.3 5.2C41.2 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  </div>
);

const PaytmIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <div className="w-7 h-7 rounded-lg bg-[#002E6E] flex flex-col items-center justify-center p-0.5 shadow-xs">
      <span className="text-[8px] font-black text-white leading-none tracking-tighter">pay</span>
      <span className="text-[8px] font-black text-[#00B9F5] leading-none tracking-tighter">tm</span>
    </div>
  </div>
);

const PhonePeIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <div className="w-7 h-7 rounded-full bg-[#5F259F] flex items-center justify-center shadow-xs">
      <span className="text-white font-black text-xs font-serif leading-none">पे</span>
    </div>
  </div>
);

const Recharge = () => {
  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 text-black relative">
      {/* Header Bar */}
      <header className="w-full px-3.5 py-3 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-20">
        <Link to="/" className="p-1 -ml-1 text-black hover:text-blue-600 transition-colors">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <h1 className="text-base font-bold text-black tracking-tight uppercase">Recharge</h1>

        <button type="button" className="text-gray-500 hover:text-black">
          <HelpCircle size={18} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Wallet Balance Display */}
        <div className="w-full px-3.5 pt-3">
          <div className="w-full rounded-2xl bg-white p-4 text-black shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-[11px] font-semibold tracking-wider uppercase">
                Available Wallet Balance
              </span>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-black text-black tracking-tight">₹1,250.00</span>
                <span className="text-[11px] font-bold text-gray-500 ml-1.5">INR</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Zap size={20} />
            </div>
          </div>
        </div>

        {/* Quick Amount Selector */}
        <div className="w-full px-3.5 pt-4">
          <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[100, 250, 700, 3500, 10000, 50000].map((amt, idx) => (
              <button
                key={amt}
                type="button"
                className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  idx === 0
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-black hover:border-gray-400'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="w-full px-3.5 pt-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-black font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              defaultValue="100"
              placeholder="Enter recharge amount"
              className="w-full pl-8 pr-4 py-2.5 bg-gray-50 text-black font-bold text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Payment Channels */}
        <div className="w-full px-3.5 pt-4">
          <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-blue-600 bg-blue-50/40 cursor-pointer">
              <div className="flex items-center gap-3">
                <PhonePeIcon />
                <div>
                  <h4 className="text-xs font-bold text-black">PhonePe</h4>
                  <p className="text-[10px] text-gray-500">Instant UPI Transfer</p>
                </div>
              </div>
              <span className="w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <GooglePayIcon />
                <div>
                  <h4 className="text-xs font-bold text-black">Google Pay</h4>
                  <p className="text-[10px] text-gray-500">Fast Auto Approval</p>
                </div>
              </div>
              <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <PaytmIcon />
                <div>
                  <h4 className="text-xs font-bold text-black">Paytm UPI</h4>
                  <p className="text-[10px] text-gray-500">Direct Wallet / Bank</p>
                </div>
              </div>
              <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full px-3.5 pt-4">
          <button
            type="button"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            Recharge ₹100
          </button>
        </div>

        {/* Security & Instructions */}
        <div className="w-full px-3.5 pt-4">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1.5">
            <div className="flex items-center gap-2 text-black font-semibold">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>100% Safe & Secure Payments</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • After payment, points are credited automatically within 1-3 minutes.
            </p>
            <p className="text-[11px] leading-relaxed">
              • In case of delay, submit the 12-digit UTR/Ref number for instant credit.
            </p>
          </div>
        </div>

        {/* Recent Recharge Records */}
        <div className="w-full px-3.5 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Recent Recharges
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">History</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <div>
                  <span className="text-xs font-bold text-black">PhonePe</span>
                  <p className="text-[10px] text-gray-400">Today, 12:42 PM • RC99812401</p>
                </div>
              </div>
              <span className="text-xs font-black text-black font-mono">+₹100</span>
            </div>

            <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <div>
                  <span className="text-xs font-bold text-black">Google Pay</span>
                  <p className="text-[10px] text-gray-400">Yesterday, 06:15 PM • RC99812398</p>
                </div>
              </div>
              <span className="text-xs font-black text-black font-mono">+₹250</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recharge;