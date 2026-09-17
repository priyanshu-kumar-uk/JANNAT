import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Users, User } from 'lucide-react';

const BottomNav = ({ onAuthRequired, onOpenProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = React.useState('fiewin');

  const handleTabClick = (tabId) => {
    if (tabId === 'fiewin') {
      navigate('/');
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
              isActive ? 'text-[#8B3A13] scale-110 stroke-[2.5]' : 'text-[#8C7A6F] stroke-[1.8]'
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
              isActive ? 'text-[#8B3A13] scale-110 stroke-[2.5]' : 'text-[#8C7A6F] stroke-[1.8]'
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
                ? 'border-[#0088ff] text-[#0088ff] scale-110'
                : 'border-[#8C7A6F] text-[#8C7A6F]'
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
              isActive ? 'text-[#8B3A13] scale-110 stroke-[2.5]' : 'text-[#8C7A6F] stroke-[1.8]'
            }`}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-[#EBE3D7]/80 h-15 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)] select-none z-40 shrink-0">
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
              <span
                className={`absolute top-0 w-8 h-0.5 rounded-full ${
                  tab.id === 'recharge'
                    ? 'bg-[#0088ff] shadow-[0_2px_8px_#0088ff]'
                    : 'bg-[#8B3A13] shadow-[0_2px_8px_#8B3A13]'
                }`}
              />
            )}

            {tab.icon(isActive)}

            <span
              className={`text-[11px] mt-1 tracking-tight transition-all duration-150 ${
                isActive
                  ? tab.id === 'recharge'
                    ? 'text-[#0088ff] font-bold'
                    : 'text-[#8B3A13] font-bold'
                  : 'text-[#8C7A6F] font-medium group-hover:text-[#4A382F]'
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