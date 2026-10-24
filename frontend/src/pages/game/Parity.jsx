import React from 'react';
import { Link } from 'react-router-dom';

const Parity = () => {
  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 text-black relative">
      {/* 1. Header Bar */}
      <div className="w-full px-3.5 py-3 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-20">
        <Link
          to="/"
          className="p-1 -ml-1 text-black hover:text-blue-600 active:scale-90 transition-transform"
          aria-label="Go Back"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <div className="flex items-center gap-1.5">
          <h1 className="text-base font-bold text-black tracking-tight uppercase">Fast-Parity</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-300 px-2 py-0.5 rounded-full shadow-xs">
            <span className="text-[10px] font-medium text-gray-500">₹</span>
            <span className="text-xs font-black text-black">1,250</span>
            <Link
              to="/recharge"
              className="ml-0.5 w-4 h-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-[10px] font-black active:scale-90"
              title="Recharge Balance"
            >
              +
            </Link>
          </div>

          <a
            href="#rule-section"
            className="flex items-center gap-1 text-black hover:text-blue-600 active:scale-95 transition-transform"
          >
            <span className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px] font-bold">?</span>
            <span className="text-[13px] font-medium">Rule</span>
          </a>
        </div>
      </div>

      {/* 2. Period & Count Down Section */}
      <div className="w-full px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-normal">Period</span>
          <span className="text-[20px] font-bold text-black tracking-tight mt-0.5 leading-tight font-mono">
            20261024342
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-xs font-normal">Count Down</span>
          <div className="flex items-center gap-1 mt-1 font-mono">
            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className="text-sm font-bold text-black">0</span>
            </div>
            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className="text-sm font-bold text-black">0</span>
            </div>
            <span className="text-sm font-black text-black mx-0.5">:</span>
            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className="text-sm font-bold text-black">2</span>
            </div>
            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className="text-sm font-bold text-black">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons (Join Green, Join Violet, Join Red) */}
      <div className="w-full px-4 mt-2 grid grid-cols-3 gap-2.5">
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="w-full py-2.5 px-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Green</span>
          </button>
          <span className="text-gray-500 text-xs mt-1 font-medium">1:2</span>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            className="w-full py-2.5 px-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Violet</span>
          </button>
          <span className="text-gray-500 text-xs mt-1 font-medium">1:4.5</span>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            className="w-full py-2.5 px-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Red</span>
          </button>
          <span className="text-gray-500 text-xs mt-1 font-medium">1:2</span>
        </div>
      </div>

      {/* 4. Number Grid (0 to 9) */}
      <div className="w-full px-4 mt-3">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              type="button"
              className="h-11 rounded-lg bg-white border border-gray-300 shadow-xs flex items-center justify-center relative transition-all active:scale-95 hover:border-blue-600 hover:text-blue-600 cursor-pointer"
            >
              <span className="text-lg font-bold text-black">{num}</span>
            </button>
          ))}
        </div>
        <div className="w-full text-center text-gray-500 text-xs font-medium mt-1.5">
          1:9
        </div>
      </div>

      {/* 5. Probability Section */}
      <div className="w-full px-4 pt-4 flex flex-col border-t border-gray-200 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-black tracking-tight">Outcome Probability (100 rounds)</h2>
          <span className="text-xs text-blue-600 font-semibold">Live Odds</span>
        </div>

        <div className="space-y-2.5 mb-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-emerald-700">Green</span>
              <span className="text-black font-bold">46%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '46%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-rose-700">Red</span>
              <span className="text-black font-bold">44%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '44%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-purple-700">Violet</span>
              <span className="text-black font-bold">10%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>

        <span className="text-xs font-bold text-black mb-2">Number Frequency</span>
        <div className="grid grid-cols-10 gap-1 items-end h-20 pt-2 border-b border-gray-200">
          {[12, 8, 11, 14, 7, 9, 13, 10, 8, 8].map((cnt, n) => (
            <div key={n} className="flex flex-col items-center h-full justify-end">
              <span className="text-[10px] text-gray-400">{cnt}</span>
              <div
                className="w-4 bg-blue-600 rounded-t-sm"
                style={{ height: `${Math.max(cnt * 5, 15)}%` }}
              />
              <span className="text-[11px] font-bold text-black mt-1">{n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FastParity Record */}
      <div className="w-full px-4 pt-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-black tracking-tight">FastParity Record</h2>
          <span className="text-xs text-blue-600 font-semibold">Recent</span>
        </div>

        <div className="grid grid-cols-10 gap-y-3.5 gap-x-1 items-start justify-items-center">
          {[
            { p: '341', n: 7, color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
            { p: '340', n: 2, color: 'border-rose-500 bg-rose-50 text-rose-700' },
            { p: '339', n: 3, color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
            { p: '338', n: 0, color: 'border-purple-500 bg-purple-50 text-purple-700' },
            { p: '337', n: 8, color: 'border-rose-500 bg-rose-50 text-rose-700' },
            { p: '336', n: 9, color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
            { p: '335', n: 6, color: 'border-rose-500 bg-rose-50 text-rose-700' },
            { p: '334', n: 5, color: 'border-purple-500 bg-purple-50 text-purple-700' },
            { p: '333', n: 1, color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
            { p: '332', n: 4, color: 'border-rose-500 bg-rose-50 text-rose-700' },
          ].map((item) => (
            <div key={item.p} className="flex flex-col items-center">
              <span className="text-[11px] font-normal text-gray-500 mb-1 leading-none font-mono">
                {item.p}
              </span>
              <div className={`w-7 h-7 rounded-full border ${item.color} flex items-center justify-center font-black text-xs shadow-xs`}>
                {item.n}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. My Orders Section */}
      <div className="w-full px-4 pt-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-black tracking-tight">My Recent Orders</h2>
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
            2 Total
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-black font-mono">
                  Period 20261024341
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  #9812
                </span>
              </div>
              <span className="text-[11px] font-bold border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-700">
                +₹19.60
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-t border-b border-gray-100 my-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500">Select:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-600 bg-emerald-50 text-emerald-700 uppercase">
                  Green
                </span>
              </div>
              <span className="text-xs font-bold text-black font-mono">
                ₹10.00
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
              <span>Today 04:02 PM</span>
              <span className="text-emerald-600 font-bold">Won</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-black font-mono">
                  Period 20261024340
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  #9809
                </span>
              </div>
              <span className="text-[11px] font-bold border border-rose-200 bg-rose-50 px-2 py-0.5 rounded-full text-rose-700">
                -₹50.00
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-t border-b border-gray-100 my-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500">Select:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-purple-600 bg-purple-50 text-purple-700 uppercase">
                  Violet
                </span>
              </div>
              <span className="text-xs font-bold text-black font-mono">
                ₹50.00
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
              <span>Today 03:59 PM</span>
              <span className="text-rose-600 font-bold">Lost</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Rules Section */}
      <div id="rule-section" className="mx-4 my-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-black space-y-2">
        <h4 className="font-bold text-sm text-black flex items-center gap-1.5">
          Fast-Parity Rules
        </h4>
        <p>• <strong>30 seconds 1 issue:</strong> 25 seconds to order, 5 seconds to show lottery result.</p>
        <p>• <strong>Join Green:</strong> 1, 3, 7, 9 pays 2x. 5 pays 1.5x.</p>
        <p>• <strong>Join Red:</strong> 2, 4, 6, 8 pays 2x. 0 pays 1.5x.</p>
        <p>• <strong>Join Violet:</strong> 0 or 5 pays 4.5x.</p>
        <p>• <strong>Select Number:</strong> Matching number pays 9x.</p>
      </div>
    </div>
  );
};

export default Parity;