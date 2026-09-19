import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultPopup from '../../components/games/ResultPopup';
import useParity from '../../hooks/useParity';

// Color definitions based on parity rules
const getResultType = (num) => {
  if (num === 0) return { type: 'red-violet', colors: ['#fa3c1e', '#6855f4'], label: 'Red+Violet' };
  if (num === 5) return { type: 'green-violet', colors: ['#00c07f', '#6855f4'], label: 'Green+Violet' };
  if ([1, 3, 7, 9].includes(num)) return { type: 'green', colors: ['#00c07f'], label: 'Green' };
  if ([2, 4, 6, 8].includes(num)) return { type: 'red', colors: ['#fa3c1e'], label: 'Red' };
  return { type: 'unknown', colors: ['#43485c'], label: 'Pending' };
};

const Parity = () => {
  const navigate = useNavigate();
  const prevPeriodRef = useRef(null);

  const {
    user,
    isAuthenticated,
    period,
    endTime,
    countdown,
    isLocked,
    history,
    activeTab,
    myBets,
    ordersList,
    ordersPage,
    totalOrdersPages,
    totalOrdersCount,
    ordersFilter,
    isLoadingOrders,
    isPlacingBet,
    betModal,
    contractMoney,
    quantity,
    agreeRule,
    showRuleModal,
    showMoreModal,
    resultPopupData,
    selectedOrderDetail,
    copiedOrderId,
    toastMessage,
    handleBet,
    handleFetchCurrentGame,
    handleFetchHistory,
    handleFetchMyBets,
    handleFetchOrdersList,
    handleCheckUnseenResults,
    handleCloseResultPopup,
    handleCopyOrderId,
    handleOpenBetModal,
    handleCloseBetModal,
    handleSetContractMoney,
    handleSetQuantity,
    handleSetAgreeRule,
    handleTabChange,
    handleFilterChange,
    handlePageChange,
    handleSetShowRuleModal,
    handleSetShowMoreModal,
    handleSelectOrderDetail,
    handleCountdownTick,
  } = useParity();

  const formatOrderTime = (dateStr) => {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  useEffect(() => {
    if (activeTab === 'myorders' && isAuthenticated) {
      handleFetchOrdersList(ordersPage, ordersFilter);
    }
  }, [activeTab, ordersPage, ordersFilter, isAuthenticated, handleFetchOrdersList]);

  /**
   * Initial data load on mount
   */
  useEffect(() => {
    handleFetchCurrentGame();
    handleFetchHistory();
    if (isAuthenticated) {
      handleFetchMyBets();
      handleCheckUnseenResults();
    }
  }, [handleFetchCurrentGame, handleFetchHistory, handleFetchMyBets, handleCheckUnseenResults, isAuthenticated]);

  /**
   * Smooth 1-second countdown ticker synchronized with backend endTime
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!endTime) return;

      const remainingMs = new Date(endTime).getTime() - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      handleCountdownTick(remainingSec);

      // When countdown expires (round finishes)
      if (remainingSec === 0) {
        // Wait 1.2s for backend settlement, then re-fetch
        setTimeout(() => {
          handleFetchCurrentGame();
          handleFetchHistory();
          if (isAuthenticated) {
            handleFetchMyBets();
            handleCheckUnseenResults();
            handleFetchOrdersList(ordersPage, ordersFilter);
          }
        }, 1200);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, handleCountdownTick, handleFetchCurrentGame, handleFetchHistory, handleFetchMyBets, handleCheckUnseenResults, handleFetchOrdersList, isAuthenticated, ordersPage, ordersFilter]);

  /**
   * Background sync heartbeat every 6 seconds to avoid time drift
   */
  useEffect(() => {
    const heartbeat = setInterval(() => {
      handleFetchCurrentGame();
    }, 6000);
    return () => clearInterval(heartbeat);
  }, [handleFetchCurrentGame]);

  /**
   * Detect period change to refresh user bets and history
   */
  useEffect(() => {
    if (period && prevPeriodRef.current && period !== prevPeriodRef.current) {
      handleFetchHistory();
      if (isAuthenticated) {
        handleFetchMyBets();
        handleCheckUnseenResults();
        handleFetchOrdersList(ordersPage, ordersFilter);
      }
    }
    prevPeriodRef.current = period;
  }, [period, handleFetchHistory, handleFetchMyBets, handleCheckUnseenResults, handleFetchOrdersList, isAuthenticated, ordersPage, ordersFilter]);

  // Format countdown into digits: MM:SS
  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

  // Compute probability statistics from live history
  const probStats = useMemo(() => {
    let redCount = 0;
    let greenCount = 0;
    let violetCount = 0;
    const numCounts = Array(10).fill(0);

    history.forEach((h) => {
      const num = h.resultNumber !== undefined ? h.resultNumber : h.number;
      if (num !== null && num !== undefined && num >= 0 && num <= 9) {
        numCounts[num]++;
        if ([1, 3, 7, 9].includes(num)) greenCount++;
        else if ([2, 4, 6, 8].includes(num)) redCount++;
        else if (num === 0) {
          redCount += 0.5;
          violetCount += 0.5;
        } else if (num === 5) {
          greenCount += 0.5;
          violetCount += 0.5;
        }
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

  // Compute streak analytics from live history
  const streakStats = useMemo(() => {
    let currentGreenStreak = 0;
    let currentRedStreak = 0;
    let violetOccurrences = 0;

    // History is chronological (oldest to newest), traverse from newest backwards
    for (let i = history.length - 1; i >= 0; i--) {
      const num = history[i].resultNumber !== undefined ? history[i].resultNumber : history[i].number;
      if (num === 0 || num === 5) violetOccurrences++;

      if ([1, 3, 7, 9, 5].includes(num)) {
        if (currentRedStreak === 0) currentGreenStreak++;
      }
      if ([2, 4, 6, 8, 0].includes(num)) {
        if (currentGreenStreak === 0) currentRedStreak++;
      }
    }

    return {
      greenStreak: currentGreenStreak || 1,
      redStreak: currentRedStreak || 1,
      violetCount: violetOccurrences,
    };
  }, [history]);

  // Render badge helper for user choice (Green, Red, Violet, or 0-9)
  const renderChoiceBadge = (choice, betType) => {
    const ch = String(choice || '').toLowerCase();
    if (betType === 'number' || (!isNaN(ch) && ch !== '')) {
      const num = Number(ch);
      const res = getResultType(num);
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-2xs"
          style={{
            background:
              res.colors.length > 1
                ? `linear-gradient(90deg, ${res.colors[0]} 50%, ${res.colors[1]} 50%)`
                : res.colors[0],
          }}
        >
          <span>Number {num}</span>
        </span>
      );
    }

    if (ch === 'green') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00c07f]/10 text-[#00a86b] border border-[#00c07f]/30">
          <span className="w-2 h-2 rounded-full bg-[#00c07f]" />
          <span>Green</span>
        </span>
      );
    }
    if (ch === 'red') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fa3c1e]/10 text-[#fa3c1e] border border-[#fa3c1e]/30">
          <span className="w-2 h-2 rounded-full bg-[#fa3c1e]" />
          <span>Red</span>
        </span>
      );
    }
    if (ch === 'violet') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6855f4]/10 text-[#6855f4] border border-[#6855f4]/30">
          <span className="w-2 h-2 rounded-full bg-[#6855f4]" />
          <span>Violet</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        {choice}
      </span>
    );
  };

  // Render badge helper for the record matrix
  const renderBadge = (item, isPending = false) => {
    if (isPending) {
      return (
        <div className="w-[27px] h-[27px] rounded-full bg-[#43485c] flex items-center justify-center shadow-xs text-white font-bold text-xs">
          ?
        </div>
      );
    }

    const number = item.resultNumber !== undefined ? item.resultNumber : item.number;
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

        {/* User Balance Capsule & Rule Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#f0f3fc] border border-[#dbe3f8] px-2 py-0.5 rounded-full">
            <span className="text-[10px] font-medium text-gray-500">₹</span>
            <span className="text-xs font-black text-gray-900">
              {user ? Number(user.walletBalance || 0).toLocaleString('en-IN') : '0'}
            </span>
            <button
              onClick={() => navigate('/recharge')}
              className="ml-0.5 w-3.5 h-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer active:scale-90"
              title="Recharge Balance"
            >
              +
            </button>
          </div>

          <button
            onClick={() => handleSetShowRuleModal(true)}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold">?</span>
            <span className="text-[13px] font-medium">Rule</span>
          </button>
        </div>
      </div>

      {/* 2. Period & Count Down Section */}
      <div className="w-full px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Left: Period */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-normal">Period</span>
          <span className="text-[20px] font-bold text-gray-900 tracking-tight mt-0.5 leading-tight">
            {period || '...'}
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
            onClick={() => handleOpenBetModal('green')}
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
            onClick={() => handleOpenBetModal('violet')}
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
            onClick={() => handleOpenBetModal('red')}
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
              onClick={() => handleOpenBetModal('number', num)}
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
            onClick={() => handleTabChange('probability')}
            className={`flex-1 py-3 text-center text-[15px] cursor-pointer transition-colors relative ${
              activeTab === 'probability' ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            Probability
            {activeTab === 'probability' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2.5px] bg-[#2196f3] rounded-t-full" />
            )}
          </button>


          <button
            onClick={() => handleTabChange('record')}
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
            onClick={() => handleTabChange('myorders')}
            className={`flex-1 py-3 text-center text-[15px] cursor-pointer transition-colors relative ${
              activeTab === 'myorders' ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >

            My Orders
            {activeTab === 'myorders' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2.5px] bg-[#2196f3] rounded-t-full" />
            )}
          </button>

       
        </div>
      </div>

      {/* TAB 1: FastParity Record */}
      {activeTab === 'record' && (
        <div className="w-full px-4 pt-3.5 flex flex-col">
          {/* Header with Title & "more >" */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">FastParity Record</h2>
            <button
              onClick={() => handleSetShowMoreModal(true)}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5 cursor-pointer"
            >
              more &gt;
            </button>
          </div>

          {/* 10-Column History Matrix */}
          <div className="grid grid-cols-10 gap-y-3.5 gap-x-1 items-start justify-items-center">
            {/* Render items from MongoDB history */}
            {history.map((item) => (
              <div key={item._id || item.period} className="flex flex-col items-center">
                <span className="text-[11px] font-normal text-gray-700 mb-1 leading-none">
                  {String(item.period).slice(-3)}
                </span>
                {renderBadge(item)}
              </div>
            ))}

            {/* Current Active Round (Pending '?') */}
            {period && (
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-normal text-gray-700 mb-1 leading-none">
                  {String(period).slice(-3)}
                </span>
                {renderBadge(null, true)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Continuous (Real Streak Tracker) */}
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
              <span className="text-xs font-black text-emerald-700">
                Recent: {streakStats.greenStreak} consecutive
              </span>
            </div>

            {/* Red Summary */}
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#fa3c1e]" />
                <span className="text-xs font-bold text-rose-900">Red Streak</span>
              </div>
              <span className="text-xs font-black text-rose-700">
                Recent: {streakStats.redStreak} consecutive
              </span>
            </div>

            {/* Violet Summary */}
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#6855f4]" />
                <span className="text-xs font-bold text-purple-900">Violet Occurrence</span>
              </div>
              <span className="text-xs font-black text-purple-700">
                {streakStats.violetCount} times in last {history.length} rounds
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Probability (Live Outcome Probability) */}
      {activeTab === 'probability' && (
        <div className="w-full px-4 pt-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Outcome Probability ({probStats.total} rounds)</h2>
          </div>

          {/* Color percentage bars */}
          <div className="space-y-2.5 mb-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#00c07f]">Green</span>
                <span>{probStats.greenPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00c07f] rounded-full transition-all duration-500" style={{ width: `${probStats.greenPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#fa3c1e]">Red</span>
                <span>{probStats.redPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#fa3c1e] rounded-full transition-all duration-500" style={{ width: `${probStats.redPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#6855f4]">Violet</span>
                <span>{probStats.violetPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#6855f4] rounded-full transition-all duration-500" style={{ width: `${probStats.violetPct}%` }} />
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

      {/* TAB 4: My Orders */}
      {activeTab === 'myorders' && (
        <div className="w-full pt-3.5 flex flex-col">
          {/* Header with Title & Refresh */}
          <div className="flex items-center justify-between mb-3 px-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Order History</h2>
              {isAuthenticated && totalOrdersCount > 0 && (
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {totalOrdersCount} Total
                </span>
              )}
            </div>
            {isAuthenticated && (
              <button
                onClick={() => handleFetchOrdersList(ordersPage, ordersFilter)}
                disabled={isLoadingOrders}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
                title="Refresh Orders"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 mb-3">
            <div className="flex bg-gray-100/90 p-1 rounded-xl gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Waiting' },
                { id: 'win', label: 'Won' },
                { id: 'lose', label: 'Lost' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id)}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    ordersFilter === tab.id
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unauthenticated Prompt */}
          {!isAuthenticated ? (
            <div className="px-4 py-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-blue-600 shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">Sign in to View Orders</h3>
              <p className="text-xs text-gray-400 max-w-[260px] mb-4">
                Track your live orders, bet history, and winning payouts in real time.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Log In Now
              </button>
            </div>
          ) : isLoadingOrders ? (
            /* Loading State */
            <div className="px-4 py-10 flex flex-col items-center justify-center gap-2 text-gray-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Loading your orders...</span>
            </div>
          ) : ordersList.length === 0 ? (
            /* Empty State */
            <div className="px-4 py-10 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-3 text-gray-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-700 mb-1">No Orders Found</h3>
              <p className="text-xs text-gray-400 max-w-[260px]">
                {ordersFilter === 'all'
                  ? 'You have not placed any bets yet. Choose Green, Red, Violet, or a number above to start!'
                  : `No orders found with status "${ordersFilter}".`}
              </p>
            </div>
          ) : (
            /* Orders List */
            <>
              <div className="px-4 space-y-2.5">
                {ordersList.map((order) => {
                  const isPending = order.result === 'PENDING';
                  const isWin = order.result === 'WIN';
                  const isLose = order.result === 'LOSE';

                  return (
                    <div
                      key={order._id || order.id}
                      onClick={() => handleSelectOrderDetail(order)}
                      className="bg-white border border-gray-200/80 hover:border-blue-300 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.99] relative overflow-hidden group"
                    >
                      {/* Top Row: Period & Status */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-extrabold text-gray-800 tracking-tight">
                            Period {order.period}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            #{String(order._id).slice(-4)}
                          </span>
                        </div>

                        {/* Status Badge */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Waiting
                          </span>
                        )}
                        {isWin && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            +₹{Number(order.winAmount || 0).toFixed(2)}
                          </span>
                        )}
                        {isLose && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            -₹{Number(order.amount || 0).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Middle Row: Selection Chip, Bet Details */}
                      <div className="flex items-center justify-between py-1.5 border-t border-b border-gray-100 my-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400 font-medium">Select:</span>
                          {renderChoiceBadge(order.choice, order.betType)}
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 leading-none mb-0.5">Contract</span>
                            <span className="text-xs font-bold text-gray-800 leading-none">
                              ₹{order.amount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Date & Detail Trigger */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                        <span>{formatOrderTime(order.createdAt)}</span>
                        <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 font-bold">
                          <span>Detail</span>
                          <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalOrdersPages > 1 && (
                <div className="flex items-center justify-between px-4 pt-3 pb-1 border-t border-gray-100 mt-3">
                  <button
                    onClick={() => handlePageChange(ordersPage - 1)}
                    disabled={ordersPage <= 1 || isLoadingOrders}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                  >
                    &lt; Prev
                  </button>
                  <span className="text-xs font-semibold text-gray-500">
                    Page {ordersPage} of {totalOrdersPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(ordersPage + 1)}
                    disabled={ordersPage >= totalOrdersPages || isLoadingOrders}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 6. Active Bets List for current round */}
      {period && myBets.filter((b) => b.period === period).length > 0 && (
        <div className="w-full px-4 mt-5">
          <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl">
            <span className="text-xs font-bold text-blue-900">Your Current Bets (Period {period}):</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {myBets
                .filter((b) => b.period === period)
                .map((b) => (
                  <span
                    key={b._id || b.id}
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white border border-blue-300 text-blue-800 shadow-2xs"
                  >
                    {b.betType === 'number' ? `Number ${b.choice}` : b.choice.toUpperCase()}: ₹{b.amount}
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

            {/* Available Balance Indicator */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2 px-1">
              <span>Available Wallet Balance:</span>
              <span className="font-extrabold text-blue-600">
                ₹{user ? Number(user.walletBalance || 0).toLocaleString('en-IN') : 0}
              </span>
            </div>

            {/* Contract Money Buttons */}
            <div className="flex flex-col mb-3">
              <span className="text-xs font-semibold text-gray-600 mb-1.5">Contract Money</span>
              <div className="grid grid-cols-4 gap-2">
                {[10, 100, 1000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleSetContractMoney(amt)}
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
              <span className="text-xs font-semibold text-gray-600 mb-1.5">Number (Multiplier)</span>
              <div className="flex items-center justify-between">
                {/* Stepper */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleSetQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-8 bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-black text-gray-600 active:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-12 h-8 flex items-center justify-center font-bold text-sm text-gray-800 bg-white border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleSetQuantity((q) => q + 1)}
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
                      onClick={() => handleSetQuantity(q)}
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
              <span className="text-gray-500">Total Bet Amount:</span>
              <span className="font-extrabold text-base text-gray-900">₹{contractMoney * quantity}</span>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-center gap-2 mb-4 cursor-pointer text-xs text-gray-600 select-none">
              <input
                type="checkbox"
                checked={agreeRule}
                onChange={(e) => handleSetAgreeRule(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600"
              />
              <span>I agree to <span className="text-blue-600 underline">PRESALE RULE</span></span>
            </label>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCloseBetModal}
                disabled={isPlacingBet}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleBet}
                disabled={isPlacingBet}
                className="py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
              >
                {isPlacingBet ? 'Placing Bet...' : 'Confirm'}
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
                onClick={() => handleSetShowRuleModal(false)}
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
              onClick={() => handleSetShowRuleModal(false)}
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
                onClick={() => handleSetShowMoreModal(false)}
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
                      const number = row.resultNumber !== undefined ? row.resultNumber : row.number;
                      const res = getResultType(number);
                      return (
                        <tr key={row._id || row.period} className="hover:bg-gray-50">
                          <td className="py-2 text-gray-700 font-medium">{row.period}</td>
                          <td className="py-2 text-gray-500">{row.price || (41200 + (number || 0) * 3)}</td>
                          <td className="py-2 font-bold text-gray-800">{number}</td>
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
              onClick={() => handleSetShowMoreModal(false)}
              className="mt-3 w-full py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Result Popup for Settled User Bets */}
      {resultPopupData && (
        <ResultPopup
          isOpen={Boolean(resultPopupData)}
          onClose={handleCloseResultPopup}
          isWin={resultPopupData.isWin}
          resultNumber={resultPopupData.resultNumber}
          period={resultPopupData.period}
          price={resultPopupData.price}
          select={resultPopupData.select}
          point={resultPopupData.point}
          amount={resultPopupData.amount}
        />
      )}

      {/* MODAL 5: Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in select-none">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <h3 className="font-bold text-base text-gray-900">Order Details</h3>
              </div>
              <button
                onClick={() => handleSelectOrderDetail(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Result Status Banner */}
            {selectedOrderDetail.result === 'WIN' && (
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl mb-3.5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-90 block">Status</span>
                    <span className="text-sm font-black">Congratulations! Won</span>
                  </div>
                </div>
                <span className="text-base font-black tracking-tight">
                  +₹{Number(selectedOrderDetail.winAmount || 0).toFixed(2)}
                </span>
              </div>
            )}

            {selectedOrderDetail.result === 'LOSE' && (
              <div className="p-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl mb-3.5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-base">
                    ✕
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-90 block">Status</span>
                    <span className="text-sm font-black">Settled: Failed</span>
                  </div>
                </div>
                <span className="text-base font-black tracking-tight">
                  -₹{Number(selectedOrderDetail.amount || 0).toFixed(2)}
                </span>
              </div>
            )}

            {selectedOrderDetail.result === 'PENDING' && (
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl mb-3.5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-90 block">Status</span>
                    <span className="text-sm font-bold">Waiting for Settlement</span>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-md">
                  In Progress
                </span>
              </div>
            )}

            {/* Detailed Specifications List */}
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Period</span>
                <span className="font-bold text-gray-800">{selectedOrderDetail.period}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Contract Money</span>
                <span className="font-semibold text-gray-700">₹{selectedOrderDetail.contractMoney}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Contract Multiplier</span>
                <span className="font-semibold text-gray-700">× {selectedOrderDetail.quantity}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Total Bet Amount</span>
                <span className="font-bold text-gray-900">₹{selectedOrderDetail.amount}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Delivery (Net 98%)</span>
                <span className="font-semibold text-gray-700">₹{(selectedOrderDetail.amount * 0.98).toFixed(2)}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Platform Fee (2%)</span>
                <span className="font-semibold text-gray-500">₹{(selectedOrderDetail.amount * 0.02).toFixed(2)}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Your Selection</span>
                <div>
                  {renderChoiceBadge(selectedOrderDetail.choice, selectedOrderDetail.betType)}
                </div>
              </div>

              {/* Opening Price & Result if settled */}
              {selectedOrderDetail.gameId && typeof selectedOrderDetail.gameId === 'object' && (
                <>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Open Price</span>
                    <span className="font-semibold text-gray-700">
                      {selectedOrderDetail.gameId.price ? `$${selectedOrderDetail.gameId.price}` : '--'}
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Result Number</span>
                    {selectedOrderDetail.gameId.resultNumber !== undefined && selectedOrderDetail.gameId.resultNumber !== null ? (
                      <div className="flex items-center gap-1.5">
                        {renderBadge({
                          resultNumber: selectedOrderDetail.gameId.resultNumber,
                        })}
                        <span className="font-bold text-gray-800">
                          ({(selectedOrderDetail.gameId.resultColors || []).join('+')})
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Pending...</span>
                    )}
                  </div>
                </>
              )}

              <div className="py-2 flex items-center justify-between">
                <span className="text-gray-400 font-medium">Order Time</span>
                <span className="font-medium text-gray-600">{formatOrderTime(selectedOrderDetail.createdAt)}</span>
              </div>

              <div className="py-2 flex items-center justify-between gap-2">
                <span className="text-gray-400 font-medium shrink-0">Order ID</span>
                <div className="flex items-center gap-1 overflow-hidden">
                  <span className="font-mono text-[11px] text-gray-500 truncate max-w-[170px]">
                    {selectedOrderDetail._id}
                  </span>
                  <button
                    onClick={() => handleCopyOrderId(selectedOrderDetail._id)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedOrderId === selectedOrderDetail._id ? (
                      <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => handleSelectOrderDetail(null)}
              className="mt-4 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer transition-colors active:scale-95"
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