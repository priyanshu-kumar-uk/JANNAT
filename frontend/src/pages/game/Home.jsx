import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  ShieldCheck,
  Wallet,
  X,
  Lock,
  Sparkles,
  Flame,
  ArrowRight,
  Gift,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  // Live winner announcement ticker feed
  const winnersList = [
    { user: '****819', amount: '₹6,000', game: 'Parity' },
    { user: '****352', amount: '₹12,400', game: 'Fast-Parity' },
    { user: '****904', amount: '₹3,500', game: 'MineSweeper' },
    { user: '****118', amount: '₹8,200', game: 'Crash' },
    { user: '****627', amount: '₹15,000', game: 'Andar Bahar' },
    { user: '****445', amount: '₹22,500', game: 'Fast-Parity' },
  ];

  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Winner ticker interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinnerIndex((prev) => (prev + 1) % winnersList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [winnersList.length]);

  // Show Auth popup automatically on initial page visit if not authenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        setAuthModalReason('Join Jannat to play thrilling games & win real cash rewards!');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isAuthenticated]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  /**
   * Guarded Action Handler
   * Intercepts any click or feature access for unauthenticated users
   */
  const handleGuardedAction = (featureName, callback) => {
    if (!isAuthenticated) {
      setAuthModalReason(`Please Login to access ${featureName}`);
      setShowAuthModal(true);
      return;
    }

    if (callback) {
      callback();
    } else {
      showToast(`${featureName} clicked`);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser());
      setShowProfileModal(false);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const currentWinner = winnersList[currentWinnerIndex];

  // User display helpers
  const displayBalance = isAuthenticated ? (user?.walletBalance ?? 0).toFixed(2) : '0.00';
  const displayId = isAuthenticated ? (user?.mobileNumber || user?._id?.slice(-8)) : 'Guest User';
  const displayName = isAuthenticated ? (user?.fullName || 'Jannat Player') : 'Guest';

  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 relative text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-800 flex items-center gap-2">
          <Sparkles size={14} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. AUTHENTICATION REQUIRED MODAL                                          */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Top Banner */}
            <div className="relative bg-white border-b border-gray-100 p-5 text-center text-black">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-black transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="w-14 h-14 mx-auto rounded-2xl bg-white p-1.5 shadow-sm border border-gray-200 mb-2.5 flex items-center justify-center">
                <img
                  src="/logo/Jannat-Logo.png"
                  alt="Jannat Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-lg font-bold tracking-tight text-black">
                Welcome to Jannat
              </h2>
              <p className="text-[12px] text-gray-600 mt-1 max-w-[240px] mx-auto leading-relaxed">
                {authModalReason || 'Login or Create Account to start playing & withdraw instantly.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="p-4 space-y-2.5 bg-white">
              {/* Login Button */}
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Login to Account</span>
                <ArrowRight size={14} />
              </button>

              {/* Register Button */}
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/register');
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Gift size={14} />
                <span>Create New Account</span>
              </button>

              {/* Browse as guest */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-1.5 text-center text-[11px] font-semibold text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                Continue Previewing Games
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. USER PROFILE & LOGOUT MODAL                                            */}
      {/* ========================================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 text-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-black">{displayName}</h3>
                  <p className="text-[11px] text-gray-500 font-mono">{user?.mobileNumber || 'Member'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-black cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 bg-white">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Wallet size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Wallet Balance</span>
                </div>
                <span className="text-sm font-black text-black">₹{displayBalance}</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Account Status</span>
                </div>
                <span className="text-[11px] font-bold text-black border border-gray-300 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full mt-2 py-2.5 px-4 bg-white hover:bg-gray-50 text-black border border-gray-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FIXED TOP NAVBAR & LIVE WINNER TICKER                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-xs">
        {/* Brand & Auth Status Bar */}
        <div className="w-full px-3.5 py-2.5 flex items-center justify-between">
          {/* Left Brand */}
          <div className="flex items-center gap-2">
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
          </div>

          {/* Right Header Action */}
          <div>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/account')}
                className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 px-2.5 py-1 rounded-full text-xs font-semibold text-black transition-colors cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[75px] truncate">{displayName}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate('/login')}
                  className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Winner Ticker Bar */}
        <div
          onClick={() => handleGuardedAction('Live Winners Feed')}
          className="w-full px-3.5 py-1.5 flex items-center justify-between bg-white border-t border-gray-100 cursor-pointer"
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>

            <div className="text-[11px] text-gray-600 truncate tracking-tight">
              <span className="font-bold text-black">{currentWinner.user}</span>
              <span className="mx-1 text-gray-500">won</span>
              <span className="text-black font-black">{currentWinner.amount}</span>
              <span className="ml-1 text-gray-500">in {currentWinner.game}</span>
            </div>
          </div>

          <div className="flex items-center text-[10px] font-bold text-blue-600 shrink-0 gap-0.5">
            <span>LIVE</span>
            <TrendingUp size={11} />
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 4. WALLET / BALANCE CARD                                                  */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 pt-3">
        <div className="w-full rounded-2xl bg-white p-4 text-black shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            {/* Left Balance Display */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 text-[11px] font-semibold tracking-wider uppercase">
                  Available Points
                </span>
                {!isAuthenticated && (
                  <span className="text-[9px] bg-gray-100 text-black font-semibold px-1.5 py-0.2 rounded border border-gray-200">
                    Demo
                  </span>
                )}
              </div>

              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-black text-black tracking-tight leading-none">
                  ₹{displayBalance}
                </span>
                <span className="text-[11px] font-bold text-gray-500 ml-1.5">INR</span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                <span>ID: {displayId}</span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleGuardedAction('Recharge', () => navigate('/recharge'))}
                className="w-24 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-transform cursor-pointer text-center"
              >
                Recharge
              </button>
              <button
                onClick={() => handleGuardedAction('Withdraw', () => navigate('/account'))}
                className="w-24 py-1.5 bg-white hover:bg-gray-50 border border-blue-600 text-blue-600 text-xs font-bold rounded-full active:scale-95 transition-transform cursor-pointer text-center"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. QUICK ACTION CARDS                                                     */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 py-3 grid grid-cols-2 gap-2.5">
        {/* Task Reward */}
        <div
          onClick={() => handleGuardedAction('Task Rewards')}
          className="bg-white rounded-2xl p-2.5 border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-blue-600 group"
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
          {!isAuthenticated && <Lock size={12} className="text-gray-400" />}
        </div>

        {/* Daily Check-In */}
        <div
          onClick={() => handleGuardedAction('Daily Check-in')}
          className="bg-white rounded-2xl p-2.5 border border-gray-200 shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-blue-600 group"
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
          {!isAuthenticated && <Lock size={12} className="text-gray-400" />}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. GAME CARDS 2x2 GRID                                                    */}
      {/* ========================================================================= */}
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
          <div
            onClick={() => handleGuardedAction('Fast-Parity Game', () => navigate('/parity'))}
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-sm relative overflow-hidden group border border-gray-200 bg-white"
          >
            {/* Banner Image */}
            <img
              src="https://www.acewin.ink/_astro/fast-parity.Cw4eRbcT_Z591Fh.webp"
              alt="Fast-Parity"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Lock Overlay if guest */}
            {!isAuthenticated && (
              <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center text-white border border-white/20">
                <Lock size={11} />
              </div>
            )}

            {/* Badge */}
            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
              30 Sec
            </div>

          </div>

          {/* CARD 2: MineSweeper */}
          <div
            onClick={() => handleGuardedAction('MineSweeper Game')}
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-sm relative overflow-hidden group border border-gray-200 bg-white"
          >
            {/* Banner Image */}
            <img
              src="https://www.acewin.in/assets/mine-sweeper-Co058xQ5.png"
              alt="MineSweeper"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
    
            {!isAuthenticated && (
              <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center text-white border border-white/20">
                <Lock size={11} />
              </div>
            )}

            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
              Instant
            </div>

  
          </div>

          {/* CARD 4: Crash */}
          <div
            onClick={() => handleGuardedAction('Crash Game')}
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-sm relative overflow-hidden group border border-gray-200 bg-white"
          >
            {/* Banner Image */}
            <img
              src="https://www.acewin.in/assets/crash-6ein-qaS.png"
              alt="Crash"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {!isAuthenticated && (
              <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center text-white border border-white/20">
                <Lock size={11} />
              </div>
            )}

            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-xs">
              100x Multi
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;