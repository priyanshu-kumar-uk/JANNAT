import React from 'react';
import { Link } from 'react-router-dom';

const Invite = () => {
  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 text-black relative">
      {/* Top Header */}
      <header className="w-full px-3.5 py-3 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-20">
        <Link to="/" className="p-1 -ml-1 text-black hover:text-blue-600 transition-colors">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <div className="flex items-center gap-1.5">
          <h1 className="text-base font-bold text-black tracking-tight uppercase">Invite & Earn</h1>
        </div>

        <Link to="/account" className="text-xs font-bold text-blue-600 hover:underline">
          Privilege
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Agent Cash Balance Card */}
        <div className="w-full px-3.5 pt-3">
          <div className="w-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-blue-100 text-[11px] font-semibold tracking-wider uppercase">
                  Agent Cash Available
                </span>
                <div className="flex items-baseline mt-1">
                  <span className="text-3xl font-black tracking-tight leading-none">
                    ₹74.45
                  </span>
                  <span className="text-xs font-medium text-blue-200 ml-1.5">INR</span>
                </div>
                <p className="text-[11px] text-blue-100 mt-1">3-Level Lifetime Commission</p>
              </div>

              <Link
                to="/account"
                className="px-4 py-2 bg-white text-blue-600 font-bold text-xs rounded-full shadow-sm hover:bg-blue-50 active:scale-95 transition-all text-center"
              >
                Withdraw
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats 2x2 */}
        <div className="w-full px-3.5 py-3 grid grid-cols-2 gap-2.5">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
            <span className="text-[10px] text-gray-500 font-semibold uppercase">Invited Today</span>
            <div className="text-xl font-black text-black mt-0.5 font-mono">0</div>
            <span className="text-[10px] text-gray-400">Total: 14 agents</span>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
            <span className="text-[10px] text-gray-500 font-semibold uppercase">Today's Income</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5 font-mono">₹0.00</div>
            <span className="text-[10px] text-gray-400">Total: ₹1,420.50</span>
          </div>
        </div>

        {/* Referral Link & Code Card */}
        <div className="w-full px-3.5 mb-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black uppercase tracking-wider">Your Referral Code</span>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-mono tracking-widest">
                Z6A48Q
              </span>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-semibold uppercase block mb-1">Exclusive Invitation Link</label>
              <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <input
                  type="text"
                  readOnly
                  value="https://jannat.game/#/RG?invitation=Z6A48Q"
                  className="flex-1 bg-transparent text-xs text-black font-mono focus:outline-none truncate"
                />
                <button
                  type="button"
                  className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button type="button" className="py-2 px-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <span>WhatsApp</span>
              </button>
              <button type="button" className="py-2 px-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Telegram</span>
              </button>
              <button type="button" className="py-2 px-2 bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <span>QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Agent Growth Plan Section */}
        <div className="w-full px-3.5 mb-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">Agent Growth Plan</h3>
              <span className="text-[11px] text-blue-600 font-semibold">Bonus ₹10 Lakh+</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold text-black">Stage 1 (1 Invite)</p>
                    <p className="text-[10px] text-gray-500">Bonus ₹10</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Claimed</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold text-black">Stage 2 (5 Invites)</p>
                    <p className="text-[10px] text-gray-500">Bonus ₹50</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Claimed</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/50 border border-blue-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">3</span>
                  <div>
                    <p className="font-bold text-black">Stage 3 (20 Invites)</p>
                    <p className="text-[10px] text-blue-600">Progress: 14/20</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-300">₹300 Reward</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs opacity-60">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 font-black text-[10px] flex items-center justify-center">4</span>
                  <div>
                    <p className="font-bold text-black">Stage 4 (50 Invites)</p>
                    <p className="text-[10px] text-gray-500">Bonus ₹1,500</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gray-400">Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Records List */}
        <div className="w-full px-3.5 mb-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">Recent Commissions</h3>
              <span className="text-[11px] text-gray-400 font-mono">Live</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
                <div>
                  <span className="font-bold text-black">Level 1 Direct Order</span>
                  <p className="text-[10px] text-gray-400 font-mono">User: 7741029 • 04:02 PM</p>
                </div>
                <span className="font-bold text-emerald-600">+₹1.50</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 text-xs">
                <div>
                  <span className="font-bold text-black">Level 2 Sub Order</span>
                  <p className="text-[10px] text-gray-400 font-mono">User: 8819230 • 03:48 PM</p>
                </div>
                <span className="font-bold text-emerald-600">+₹0.60</span>
              </div>

              <div className="flex items-center justify-between py-1.5 text-xs">
                <div>
                  <span className="font-bold text-black">Level 3 Sub Order</span>
                  <p className="text-[10px] text-gray-400 font-mono">User: 9685140 • 03:15 PM</p>
                </div>
                <span className="font-bold text-emerald-600">+₹0.30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Leaderboard */}
        <div className="w-full px-3.5 mb-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Top Agent Leaderboard</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center">1</span>
                  <span className="font-mono font-bold text-black">98***410</span>
                </div>
                <span className="font-black text-amber-700 font-mono">₹98,420.50</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-black font-black text-xs flex items-center justify-center">2</span>
                  <span className="font-mono font-bold text-black">91***209</span>
                </div>
                <span className="font-black text-black font-mono">₹64,110.00</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center">3</span>
                  <span className="font-mono font-bold text-black">87***991</span>
                </div>
                <span className="font-black text-black font-mono">₹42,850.25</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Invite;