import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Users, User } from 'lucide-react';

const BottomNav = ({ onAuthRequired, onOpenProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const getActiveTab = () => {
    if (location.pathname.startsWith('/invite')) return 'invite';
    if (location.pathname.startsWith('/recharge')) return 'recharge';
    if (location.pathname.startsWith('/account')) return 'account';
    return 'fiewin';
  };
  const activeTab = getActiveTab();

  const handleTabClick = (tabId) => {
    if (tabId === 'fiewin') {
      navigate('/');
      return;
    }

    if (tabId === 'invite') {
      navigate('/invite');
      return;
    }

    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired(`Please Login to access ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
      } else {
        navigate('/login');
      }
      return;
    }

    if (tabId === 'my') {
      if (onOpenProfile) onOpenProfile();
    }

    navigate(`/${tabId}`);
  };

  const tabs = [
    {
      id: 'fiewin',
      label: 'Home',
      icon: (isActive) => (
        <div className="relative">
          <Home
            size={20}
            className={`transition-transform duration-200 ${
              isActive ? 'text-blue-600 scale-110 stroke-[2.5]' : 'text-gray-400 stroke-[1.8]'
            }`}
          />
        </div>
      ),
    },
    {
      id: 'invite',
      label: 'Invite',
      icon: (isActive) => (
        <div className="relative">
          <Users
            size={20}
            className={`transition-transform duration-200 ${
              isActive ? 'text-blue-600 scale-110 stroke-[2.5]' : 'text-gray-400 stroke-[1.8]'
            }`}
          />
        </div>
      ),
    },
    {
      id: 'recharge',
      label: 'Recharge',
      icon: (isActive) => (
        <div className="relative">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform duration-200 ${
              isActive
                ? 'border-blue-600 text-blue-600 scale-110'
                : 'border-gray-400 text-gray-400'
            }`}
          >
            <span className="text-[10px] font-black leading-none">₹</span>
          </div>
        </div>
      ),
    },
    {
      id: 'account',
      label: 'Account',
      icon: (isActive) => (
        <div className="relative">
          <User
            size={20}
            className={`transition-transform duration-200 ${
              isActive ? 'text-blue-600 scale-110 stroke-[2.5]' : 'text-gray-400 stroke-[1.8]'
            }`}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white border-t border-gray-200 h-15 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)] select-none z-40 shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 cursor-pointer relative group transition-all duration-150"
          >
            {/* Active Pill Glow */}
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.5)]" />
            )}

            {tab.icon(isActive)}

            <span
              className={`text-[11px] mt-1 tracking-tight transition-all duration-150 ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-gray-400 font-medium group-hover:text-black'
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