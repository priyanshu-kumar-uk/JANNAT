import React, { useState, useEffect } from 'react';

const Home = () => {
  // Live winner announcement feed
  const winnersList = [
    { user: '****819', amount: '₹6000', game: 'Parity game' },
    { user: '****352', amount: '₹12400', game: 'Fast-Parity' },
    { user: '****904', amount: '₹3500', game: 'MineSweeper' },
    { user: '****118', amount: '₹8200', game: 'Crash' },
    { user: '****627', amount: '₹15000', game: 'Andar Bahar' }
  ];

  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinnerIndex((prev) => (prev + 1) % winnersList.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [winnersList.length]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const currentWinner = winnersList[currentWinnerIndex];

  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-all animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* 1. Top Winner Announcement Bar */}
      <div className="w-full px-4 py-2.5 flex items-center border-b border-gray-100 bg-white">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-amber-400/80 shadow-xs flex items-center justify-center bg-amber-50 mr-2.5">
          <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
            <circle cx="20" cy="20" r="20" fill="#fef3c7" />
            <circle cx="20" cy="20" r="19" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Hair */}
            <path d="M12 24C12 15 15 10 20 10C25 10 28 15 28 24C28 27 26 31 24 33H16C14 31 12 27 12 24Z" fill="#1e1b4b" />
            {/* Face */}
            <circle cx="20" cy="18" r="6.5" fill="#fcd34d" />
            {/* Bindi */}
            <circle cx="20" cy="16" r="1.1" fill="#dc2626" />
            {/* Traditional Dupatta / Veil in Red/Orange */}
            <path d="M11 22C11 13 14 8 20 8C26 8 29 13 29 22C29 28 27 35 27 38H13C13 35 11 28 11 22Z" fill="#ea580c" opacity="0.88" />
            {/* Garland necklace */}
            <path d="M16 23.5C18 26 22 26 24 23.5" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            {/* Saree drape */}
            <path d="M10 40C10 32 15 28 20 28C25 28 30 32 30 40Z" fill="#dc2626" />
          </svg>
        </div>

        {/* Dynamic Winner Ticker */}
        <div className="flex-1 text-[13px] text-gray-700 truncate tracking-tight transition-opacity duration-300">
          <span className="font-semibold text-gray-800">{currentWinner.user}</span>
          <span className="mx-1 text-gray-600">Wins</span>
          <span className="text-[#00c08b] font-bold">{currentWinner.amount}</span>
          <span className="ml-1 text-gray-600">in {currentWinner.game}</span>
        </div>
      </div>

      {/* 2. Balance & Action Buttons Card */}
      <div className="w-full px-5 pt-4 pb-3 flex items-center justify-between">
        {/* Left: Balance info */}
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-semibold tracking-wide">Point</span>
          <div className="flex items-baseline mt-0.5">
            <span className="text-[32px] font-black text-gray-800 tracking-tight leading-none">2.000</span>
            <span className="text-[11px] font-bold text-gray-700 ml-1.5 self-baseline">rupee</span>
          </div>
          <span className="text-gray-400 text-xs font-medium tracking-wide mt-1.5">ID:13436935</span>
        </div>

        {/* Right: Recharge & Withdraw Buttons */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => showToast('Recharge Clicked')}
            className="w-28 py-2 bg-gradient-to-r from-[#2196f3] to-[#00b0ff] text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/20 active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            Recharge
          </button>
          <button
            onClick={() => showToast('Withdraw Clicked')}
            className="w-28 py-2 bg-[#eceff2] hover:bg-[#e2e8f0] text-gray-600 text-xs font-bold rounded-full active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* 3. Task Reward & Check In Row */}
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Task reward */}
        <div
          onClick={() => showToast('Task reward opened')}
          className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform duration-150"
        >
          <div className="w-9 h-9 rounded-full bg-[#f59e0b] flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none">
              <rect x="3" y="9" width="18" height="12" rx="2" fill="currentColor" />
              <rect x="2" y="6" width="20" height="4" rx="1.5" fill="currentColor" opacity="0.9" />
              <path d="M12 6v15" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M3 13.5h18" stroke="#f59e0b" strokeWidth="2" />
              <path d="M12 6C10.5 3.5 8 4 8 5.5C8 7 12 6.5 12 6Z" fill="currentColor" />
              <path d="M12 6C13.5 3.5 16 4 16 5.5C16 7 12 6.5 12 6Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-gray-700 text-xs font-bold tracking-tight">Task reward</span>
        </div>

        {/* Check in */}
        <div
          onClick={() => showToast('Daily Check-in successful!')}
          className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform duration-150"
        >
          <div className="w-9 h-9 rounded-full bg-[#00c08b] flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none">
              <rect x="3.5" y="4.5" width="17" height="16" rx="3" fill="currentColor" />
              <rect x="3.5" y="4.5" width="17" height="5" rx="2" fill="white" opacity="0.25" />
              <path d="M8 2.5v3M16 2.5v3" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M8 13.5l2.5 2.5 5.5-5.5" stroke="#00c08b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-gray-700 text-xs font-bold tracking-tight">Check in</span>
        </div>
      </div>

      {/* 4. Game Cards 2x2 Grid */}
      <div className="w-full px-3.5 pt-1 grid grid-cols-2 gap-3.5">
        {/* CARD 1: Fast-Parity */}
        <div
          onClick={() => showToast('Opening Fast-Parity')}
          className="h-[188px] rounded-2xl bg-[#4ec5dc] p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-transform duration-150 shadow-xs relative overflow-hidden"
        >
          {/* Top miniature rocket */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <svg viewBox="0 0 32 32" className="w-6 h-6 transform -rotate-12">
              <path d="M10 24L5 29C5 29 8 28 11 25Z" fill="#f97316" />
              <path d="M11 25L7 28C7 28 9 27 12 25Z" fill="#facc15" />
              <path d="M12 18L6 22L12 23Z" fill="#ef4444" />
              <path d="M18 12L22 6L23 12Z" fill="#ef4444" />
              <path d="M12 22C11 17 14 10 24 7C21 17 15 21 12 22Z" fill="#3b82f6" />
              <circle cx="17" cy="15" r="3" fill="#60a5fa" stroke="white" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Graphic: 3 Discs */}
          <div className="flex flex-col items-center justify-center my-auto pt-4">
            <div className="flex items-center justify-center -space-x-2">
              {/* Red 5 */}
              <div className="w-10 h-10 rounded-full bg-[#e53935] flex items-center justify-center shadow-md z-0">
                <span className="text-white font-black text-lg leading-none">5</span>
              </div>
              {/* Blue Lightning */}
              <div className="w-11 h-11 rounded-full bg-[#1a56db] flex items-center justify-center shadow-lg z-10">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M13 2L4 14h7l-2 8 11-12h-7l2-8z" />
                </svg>
              </div>
              {/* Green 2 */}
              <div className="w-10 h-10 rounded-full bg-[#057a55] flex items-center justify-center shadow-md z-0">
                <span className="text-white font-black text-lg leading-none">2</span>
              </div>
            </div>

            {/* 30sec Pill */}
            <div className="mt-2 px-3 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-medium tracking-wide">
              30sec
            </div>
          </div>

          {/* Title */}
          <span className="text-white font-extrabold text-[17px] tracking-tight mb-0.5">Fast-Parity</span>
        </div>

        {/* CARD 2: MineSweeper */}
        <div
          onClick={() => showToast('Opening MineSweeper')}
          className="h-[188px] rounded-2xl bg-[#f87171] p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-transform duration-150 shadow-xs relative overflow-hidden"
        >
          {/* Graphic: Classic Bomb */}
          <div className="flex flex-col items-center justify-center my-auto pt-1">
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
                {/* Red & Yellow Sparks */}
                <path d="M52 10L56 6" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M47 5L47 1" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M58 13L63 13" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M55 17L60 20" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                <circle cx="51" cy="11" r="2.5" fill="#facc15" />

                {/* Fuse */}
                <path d="M37 22C42 16 45 13 51 11" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" fill="none" />

                {/* Fuse Collar */}
                <rect x="30" y="19" width="10" height="5" rx="1.5" fill="#475569" />

                {/* Bomb Body */}
                <circle cx="32" cy="38" r="20" fill="#232b35" />
                {/* Specular Highlight */}
                <path d="M22 26C26 24 31 25 34 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
                <circle cx="21" cy="31" r="2" fill="white" opacity="0.25" />
              </svg>
            </div>

            {/* Instant Pill */}
            <div className="mt-1 px-3 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-medium tracking-wide">
              Instant
            </div>
          </div>

          {/* Title */}
          <span className="text-white font-extrabold text-[17px] tracking-tight mb-0.5">MineSweeper</span>
        </div>

        {/* CARD 3: Andar Bahar */}
        <div
          onClick={() => showToast('Opening Andar Bahar')}
          className="h-[188px] rounded-2xl bg-[#f59e0b] p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-transform duration-150 shadow-xs relative overflow-hidden"
        >
          {/* Graphic: 3 Playing Cards */}
          <div className="relative flex items-center justify-center my-auto w-full h-24">
            {/* Card 1: Back (FieWin blue) */}
            <div className="absolute left-3 transform -rotate-12 w-12 h-16 bg-[#103778] rounded-md shadow-md border border-blue-900/40 flex items-center justify-center p-0.5 overflow-hidden z-0">
              <span className="text-[9px] font-black text-white tracking-tighter">FieWin</span>
            </div>

            {/* Card 2: 3 of Hearts */}
            <div className="absolute left-10 transform -rotate-3 w-12 h-16 bg-white rounded-md shadow-lg border border-gray-100 flex flex-col justify-between p-1 z-10">
              <div className="flex flex-col items-start leading-none">
                <span className="text-[11px] font-black text-[#dc2626] leading-none">3</span>
                <span className="text-[10px] text-[#dc2626] leading-none mt-0.5">♥</span>
              </div>
              <div className="self-center text-xs text-[#dc2626] leading-none">♥</div>
              <div className="flex flex-col items-end leading-none rotate-180">
                <span className="text-[11px] font-black text-[#dc2626] leading-none">3</span>
                <span className="text-[10px] text-[#dc2626] leading-none mt-0.5">♥</span>
              </div>
            </div>

            {/* Card 3: 9 of Clubs */}
            <div className="absolute right-3.5 transform rotate-6 w-12 h-16 bg-white rounded-md shadow-lg border border-gray-100 flex flex-col justify-between p-1 z-20">
              <div className="flex flex-col items-start leading-none">
                <span className="text-[11px] font-black text-[#1e293b] leading-none">9</span>
                <span className="text-[10px] text-[#1e293b] leading-none mt-0.5">♣</span>
              </div>
              <div className="self-center text-xs text-[#1e293b] leading-none">♣</div>
              <div className="flex flex-col items-end leading-none rotate-180">
                <span className="text-[11px] font-black text-[#1e293b] leading-none">9</span>
                <span className="text-[10px] text-[#1e293b] leading-none mt-0.5">♣</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <span className="text-white font-extrabold text-[17px] tracking-tight mb-0.5">Andar Bahar</span>
        </div>

        {/* CARD 4: Crash */}
        <div
          onClick={() => showToast('Opening Crash')}
          className="h-[188px] rounded-2xl bg-[#41cca2] p-3 flex flex-col items-center justify-between cursor-pointer active:scale-[0.98] transition-transform duration-150 shadow-xs relative overflow-hidden"
        >
          {/* Graphic: Rocket Flying Up */}
          <div className="relative flex items-center justify-center my-auto w-full h-24">
            <div className="w-14 h-18 relative flex items-center justify-center">
              <svg viewBox="0 0 60 72" className="w-full h-full drop-shadow-md">
                {/* Exhaust Flame */}
                <path d="M25 54C25 65 30 72 30 72C30 72 35 65 35 54Z" fill="#ef4444" />
                <path d="M27 54C27 61 30 66 30 66C30 61 33 61 33 54Z" fill="#facc15" />

                {/* Left Wing Fin */}
                <path d="M21 38L10 52C10 52 17 54 22 49Z" fill="#ef4444" />
                {/* Right Wing Fin */}
                <path d="M39 38L50 52C50 52 43 54 38 49Z" fill="#ef4444" />

                {/* Main Fuselage */}
                <path d="M30 6C23 18 20 34 21 54H39C40 34 37 18 30 6Z" fill="white" />

                {/* Red Nose Cone */}
                <path d="M30 6C26 14 24 20 24 23H36C36 20 34 14 30 6Z" fill="#ef4444" />

                {/* Blue Round Window */}
                <circle cx="30" cy="34" r="7" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                {/* Window Reflection */}
                <path d="M27 31C28 29.5 31 29.5 33 30.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <span className="text-white font-extrabold text-[17px] tracking-tight mb-0.5">Crash</span>
        </div>
      </div>
    </div>
  );
};

export default Home;