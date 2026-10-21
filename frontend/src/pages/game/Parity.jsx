import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultPopup from '../../components/games/ResultPopup';
import useParity from '../../hooks/useParity';

// Parity result determination
const getResultType = (num) => {
  if (num === 0) return { type: 'red-violet', label: 'Red+Violet' };
  if (num === 5) return { type: 'green-violet', label: 'Green+Violet' };
  if ([1, 3, 7, 9].includes(num)) return { type: 'green', label: 'Green' };
  if ([2, 4, 6, 8].includes(num)) return { type: 'red', label: 'Red' };
  return { type: 'unknown', label: 'Pending' };
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

  useEffect(() => {
    handleFetchCurrentGame();
    handleFetchHistory();
    if (isAuthenticated) {
      handleFetchMyBets();
      handleCheckUnseenResults();
    }
  }, [handleFetchCurrentGame, handleFetchHistory, handleFetchMyBets, handleCheckUnseenResults, isAuthenticated]);

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      handleCountdownTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, handleCountdownTick]);

  useEffect(() => {
    if (prevPeriodRef.current && period && prevPeriodRef.current !== period) {
      handleFetchHistory();
      if (isAuthenticated) {
        handleFetchMyBets();
        handleCheckUnseenResults();
        if (activeTab === 'myorders') {
          handleFetchOrdersList(ordersPage, ordersFilter);
        }
      }
    }
    prevPeriodRef.current = period;
  }, [period, handleFetchHistory, handleFetchMyBets, handleCheckUnseenResults, handleFetchOrdersList, isAuthenticated, ordersPage, ordersFilter, activeTab]);

  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

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

  const streakStats = useMemo(() => {
    let currentGreenStreak = 0;
    let currentRedStreak = 0;
    let violetOccurrences = 0;

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

  const renderChoiceBadge = (choice, betType) => {
    const ch = String(choice || '').toLowerCase();
    if (betType === 'number' || (!isNaN(ch) && ch !== '')) {
      const num = Number(ch);
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-black bg-white text-black">
          Number {num}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border border-blue-600 bg-blue-50 text-blue-600 uppercase">
        {choice}
      </span>
    );
  };

  const renderBadge = (item, isPending = false) => {
    if (isPending) {
      return (
        <div className="w-7 h-7 rounded-full border border-gray-300 bg-white flex items-center justify-center text-black font-bold text-xs">
          ?
        </div>
      );
    }
    const number = item.resultNumber !== undefined ? item.resultNumber : item.number;
    return (
      <div className="w-7 h-7 rounded-full border border-black bg-white flex items-center justify-center text-black font-black text-xs shadow-xs">
        {number}
      </div>
    );
  };

  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-8 text-black relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-800 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* 1. Header Bar */}
      <div className="w-full px-3.5 py-3 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-black hover:text-blue-600 active:scale-90 transition-transform cursor-pointer"
          aria-label="Go Back"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5">
          <h1 className="text-base font-bold text-black tracking-tight uppercase">Fast-Parity</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-300 px-2 py-0.5 rounded-full shadow-xs">
            <span className="text-[10px] font-medium text-gray-500">₹</span>
            <span className="text-xs font-black text-black">
              {user ? Number(user.walletBalance || 0).toLocaleString('en-IN') : '0'}
            </span>
            <button
              onClick={() => navigate('/recharge')}
              className="ml-0.5 w-4 h-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer active:scale-90"
              title="Recharge Balance"
            >
              +
            </button>
          </div>

          <button
            onClick={() => handleSetShowRuleModal(true)}
            className="flex items-center gap-1 text-black hover:text-blue-600 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px] font-bold">?</span>
            <span className="text-[13px] font-medium">Rule</span>
          </button>
        </div>
      </div>

      {/* 2. Period & Count Down Section */}
      <div className="w-full px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs font-normal">Period</span>
          <span className="text-[20px] font-bold text-black tracking-tight mt-0.5 leading-tight font-mono">
            {period || '...'}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-xs font-normal">Count Down</span>
          <div className="flex items-center gap-1 mt-1 font-mono">
            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-black font-black animate-pulse' : 'text-black'}`}>{minutes[0]}</span>
            </div>
            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-black font-black animate-pulse' : 'text-black'}`}>{minutes[1]}</span>
            </div>

            <span className="text-sm font-black text-black mx-0.5">:</span>

            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-black font-black animate-pulse' : 'text-black'}`}>{seconds[0]}</span>
            </div>
            <div className="w-[18px] h-6 bg-white border border-gray-300 rounded flex items-center justify-center shadow-xs">
              <span className={`text-sm font-bold ${isLocked ? 'text-black font-black animate-pulse' : 'text-black'}`}>{seconds[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Notice */}
      {isLocked && (
        <div className="w-full px-4 mb-1">
          <div className="bg-gray-100 border border-gray-300 text-black text-[11px] font-semibold py-1 px-2.5 rounded-lg text-center">
            Bet window closed! Waiting for round result...
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
            className={`w-full py-2.5 px-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer ${
              isLocked ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Green</span>
          </button>
          <span className="text-gray-500 text-xs mt-1 font-medium">1:2</span>
        </div>

        {/* Button 2: Join Violet */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleOpenBetModal('violet')}
            disabled={isLocked}
            className={`w-full py-2.5 px-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer ${
              isLocked ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <span className="font-bold text-[13px] tracking-tight leading-tight">Join Violet</span>
          </button>
          <span className="text-gray-500 text-xs mt-1 font-medium">1:4.5</span>
        </div>

        {/* Button 3: Join Red */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleOpenBetModal('red')}
            disabled={isLocked}
            className={`w-full py-2.5 px-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer ${
              isLocked ? 'opacity-60 cursor-not-allowed' : ''
            }`}
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
              onClick={() => handleOpenBetModal('number', num)}
              disabled={isLocked}
              className={`h-11 rounded-lg bg-white border border-gray-300 shadow-xs flex items-center justify-center relative transition-all active:scale-95 ${
                isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-600 hover:text-blue-600 cursor-pointer'
              }`}
            >
              <span className="text-lg font-bold text-black">{num}</span>
            </button>
          ))}
        </div>
        <div className="w-full text-center text-gray-500 text-xs font-medium mt-1.5">
          1:9
        </div>
      </div>

      {/* 5. Tabs */}
      <div className="w-full mt-4 bg-white border-t border-gray-200 shadow-xs">
        <div className="flex items-center justify-around border-b border-gray-200">
          <button
            onClick={() => handleTabChange('probability')}
            className={`flex-1 py-3 text-center text-sm cursor-pointer transition-colors relative ${
              activeTab === 'probability' ? 'text-black font-bold' : 'text-gray-500 font-medium hover:text-black'
            }`}
          >
            Probability
            {activeTab === 'probability' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('record')}
            className={`flex-1 py-3 text-center text-sm cursor-pointer transition-colors relative ${
              activeTab === 'record' ? 'text-black font-bold' : 'text-gray-500 font-medium hover:text-black'
            }`}
          >
            Record
            {activeTab === 'record' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => handleTabChange('myorders')}
            className={`flex-1 py-3 text-center text-sm cursor-pointer transition-colors relative ${
              activeTab === 'myorders' ? 'text-black font-bold' : 'text-gray-500 font-medium hover:text-black'
            }`}
          >
            My Orders
            {activeTab === 'myorders' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* TAB: FastParity Record */}
      {activeTab === 'record' && (
        <div className="w-full px-4 pt-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-black tracking-tight">FastParity Record</h2>
            <button
              onClick={() => handleSetShowMoreModal(true)}
              className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              more &gt;
            </button>
          </div>

          <div className="grid grid-cols-10 gap-y-3.5 gap-x-1 items-start justify-items-center">
            {history.map((item) => (
              <div key={item._id || item.period} className="flex flex-col items-center">
                <span className="text-[11px] font-normal text-gray-500 mb-1 leading-none font-mono">
                  {String(item.period).slice(-3)}
                </span>
                {renderBadge(item)}
              </div>
            ))}

            {period && (
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-normal text-gray-500 mb-1 leading-none font-mono">
                  {String(period).slice(-3)}
                </span>
                {renderBadge(null, true)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Probability */}
      {activeTab === 'probability' && (
        <div className="w-full px-4 pt-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-black tracking-tight">Outcome Probability ({probStats.total} rounds)</h2>
          </div>

          <div className="space-y-2.5 mb-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-black">Green</span>
                <span className="text-black font-bold">{probStats.greenPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${probStats.greenPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-black">Red</span>
                <span className="text-black font-bold">{probStats.redPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${probStats.redPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-black">Violet</span>
                <span className="text-black font-bold">{probStats.violetPct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${probStats.violetPct}%` }} />
              </div>
            </div>
          </div>

          <span className="text-xs font-bold text-black mb-2">Number Frequency</span>
          <div className="grid grid-cols-10 gap-1 items-end h-20 pt-2 border-b border-gray-200">
            {probStats.numCounts.map((cnt, n) => {
              const maxCnt = Math.max(...probStats.numCounts, 1);
              const heightPct = Math.round((cnt / maxCnt) * 100);
              return (
                <div key={n} className="flex flex-col items-center h-full justify-end">
                  <span className="text-[10px] text-gray-400">{cnt}</span>
                  <div
                    className="w-4 bg-blue-600 rounded-t-sm"
                    style={{ height: `${Math.max(heightPct, 10)}%` }}
                  />
                  <span className="text-[11px] font-bold text-black mt-1">{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: My Orders */}
      {activeTab === 'myorders' && (
        <div className="w-full pt-3.5 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-black tracking-tight">Order History</h2>
              {isAuthenticated && totalOrdersCount > 0 && (
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  {totalOrdersCount} Total
                </span>
              )}
            </div>
            {isAuthenticated && (
              <button
                onClick={() => handleFetchOrdersList(ordersPage, ordersFilter)}
                disabled={isLoadingOrders}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Refresh
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 mb-3">
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
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
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="px-4 py-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold text-black mb-1">Sign in to View Orders</h3>
              <p className="text-xs text-gray-500 max-w-[260px] mb-4">
                Track your live orders and payouts.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Log In Now
              </button>
            </div>
          ) : isLoadingOrders ? (
            <div className="px-4 py-10 flex flex-col items-center justify-center gap-2 text-gray-500">
              <span className="text-xs">Loading orders...</span>
            </div>
          ) : ordersList.length === 0 ? (
            <div className="px-4 py-10 flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-bold text-black mb-1">No Orders Found</h3>
              <p className="text-xs text-gray-500 max-w-[260px]">
                {ordersFilter === 'all'
                  ? 'No bets placed yet in this session.'
                  : `No orders found with status "${ordersFilter}".`}
              </p>
            </div>
          ) : (
            <div className="px-4 space-y-2.5">
              {ordersList.map((order) => {
                const isPending = order.result === 'PENDING';
                const isWin = order.result === 'WIN';
                const isLose = order.result === 'LOSE';

                return (
                  <div
                    key={order._id || order.id}
                    onClick={() => handleSelectOrderDetail(order)}
                    className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs transition-all cursor-pointer hover:border-blue-600 relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-black">
                          Period {order.period}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          #{String(order._id).slice(-4)}
                        </span>
                      </div>

                      <span className="text-[11px] font-bold border border-gray-200 px-2 py-0.5 rounded-full text-black">
                        {isPending ? 'Waiting' : isWin ? `+₹${Number(order.winAmount || 0).toFixed(2)}` : `-₹${Number(order.amount || 0).toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-t border-b border-gray-100 my-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500">Select:</span>
                        {renderChoiceBadge(order.choice, order.betType)}
                      </div>
                      <span className="text-xs font-bold text-black font-mono">
                        ₹{order.amount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                      <span>{formatOrderTime(order.createdAt)}</span>
                      <span className="text-blue-600 font-bold">Detail &gt;</span>
                    </div>
                  </div>
                );
              })}

              {totalOrdersPages > 1 && (
                <div className="flex items-center justify-between px-4 pt-3 pb-1 border-t border-gray-200 mt-3">
                  <button
                    onClick={() => handlePageChange(ordersPage - 1)}
                    disabled={ordersPage <= 1 || isLoadingOrders}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 text-black hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    &lt; Prev
                  </button>
                  <span className="text-xs font-semibold text-gray-500">
                    Page {ordersPage} of {totalOrdersPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(ordersPage + 1)}
                    disabled={ordersPage >= totalOrdersPages || isLoadingOrders}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 text-black hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Bet Sheet */}
      {betModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-[410px] bg-white rounded-t-2xl p-4 shadow-2xl border-t border-gray-200 flex flex-col">
            <div className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-between mb-3.5">
              <span>
                {betModal.type === 'number'
                  ? `Select Number ${betModal.value}`
                  : `Select ${betModal.type.charAt(0).toUpperCase() + betModal.type.slice(1)}`}
              </span>
              <span className="text-xs">
                Odds {betModal.type === 'violet' ? '1:4.5' : betModal.type === 'number' ? '1:9' : '1:2'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-2 px-1">
              <span>Available Wallet Balance:</span>
              <span className="font-bold text-black font-mono">
                ₹{user ? Number(user.walletBalance || 0).toLocaleString('en-IN') : 0}
              </span>
            </div>

            <div className="flex flex-col mb-3">
              <span className="text-xs font-semibold text-black mb-1.5">Contract Money</span>
              <div className="grid grid-cols-4 gap-2">
                {[10, 100, 1000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleSetContractMoney(amt)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      contractMoney === amt
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col mb-3">
              <span className="text-xs font-semibold text-black mb-1.5">Number (Multiplier)</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleSetQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-black cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 h-8 flex items-center justify-center font-bold text-sm text-black bg-white border-x border-gray-300 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleSetQuantity((q) => q + 1)}
                    className="w-9 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-black cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex gap-1.5">
                  {[1, 5, 10].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSetQuantity(q)}
                      className={`px-2.5 py-1 text-xs font-bold rounded border cursor-pointer ${
                        quantity === q
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-gray-300 text-black hover:bg-gray-50'
                      }`}
                    >
                      {q === 1 ? '1' : `+${q}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl mb-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">Total Bet Amount:</span>
              <span className="font-black text-base text-black font-mono">₹{contractMoney * quantity}</span>
            </div>

            <label className="flex items-center gap-2 mb-4 cursor-pointer text-xs text-black select-none">
              <input
                type="checkbox"
                checked={agreeRule}
                onChange={(e) => handleSetAgreeRule(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded accent-blue-600"
              />
              <span>I agree to <span className="text-blue-600 underline">PRESALE RULE</span></span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCloseBetModal}
                disabled={isPlacingBet}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBet}
                disabled={isPlacingBet}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isPlacingBet ? 'Placing Bet...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Rules Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-3">
              <h3 className="font-bold text-base text-black">Fast-Parity Rules</h3>
              <button
                onClick={() => handleSetShowRuleModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-black space-y-2.5 leading-relaxed">
              <p>
                <strong>30 seconds 1 issue:</strong> 25 seconds to order, 5 seconds to show lottery result.
              </p>
              <p>
                <strong>Join Green:</strong> 1, 3, 7, 9 pays 2x. 5 pays 1.5x.
              </p>
              <p>
                <strong>Join Red:</strong> 2, 4, 6, 8 pays 2x. 0 pays 1.5x.
              </p>
              <p>
                <strong>Join Violet:</strong> 0 or 5 pays 4.5x.
              </p>
              <p>
                <strong>Select Number:</strong> Matching number pays 9x.
              </p>
            </div>

            <button
              onClick={() => handleSetShowRuleModal(false)}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: More Records Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl border border-gray-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-2">
              <h3 className="font-bold text-base text-black">FastParity Record History</h3>
              <button
                onClick={() => handleSetShowMoreModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-xs text-left text-black">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                    <th className="py-2">Period</th>
                    <th className="py-2">Price</th>
                    <th className="py-2 text-right">Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {history
                    .slice()
                    .reverse()
                    .map((row) => {
                      const number = row.resultNumber !== undefined ? row.resultNumber : row.number;
                      return (
                        <tr key={row._id || row.period} className="hover:bg-gray-50">
                          <td className="py-2 font-medium">{row.period}</td>
                          <td className="py-2 text-gray-500">{row.price || (41200 + (number || 0) * 3)}</td>
                          <td className="py-2 text-right font-bold">{number}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => handleSetShowMoreModal(false)}
              className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <h3 className="font-bold text-base text-black">Order Details</h3>
              <button
                onClick={() => handleSelectOrderDetail(null)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono font-bold">{selectedOrderDetail._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Period:</span>
                <span className="font-mono font-bold">{selectedOrderDetail.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Contract Amount:</span>
                <span className="font-bold font-mono">₹{selectedOrderDetail.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Selection:</span>
                <span className="font-bold uppercase">{selectedOrderDetail.choice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold">{selectedOrderDetail.result}</span>
              </div>
            </div>

            <button
              onClick={() => handleSelectOrderDetail(null)}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
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