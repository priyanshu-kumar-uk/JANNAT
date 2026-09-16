import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Color definitions based on parity rules
const getResultType = (num) => {
  if (num === 0) return { type: 'red-violet', colors: ['#fa3c1e', '#6855f4'], label: 'Red+Violet' };
  if (num === 5) return { type: 'green-violet', colors: ['#00c07f', '#6855f4'], label: 'Green+Violet' };
  if ([1, 3, 7, 9].includes(num)) return { type: 'green', colors: ['#00c07f'], label: 'Green' };
  if ([2, 4, 6, 8].includes(num)) return { type: 'red', colors: ['#fa3c1e'], label: 'Red' };
  return { type: 'unknown', colors: ['#43485c'], label: 'Pending' };
};

const initialHistory = [
  { period: 851, number: 8 },
  { period: 852, number: 8 },
  { period: 853, number: 5 },
  { period: 854, number: 8 },
  { period: 855, number: 7 },
  { period: 856, number: 9 },
  { period: 857, number: 2 },
  { period: 858, number: 6 },
  { period: 859, number: 9 },
  { period: 860, number: 0 },
  { period: 861, number: 9 },
  { period: 862, number: 6 },
  { period: 863, number: 7 },
  { period: 864, number: 9 },
  { period: 865, number: 3 },
  { period: 866, number: 9 },
  { period: 867, number: 3 },
  { period: 868, number: 2 },
  { period: 869, number: 2 },
  { period: 870, number: 5 },
  { period: 871, number: 6 },
  { period: 872, number: 3 },
];

const Parity = () => {
  const navigate = useNavigate();

  // Active game state
  const [period, setPeriod] = useState(2108231873);
  const [countdown, setCountdown] = useState(21); // Set to 21 initially to match screenshot "00:21"
  const [history, setHistory] = useState(initialHistory);
  const [activeTab, setActiveTab] = useState('record'); // 'continuous' | 'record' | 'probability'

  // User state
  const [balance, setBalance] = useState(1000);
  const [myBets, setMyBets] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [betModal, setBetModal] = useState(null); // { type: 'green' | 'violet' | 'red' | 'number', value?: number }
  const [contractMoney, setContractMoney] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [agreeRule, setAgreeRule] = useState(true);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // 30-second live cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Round complete! Resolve round
          const newNumber = Math.floor(Math.random() * 10);
          const finishedPeriodShort = Number(String(period).slice(-3));

          setHistory((old) => [...old, { period: finishedPeriodShort, number: newNumber }]);
          setPeriod((p) => p + 1);

          // Evaluate user bets for this round
          if (myBets.length > 0) {
            let totalWinnings = 0;
            myBets.forEach((bet) => {
              if (bet.period === period) {
                let won = false;
                let multiplier = 0;

                if (bet.type === 'green' && [1, 3, 7, 9].includes(newNumber)) {
                  won = true;
                  multiplier = 2;
                } else if (bet.type === 'green' && newNumber === 5) {
                  won = true;
                  multiplier = 1.5;
                } else if (bet.type === 'red' && [2, 4, 6, 8].includes(newNumber)) {
                  won = true;
                  multiplier = 2;
                } else if (bet.type === 'red' && newNumber === 0) {
                  won = true;
                  multiplier = 1.5;
                } else if (bet.type === 'violet' && [0, 5].includes(newNumber)) {
                  won = true;
                  multiplier = 4.5;
                } else if (bet.type === 'number' && bet.value === newNumber) {
                  won = true;
                  multiplier = 9;
                }

                if (won) {
                  const winAmt = Math.floor(bet.amount * multiplier * 0.98);
                  totalWinnings += winAmt;
                }
              }
            });

            if (totalWinnings > 0) {
              setBalance((b) => b + totalWinnings);
              showToast(`🎉 Period ${finishedPeriodShort} Result: ${newNumber}! You Won ₹${totalWinnings}`);
            } else {
              showToast(`Period ${finishedPeriodShort} Result: ${newNumber}`);
            }
          }

          return 30; // Reset to 30s
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [period, myBets]);

  const isLocked = countdown <= 5;

  // Format countdown into digits: MM:SS -> e.g. "00" and "21"
  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

  const openBetModal = (type, value = null) => {
    if (isLocked) {
      showToast('Betting locked for this round!');
      return;
    }
    setContractMoney(10);
    setQuantity(1);
    setAgreeRule(true);
    setBetModal({ type, value });
  };

  const handleConfirmBet = () => {
    if (!agreeRule) {
      showToast('Please agree to PRESALE RULE');
      return;
    }
    const totalAmount = contractMoney * quantity;
    if (balance < totalAmount) {
      showToast('Insufficient balance!');
      return;
    }

    setBalance((b) => b - totalAmount);
    setMyBets((prev) => [
      ...prev,
      {
        id: Date.now(),
        period,
        type: betModal.type,
        value: betModal.value,
        amount: totalAmount,
      },
    ]);

    showToast(`Order Placed for ₹${totalAmount}!`);
    setBetModal(null);
  };

  // Compute probability statistics
  const probStats = useMemo(() => {
    let redCount = 0;
    let greenCount = 0;
    let violetCount = 0;
    const numCounts = Array(10).fill(0);

    history.forEach((h) => {
      numCounts[h.number]++;
      if ([1, 3, 7, 9].includes(h.number)) greenCount++;
      else if ([2, 4, 6, 8].includes(h.number)) redCount++;
      else if (h.number === 0) {
        redCount += 0.5;
        violetCount += 0.5;
      } else if (h.number === 5) {
        greenCount += 0.5;
        violetCount += 0.5;
      }
    });

    const total = history.length || 1;
    return {
      redPct: Math.round((redCount / total) * 100),
      greenPct: Math.round((greenCount / total) * 100),
      violetPct: Math.round((violetCount / total) * 100),
      numCounts,
      total,
    };
  }, [history]);

  // Render badge helper for the record matrix
  const renderBadge = (item, isPending = false) => {
    if (isPending) {
      return (
        <div className="w-[27px] h-[27px] rounded-full bg-[#43485c] flex items-center justify-center shadow-xs text-white font-bold text-xs">
          ?
        </div>
      );
    }

    const { number } = item;
    if (number === 5) {
      return (
        <div
          className="w-[27px] h-[27px] rounded-full flex items-center justify-center shadow-xs text-white font-bold text-xs"
          style={{ background: 'linear-gradient(90deg, #00c07f 50%, #6855f4 50%)' }}
        >
          {number}
        </div>
      );
    }
    if (number === 0) {
      return (
        <div
          className="w-[27px] h-[27px] rounded-full flex items-center justify-center shadow-xs text-white font-bold text-xs"
          style={{ background: 'linear-gradient(90deg, #fa3c1e 50%, #6855f4 50%)' }}
        >
          {number}
        </div>
      );
    }
    if ([1, 3, 7, 9].includes(number)) {
      return (
        <div className="w-[27px] h-[27px] rounded-full bg-[#00c07f] flex items-center justify-center shadow-xs text-white font-bold text-xs">
          {number}
        </div>
      );
    }
    return (
      <div className="w-[27px] h-[27px] rounded-full bg-[#fa3c1e] flex items-center justify-center shadow-xs text-white font-bold text-xs">
        {number}
      </div>
    );
  };

  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-8 text-gray-800 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-all animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="w-full px-3.5 py-3 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-gray-700 hover:text-black active:scale-90 transition-transform cursor-pointer"
          aria-label="Go Back"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🚀</span>
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">Fast-Parity</h1>
          <span className="text-xl">🚀</span>
        </div>

        {/* Rule Button */}
        <button
          onClick={() => setShowRuleModal(true)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold">?</span>
          <span className="text-[13px] font-medium">Rule</span>
        </button>
      </div>

      {/* 2. Period & Count Down Section */}
      <div className="w-full px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Left: Period */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-normal">Period</span>
          <span className="text-[20px] font-bold text-gray-900 tracking-tight mt-0.5 leading-tight">
            {period}
          </span>
        </div>

        {/* Right: Count Down */}
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-xs font-normal">Count Down</span>
          <div className="flex items-center gap-1 mt-1 font-mono">
            {/* Minute Digits */}
            <div className="w-[18px] h-6 bg-[#f0f3fc] border border-[#e2e8f0] rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-red-500' : 'text-gray-900'}`}>{minutes[0]}</span>
            </div>
            <div className="w-[18px] h-6 bg-[#f0f3fc] border border-[#e2e8f0] rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-red-500' : 'text-gray-900'}`}>{minutes[1]}</span>
            </div>

            <span className="text-sm font-black text-gray-700 mx-0.5">:</span>

            {/* Second Digits */}
            <div className="w-[18px] h-6 bg-[#f0f3fc] border border-[#e2e8f0] rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>{seconds[0]}</span>
            </div>
            <div className="w-[18px] h-6 bg-[#f0f3fc] border border-[#e2e8f0] rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>{seconds[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Notice */}
      {isLocked && (
        <div className="w-full px-4 mb-1">
          <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-semibold py-1 px-2.5 rounded-lg text-center animate-pulse">
            ⏳ Bet window closed! Waiting for round result...
          </div>
        </div>
      )}

      {/* 3. Action Buttons (Join Green, Join Violet, Join Red) */}
      <div className="w-full px-4 mt-2 grid grid-cols-3 gap-2.5">
        {/* Button 1: Join Green */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => openBetModal('green')}
            disabled={isLocked}
            className={`w-full py-2.5 px-1 rounded-xl bg-[#00c07f] text-white flex flex-col items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer ${
              isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-105'
            }`}
          >
            {/* Rocket Icon */}
            <div className="flex items-center justify-center mb-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.35 22.35 0 0 1-3.95 2z" />
              </svg>
            </div>
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Green</span>
          </button>
          <span className="text-gray-400 text-xs mt-1 font-medium">1:2</span>
        </div>

        {/* Button 2: Join Violet */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => openBetModal('violet')}
            disabled={isLocked}
            className={`w-full py-2.5 px-1 rounded-xl bg-[#6855f4] text-white flex flex-col items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer ${
              isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-105'
            }`}
          >
            {/* Rocket Icon */}
            <div className="flex items-center justify-center mb-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.35 22.35 0 0 1-3.95 2z" />
              </svg>
            </div>
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Violet</span>
          </button>
          <span className="text-gray-400 text-xs mt-1 font-medium">1:4.5</span>
        </div>

        {/* Button 3: Join Red */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => openBetModal('red')}
            disabled={isLocked}
            className={`w-full py-2.5 px-1 rounded-xl bg-[#fa3c1e] text-white flex flex-col items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer ${
              isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-105'
            }`}
          >
            {/* Rocket Icon */}
            <div className="flex items-center justify-center mb-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.35 22.35 0 0 1-3.95 2z" />
              </svg>
            </div>
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Red</span>
          </button>
          <span className="text-gray-400 text-xs mt-1 font-medium">1:2</span>
        </div>
      </div>

      {/* 4. Number Grid (1 to 5, 6 to 0) */}
      <div className="w-full px-4 mt-3">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              onClick={() => openBetModal('number', num)}
              disabled={isLocked}
              className={`h-11 rounded-lg bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center relative overflow-hidden transition-all active:scale-95 ${
                isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-400 hover:shadow-sm cursor-pointer'
              }`}
            >
              {/* Subtle Lightning Icon behind number */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-gray-200 absolute" fill="currentColor">
                <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
              </svg>

              {/* Number Label */}
              <span className="relative z-10 text-lg font-bold text-gray-800">{num}</span>
            </button>
          ))}
        </div>

        {/* 1:9 Odds Label */}
        <div className="w-full text-center text-gray-400 text-xs font-medium mt-1.5">
          1:9
        </div>
      </div>

      {/* 5. Tabs (Continuous, Record, Probability) */}
      <div className="w-full mt-4 bg-white border-t border-gray-100 shadow-xs">
        <div className="flex items-center justify-around border-b border-gray-200/80">
          <button
            onClick={() => setActiveTab('continuous')}
            className={`flex-1 py-3 text-center text-[15px] cursor-pointer transition-colors relative ${
              activeTab === 'continuous' ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            Continuous
            {activeTab === 'continuous' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2.5px] bg-[#2196f3] rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 py-3 text-center text-[15px] cursor-pointer transition-colors relative ${
              activeTab === 'record' ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            Record
            {activeTab === 'record' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2.5px] bg-[#2196f3] rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('probability')}
            className={`flex-1 py-3 text-center text-[15px] cursor-pointer transition-colors relative ${
              activeTab === 'probability' ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            Probability
            {activeTab === 'probability' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2.5px] bg-[#2196f3] rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: FastParity Record (Exact match with screenshot) */}
      {activeTab === 'record' && (
        <div className="w-full px-4 pt-3.5 flex flex-col">
          {/* Header with Title & "more >" */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">FastParity Record</h2>
            <button
              onClick={() => setShowMoreModal(true)}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5 cursor-pointer"
            >
              more &gt;
            </button>
          </div>

          {/* 10-Column History Matrix */}
          <div className="grid grid-cols-10 gap-y-3.5 gap-x-1 items-start justify-items-center">
            {/* Render items in chronological chunks of 10 */}
            {history.map((item) => (
              <div key={item.period} className="flex flex-col items-center">
                <span className="text-[11px] font-normal text-gray-700 mb-1 leading-none">
                  {item.period}
                </span>
                {renderBadge(item)}
              </div>
            ))}

            {/* Current Active Round (Pending '?') */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-normal text-gray-700 mb-1 leading-none">
                {String(period).slice(-3)}
              </span>
              {renderBadge(null, true)}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Continuous (Streak tracker) */}
      {activeTab === 'continuous' && (
        <div className="w-full px-4 pt-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Continuous Streak Trends</h2>
          </div>

          <div className="space-y-3">
            {/* Green Summary */}
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#00c07f]" />
                <span className="text-xs font-bold text-emerald-900">Green Streak</span>
              </div>
              <span className="text-xs font-black text-emerald-700">Recent: 7 consecutive</span>
            </div>

            {/* Red Summary */}
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#fa3c1e]" />
                <span className="text-xs font-bold text-rose-900">Red Streak</span>
              </div>
              <span className="text-xs font-black text-rose-700">Recent: 2 consecutive</span>
            </div>

            {/* Violet Summary */}
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#6855f4]" />
                <span className="text-xs font-bold text-purple-900">Violet Occurrence</span>
              </div>
              <span className="text-xs font-black text-purple-700">Frequent on 0 & 5</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Probability */}
      {activeTab === 'probability' && (
        <div className="w-full px-4 pt-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Outcome Probability</h2>
          </div>

          {/* Color percentage bars */}
          <div className="space-y-2.5 mb-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#00c07f]">Green</span>
                <span>{probStats.greenPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00c07f] rounded-full" style={{ width: `${probStats.greenPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#fa3c1e]">Red</span>
                <span>{probStats.redPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#fa3c1e] rounded-full" style={{ width: `${probStats.redPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#6855f4]">Violet</span>
                <span>{probStats.violetPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#6855f4] rounded-full" style={{ width: `${probStats.violetPct}%` }} />
              </div>
            </div>
          </div>

          {/* Number frequency distribution (0-9) */}
          <span className="text-xs font-bold text-gray-700 mb-2">Number Frequency</span>
          <div className="grid grid-cols-10 gap-1 items-end h-20 pt-2 border-b border-gray-200">
            {probStats.numCounts.map((cnt, n) => {
              const maxCnt = Math.max(...probStats.numCounts, 1);
              const heightPct = Math.round((cnt / maxCnt) * 100);
              return (
                <div key={n} className="flex flex-col items-center h-full justify-end">
                  <span className="text-[10px] text-gray-400">{cnt}</span>
                  <div
                    className="w-4 bg-blue-500 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(heightPct, 10)}%` }}
                  />
                  <span className="text-[11px] font-bold text-gray-800 mt-1">{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Active Bets List for current round */}
      {myBets.filter((b) => b.period === period).length > 0 && (
        <div className="w-full px-4 mt-5">
          <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl">
            <span className="text-xs font-bold text-blue-900">Your Current Bets (Period {period}):</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {myBets
                .filter((b) => b.period === period)
                .map((b) => (
                  <span
                    key={b.id}
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-blue-300 text-blue-800 shadow-2xs"
                  >
                    {b.type === 'number' ? `Number ${b.value}` : b.type.toUpperCase()}: ₹{b.amount}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Contract Betting Bottom Sheet */}
      {betModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="w-full max-w-[410px] bg-white rounded-t-2xl p-4 shadow-2xl flex flex-col animate-slide-up">
            {/* Header with Title & Matching Theme Color */}
            <div
              className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-between mb-3.5 ${
                betModal.type === 'green'
                  ? 'bg-[#00c07f]'
                  : betModal.type === 'violet'
                  ? 'bg-[#6855f4]'
                  : betModal.type === 'red'
                  ? 'bg-[#fa3c1e]'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}
            >
              <span>
                {betModal.type === 'number'
                  ? `Select Number ${betModal.value}`
                  : `Select ${betModal.type.charAt(0).toUpperCase() + betModal.type.slice(1)}`}
              </span>
              <span className="text-xs opacity-90">
                Odds {betModal.type === 'violet' ? '1:4.5' : betModal.type === 'number' ? '1:9' : '1:2'}
              </span>
            </div>

            {/* Contract Money Buttons */}
            <div className="flex flex-col mb-3">
              <span className="text-xs font-semibold text-gray-600 mb-1.5">Contract Money</span>
              <div className="grid grid-cols-4 gap-2">
                {[10, 100, 1000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setContractMoney(amt)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      contractMoney === amt
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Number Multiplier Stepper */}
            <div className="flex flex-col mb-3">
              <span className="text-xs font-semibold text-gray-600 mb-1.5">Number</span>
              <div className="flex items-center justify-between">
                {/* Stepper */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-8 bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-black text-gray-600 active:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-12 h-8 flex items-center justify-center font-bold text-sm text-gray-800 bg-white border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-8 bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-black text-gray-600 active:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                {/* Quick Add Buttons */}
                <div className="flex gap-1.5">
                  {[1, 5, 10].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuantity(q)}
                      className={`px-2.5 py-1 text-xs font-bold rounded border cursor-pointer ${
                        quantity === q
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {q === 1 ? '1' : `+${q}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Contract Money */}
            <div className="py-2.5 px-3 bg-gray-50 rounded-xl mb-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">Total Contract Money:</span>
              <span className="font-extrabold text-base text-gray-900">₹{contractMoney * quantity}</span>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-center gap-2 mb-4 cursor-pointer text-xs text-gray-600 select-none">
              <input
                type="checkbox"
                checked={agreeRule}
                onChange={(e) => setAgreeRule(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600"
              />
              <span>I agree to <span className="text-blue-600 underline">PRESALE RULE</span></span>
            </label>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setBetModal(null)}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBet}
                className="py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Rules Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <h3 className="font-bold text-base text-gray-900">Fast-Parity Rule</h3>
              <button
                onClick={() => setShowRuleModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-600 space-y-2.5 leading-relaxed">
              <p>
                <strong className="text-gray-900">30 seconds 1 issue:</strong> 25 seconds to order, 5 seconds to show the lottery result. It opens all day. The total number of issues is 2880.
              </p>
              <p>
                <strong className="text-[#00c07f]">Join Green:</strong> If the result shows 1, 3, 7, 9, you will get (98 × 2) = 196. If the result shows 5, you will get (98 × 1.5) = 147.
              </p>
              <p>
                <strong className="text-[#fa3c1e]">Join Red:</strong> If the result shows 2, 4, 6, 8, you will get (98 × 2) = 196. If the result shows 0, you will get (98 × 1.5) = 147.
              </p>
              <p>
                <strong className="text-[#6855f4]">Join Violet:</strong> If the result shows 0 or 5, you will get (98 × 4.5) = 441.
              </p>
              <p>
                <strong className="text-blue-600">Select Number:</strong> If the result matches your chosen number, you will get (98 × 9) = 882.
              </p>
            </div>

            <button
              onClick={() => setShowRuleModal(false)}
              className="mt-5 w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer active:scale-95"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: More Records Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-2">
              <h3 className="font-bold text-base text-gray-900">FastParity Record History</h3>
              <button
                onClick={() => setShowMoreModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-semibold">
                    <th className="py-2">Period</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Number</th>
                    <th className="py-2 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history
                    .slice()
                    .reverse()
                    .map((row) => {
                      const res = getResultType(row.number);
                      return (
                        <tr key={row.period} className="hover:bg-gray-50">
                          <td className="py-2 text-gray-700 font-medium">{row.period}</td>
                          <td className="py-2 text-gray-500">{41200 + row.number * 3}</td>
                          <td className="py-2 font-bold text-gray-800">{row.number}</td>
                          <td className="py-2 text-right">
                            <span
                              className="inline-block w-4 h-4 rounded-full"
                              style={{
                                background:
                                  res.colors.length > 1
                                    ? `linear-gradient(90deg, ${res.colors[0]} 50%, ${res.colors[1]} 50%)`
                                    : res.colors[0],
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowMoreModal(false)}
              className="mt-3 w-full py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parity;