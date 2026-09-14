import React, { useState } from 'react';

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('fiewin');

  const tabs = [
    {
      id: 'fiewin',
      label: 'FieWin',
      icon: (isActive) => (
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className={`w-6 h-6 ${isActive ? 'text-[#2196f3]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* House Outline */}
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
            {/* Water Drop inside */}
            <path d="M12 11c-1.5 1.8-2 2.7-2 3.8a2 2 0 0 0 4 0c0-1.1-.5-2-2-3.8z" fill={isActive ? '#2196f3' : '#9ca3af'} stroke="none" />
          </svg>
        </div>
      ),
    },
    {
      id: 'invite',
      label: 'Invite',
      icon: (isActive) => (
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className={`w-6 h-6 ${isActive ? 'text-[#2196f3]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      ),
    },
    {
      id: 'recharge',
      label: 'Recharge',
      icon: (isActive) => (
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className={`w-6 h-6 ${isActive ? 'text-[#2196f3]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 10h8M16 10l-3-3" />
            <path d="M16 14H8M8 14l3 3" />
          </svg>
        </div>
      ),
    },
    {
      id: 'my',
      label: 'My',
      icon: (isActive) => (
        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className={`w-6 h-6 ${isActive ? 'text-[#2196f3]' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white border-t border-gray-100 h-14 flex items-center justify-around shadow-sm select-none z-40 shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors"
          >
            {tab.icon(isActive)}
            <span
              className={`text-[11px] mt-0.5 tracking-tight font-medium ${
                isActive ? 'text-[#2196f3] font-bold' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;