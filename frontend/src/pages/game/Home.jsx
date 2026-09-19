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
      // Small timeout for smooth entry animation
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
    <div className="w-full min-h-full bg-[#FAF8F5] flex flex-col font-sans select-none pb-18 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#1A110B]/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-amber-500/30 flex items-center gap-2 backdrop-blur-md animate-bounce">
          <Sparkles size={14} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. AUTHENTICATION REQUIRED MODAL (POPUP ON FIRST VISIT / INTERACTION)     */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-[#EBE3D7] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top Banner */}
            <div className="relative bg-gradient-to-br from-[#1C120C] via-[#2D1B13] to-[#8B3A13] p-5 text-center text-white overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF6F0] p-1.5 shadow-lg border border-amber-400/40 mb-2.5 flex items-center justify-center">
                <img
                  src="/logo/Jannat-Logo.png"
                  alt="Jannat Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-lg font-bold tracking-tight text-amber-100 font-serif">
                Welcome to Jannat
              </h2>
              <p className="text-[11px] text-[#D8C7B8] mt-1 max-w-[240px] mx-auto leading-relaxed">
                {authModalReason || 'Login or Create Account to start playing & withdraw instantly.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="p-4 space-y-2.5">
              {/* Login Button */}
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 px-4 bg-[#8B3A13] hover:bg-[#742E0E] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <span>Login to Account</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Register Button */}
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/register');
                }}
                className="w-full py-2.5 px-4 bg-[#FAF6F0] hover:bg-[#F2ECE2] text-[#8B3A13] border border-[#E2D8CC] text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Gift size={14} className="text-[#8B3A13]" />
                <span>Create New Account</span>
              </button>

              {/* Browse as guest */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-1.5 text-center text-[11px] font-semibold text-[#8C7A6F] hover:text-[#4A382F] transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#EBE3D7] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B3A13] to-[#B34E1E] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-black text-base shadow-sm">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">{displayName}</h3>
                  <p className="text-[11px] text-white/80 font-mono">{user?.mobileNumber || 'Member'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3">
              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EBE3D7] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-[#8B3A13]">
                    <Wallet size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Wallet Balance</span>
                </div>
                <span className="text-sm font-black text-gray-900">₹{displayBalance}</span>
              </div>

              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EBE3D7] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-[#00c08b]">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Account Status</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Active
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full mt-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
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
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#EBE3D7] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {/* Brand & Auth Status Bar */}
        <div className="w-full px-3.5 py-2 flex items-center justify-between">
          {/* Left Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7] p-0.5 shadow-xs flex items-center justify-center">
              <img
                src="/logo/Jannat-Logo.png"
                alt="Jannat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-black tracking-tight text-[#2B1B14] font-serif uppercase">
              Jannat
            </span>
          </div>

          {/* Right Header Action */}
          <div>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/account')}
                className="flex items-center gap-1.5 bg-[#FAF6F0] hover:bg-[#F2ECE2] border border-[#E2D8CC] px-2.5 py-1 rounded-full text-xs font-semibold text-[#4A382F] transition-colors cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-[#8B3A13] text-white text-[9px] font-bold flex items-center justify-center">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[75px] truncate">{displayName}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate('/login')}
                  className="px-2.5 py-1 text-xs font-bold text-[#8B3A13] hover:text-[#6E2C0D] transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3 py-1 bg-[#8B3A13] hover:bg-[#742E0E] text-white text-xs font-bold rounded-full shadow-xs transition-colors cursor-pointer"
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
          className="w-full px-3.5 py-1.5 flex items-center justify-between bg-gradient-to-r from-[#FFF9F2] via-[#FFF3E6] to-[#FFF9F2] border-t border-[#F2ECE2] cursor-pointer"
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <div className="text-[11px] text-[#6B5A4E] truncate tracking-tight">
              <span className="font-bold text-[#2B1B14]">{currentWinner.user}</span>
              <span className="mx-1 text-[#8C7A6F]">won</span>
              <span className="text-emerald-600 font-black">{currentWinner.amount}</span>
              <span className="ml-1 text-[#8C7A6F]">in {currentWinner.game}</span>
            </div>
          </div>

          <div className="flex items-center text-[10px] font-bold text-[#8B3A13] shrink-0 gap-0.5">
            <span>LIVE</span>
            <TrendingUp size={11} />
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 4. PREMIUM HERO WALLET / BALANCE CARD                                     */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 pt-3">
        <div className="w-full rounded-2xl bg-gradient-to-br from-[#1F140D] via-[#2B1C13] to-[#45271A] p-4 text-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-[#5A3828]/50 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            {/* Left Balance Display */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#D8C7B8] text-[11px] font-semibold tracking-wider uppercase">
                  Available Points
                </span>
                {!isAuthenticated && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.2 rounded">
                    Demo
                  </span>
                )}
              </div>

              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-black text-white tracking-tight leading-none">
                  ₹{displayBalance}
                </span>
                <span className="text-[11px] font-bold text-[#D8C7B8] ml-1.5">INR</span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#A8988C] font-mono">
                <span>ID: {displayId}</span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleGuardedAction('Recharge', () => navigate('/recharge'))}
                className="w-26 py-1.5 bg-gradient-to-r from-[#2196f3] to-[#00b0ff] text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/25 active:scale-95 transition-transform cursor-pointer text-center"
              >
                Recharge
              </button>
              <button
                onClick={() => handleGuardedAction('Withdraw', () => navigate('/account'))}
                className="w-26 py-1.5 bg-white/15 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-full active:scale-95 transition-transform cursor-pointer text-center"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. QUICK ACTION CARDS (TASK REWARD & DAILY CHECK-IN)                      */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 py-3 grid grid-cols-2 gap-2.5">
        {/* Task Reward */}
        <div
          onClick={() => handleGuardedAction('Task Rewards')}
          className="bg-white rounded-2xl p-2.5 border border-[#EBE3D7] shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-[#8B3A13]/40 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Gift size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2B1B14]">Task Reward</h4>
              <p className="text-[10px] text-[#8C7A6F]">Get ₹100+ Free</p>
            </div>
          </div>
          {!isAuthenticated && <Lock size={12} className="text-[#A8988C]" />}
        </div>

        {/* Daily Check-In */}
        <div
          onClick={() => handleGuardedAction('Daily Check-in')}
          className="bg-white rounded-2xl p-2.5 border border-[#EBE3D7] shadow-xs flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-[#00c08b]/40 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2B1B14]">Check In</h4>
              <p className="text-[10px] text-[#8C7A6F]">Daily Bonus</p>
            </div>
          </div>
          {!isAuthenticated && <Lock size={12} className="text-[#A8988C]" />}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. GAME CARDS 2x2 GRID (CLICK INTERCEPTED FOR GUESTS)                     */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame size={15} className="text-[#8B3A13]" />
            <h3 className="text-xs font-bold text-[#2B1B14] uppercase tracking-wider">
              Popular Games
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-[#8B3A13]">Instant Payouts</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* CARD 1: Fast-Parity */}
          <div
            onClick={() => handleGuardedAction('Fast-Parity Game', () => navigate('/parity'))}
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-md relative overflow-hidden group border border-[#2D1E16] bg-[#0E1520]"
          >
            {/* Banner Image */}
            <img
              src="/banners/Gemini_Generated_Image_d2nzxqd2nzxqd2nz.png"
              alt="Fast-Parity"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Lock Overlay if guest */}
            {!isAuthenticated && (
              <div className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center text-white/90 border border-white/20">
                <Lock size={11} />
              </div>
            )}

            {/* Badge */}
            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold tracking-wider uppercase border border-white/20">
              30 Sec
            </div>

            <div className="relative z-10 w-full text-center pb-0.5">
              <span className="text-white font-black text-base tracking-tight drop-shadow-md">
                Fast-Parity
              </span>
            </div>
          </div>

          {/* CARD 2: MineSweeper */}
          <div
            onClick={() => handleGuardedAction('MineSweeper Game')}
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-md relative overflow-hidden group border border-[#2D1E16] bg-[#1E0D0D]"
          >
            {/* Banner Image */}
            <img
              src="/banners/sweeper.png"
              alt="MineSweeper"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {!isAuthenticated && (
              <div className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center text-white/90 border border-white/20">
                <Lock size={11} />
              </div>
            )}

            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold tracking-wider uppercase border border-white/20">
              Instant
            </div>

            <div className="relative z-10 w-full text-center pb-0.5">
              <span className="text-white font-black text-base tracking-tight drop-shadow-md">
                MineSweeper
              </span>
            </div>
          </div>

          {/* CARD 3: Andar Bahar */}
          <div
            onClick={() => handleGuardedAction('Andar Bahar Game')}
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-md relative overflow-hidden group border border-[#2D1E16] bg-[#1E1208]"
          >
            {/* Banner Image */}
            <img
              src="/banners/Andar%20bahr.png"
              alt="Andar Bahar"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {!isAuthenticated && (
              <div className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center text-white/90 border border-white/20">
                <Lock size={11} />
              </div>
            )}

            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold tracking-wider uppercase border border-white/20">
              Classic
            </div>

            <div className="relative z-10 w-full text-center pb-0.5">
              <span className="text-white font-black text-base tracking-tight drop-shadow-md">
                Andar Bahar
              </span>
            </div>
          </div>

          {/* CARD 4: Crash */}
          <div
            onClick={() => handleGuardedAction('Crash Game')}
            className="h-[185px] rounded-2xl p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-all duration-150 shadow-md relative overflow-hidden group border border-[#2D1E16] bg-[#0A1A14]"
          >
            {/* Banner Image */}
            <img
              src="/banners/Crash.png"
              alt="Crash"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Contrast Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {!isAuthenticated && (
              <div className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-xs w-6 h-6 rounded-full flex items-center justify-center text-white/90 border border-white/20">
                <Lock size={11} />
              </div>
            )}

            <div className="relative z-10 self-start px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold tracking-wider uppercase border border-white/20">
              100x Multi
            </div>

            <div className="relative z-10 w-full text-center pb-0.5">
              <span className="text-white font-black text-base tracking-tight drop-shadow-md">
                Crash
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;