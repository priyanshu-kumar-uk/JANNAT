import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Flame, ShieldCheck, Zap, Coins } from 'lucide-react';

const LIVE_WINNERS = [
  { name: 'Sameer K.', game: 'Roulette Royale', amount: '₹14,500', time: 'Just now' },
  { name: 'Priya S.', game: 'Dragon Tiger', amount: '₹8,200', time: '1m ago' },
  { name: 'Rohit V.', game: 'Teen Patti Live', amount: '₹35,000', time: '2m ago' },
  { name: 'Anjali M.', game: 'Mega Slot 777', amount: '₹19,800', time: '3m ago' },
  { name: 'Vikas G.', game: 'Aviator Crash', amount: '₹52,400', time: '4m ago' },
];

const GAMES_LIST = [
  { id: 'roulette', name: 'Live Roulette', tag: 'Hot', icon: '🎯', players: '2.4k' },
  { id: 'teenpatti', name: 'Teen Patti 3D', tag: 'Popular', icon: '🃏', players: '5.1k' },
  { id: 'slots', name: 'Jannat Jackpot', tag: 'Mega', icon: '🎰', players: '3.8k' },
  { id: 'dice', name: 'Lightning Dice', tag: 'Live', icon: '🎲', players: '1.9k' },
];

const GameShowcase = () => {
  const [jackpot, setJackpot] = useState(2485630);
  const [activeWinnerIdx, setActiveWinnerIdx] = useState(0);
  const [slotValues, setSlotValues] = useState(['7', '7', '7']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinMessage, setSpinMessage] = useState('Tap Spin Demo to test your luck!');

  // Live Jackpot tick
  useEffect(() => {
    const timer = setInterval(() => {
      setJackpot((prev) => prev + Math.floor(Math.random() * 15) + 5);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Cycle winners
  useEffect(() => {
    const winnerTimer = setInterval(() => {
      setActiveWinnerIdx((prev) => (prev + 1) % LIVE_WINNERS.length);
    }, 3500);
    return () => clearInterval(winnerTimer);
  }, []);

  // Mini interactive slot spin game
  const spinMiniGame = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinMessage('Spinning...');

    const symbols = ['7', '💎', '👑', '🍒', '⭐', '🔥'];
    let count = 0;
    const interval = setInterval(() => {
      setSlotValues([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const win = Math.random() > 0.35;
        if (win) {
          setSlotValues(['👑', '👑', '👑']);
          setSpinMessage('🎉 JACKPOT HIT! Register to win real cash!');
        } else {
          setSlotValues(['7', '💎', '7']);
          setSpinMessage('Almost! Join now & get ₹500 Bonus!');
        }
        setIsSpinning(false);
      }
    }, 80);
  };

  const currentWinner = LIVE_WINNERS[activeWinnerIdx];

  return (
    <div className="h-full w-full flex flex-col justify-between p-4 sm:p-5 bg-blue-600 text-white relative overflow-hidden select-none">
      
      {/* Background Ambience */}
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-blue-400 opacity-25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-blue-300 opacity-15 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-700 border border-blue-500">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-medium text-blue-100">
            14.2k Online
          </span>
        </div>

        <div className="flex items-center gap-1 text-[9px] text-white bg-blue-700 px-2 py-0.5 rounded-full border border-blue-500 font-semibold tracking-wider uppercase">
          <Trophy size={11} />
          <span>Jannat Casino</span>
        </div>
      </div>

      {/* Center Gaming Arena */}
      <div className="relative z-10 my-auto py-1">
        
        {/* Jackpot Header */}
        <div className="text-center mb-2">
          <span className="text-[9px] uppercase tracking-widest text-blue-200 font-semibold flex items-center justify-center gap-1">
            <Sparkles size={10} className="text-white" />
            Grand Progressive Jackpot
            <Sparkles size={10} className="text-white" />
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-mono mt-0.5">
            ₹ {jackpot.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Interactive Mini Slot Machine */}
        <div className="bg-blue-700 border border-blue-500 rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <div className="flex items-center gap-1 text-[11px] text-blue-100 font-medium">
              <Flame size={12} className="text-white" />
              <span>Lucky Reel Demo</span>
            </div>
            <span className="text-[9px] text-white bg-blue-800 px-1.5 py-0.5 rounded border border-blue-600">
              Free Demo
            </span>
          </div>

          {/* Slot Reels */}
          <div className="grid grid-cols-3 gap-1.5 bg-blue-800 p-2 rounded-lg border border-blue-600 mb-2.5">
            {slotValues.map((val, idx) => (
              <div
                key={idx}
                className={`h-12 sm:h-14 bg-blue-900 border border-blue-600 rounded flex items-center justify-center text-xl sm:text-2xl shadow-inner transition-transform duration-100 ${
                  isSpinning ? 'scale-95 animate-bounce' : 'scale-100'
                }`}
              >
                {val}
              </div>
            ))}
          </div>

          {/* Spin Trigger Button */}
          <button
            onClick={spinMiniGame}
            disabled={isSpinning}
            className="w-full py-2 px-3 bg-white hover:bg-gray-100 active:scale-[0.98] text-blue-600 font-bold text-[11px] uppercase tracking-wider rounded-lg shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Coins size={13} className="text-blue-600" />
            <span>{isSpinning ? 'Spinning...' : 'Spin Demo'}</span>
          </button>

          {/* Status Message */}
          <p className="text-center text-[10px] text-blue-100 mt-1.5 font-medium min-h-[14px] truncate">
            {spinMessage}
          </p>
        </div>

        {/* Featured Mini Game Badges */}
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {GAMES_LIST.map((game) => (
            <div
              key={game.id}
              className="bg-blue-700/90 hover:bg-blue-700 border border-blue-500 rounded-lg p-1.5 text-center transition-all cursor-pointer group"
            >
              <div className="text-base mb-0.5 group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <div className="text-[9px] font-semibold text-white truncate">
                {game.name}
              </div>
              <div className="text-[8px] text-blue-200 flex items-center justify-center gap-0.5 mt-0.5">
                <span className="w-1 h-1 rounded-full bg-white" />
                {game.players}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 space-y-1.5">
        <div className="bg-blue-700 border border-blue-500 rounded-lg p-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-white text-blue-600 flex items-center justify-center font-bold text-[10px]">
              ₹
            </div>
            <div>
              <div className="font-semibold text-white text-[10px] leading-tight">
                {currentWinner.name} <span className="text-[8px] text-blue-200 font-normal">&bull; {currentWinner.game}</span>
              </div>
              <div className="text-[8px] text-blue-100 font-medium">
                Won {currentWinner.amount} ({currentWinner.time})
              </div>
            </div>
          </div>
          <span className="text-[8px] font-bold text-white px-1 py-0.5 bg-blue-800 rounded border border-blue-600 uppercase">
            Live
          </span>
        </div>

        <div className="flex items-center justify-between text-[9px] text-blue-200 pt-1 border-t border-blue-500">
          <div className="flex items-center gap-1">
            <Zap size={11} className="text-white" />
            <span>Instant UPI Cashouts</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-white" />
            <span>256-Bit SSL</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GameShowcase;
