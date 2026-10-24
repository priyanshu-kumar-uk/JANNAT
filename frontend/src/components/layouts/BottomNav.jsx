import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="w-full bg-white border-t border-gray-200 h-15 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)] select-none z-40 shrink-0">
      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-1.5 relative group transition-all duration-150 ${
            isActive ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.5)]" />
            )}
            <Home
              size={20}
              className={`transition-transform duration-200 ${
                isActive ? 'text-blue-600 scale-110 stroke-[2.5]' : 'text-gray-400 stroke-[1.8]'
              }`}
            />
            <span className="text-[11px] mt-1 tracking-tight">Home</span>
          </>
        )}
      </NavLink>

      {/* Invite */}
      <NavLink
        to="/invite"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-1.5 relative group transition-all duration-150 ${
            isActive ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.5)]" />
            )}
            <Users
              size={20}
              className={`transition-transform duration-200 ${
                isActive ? 'text-blue-600 scale-110 stroke-[2.5]' : 'text-gray-400 stroke-[1.8]'
              }`}
            />
            <span className="text-[11px] mt-1 tracking-tight">Invite</span>
          </>
        )}
      </NavLink>

      {/* Recharge */}
      <NavLink
        to="/recharge"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-1.5 relative group transition-all duration-150 ${
            isActive ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.5)]" />
            )}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform duration-200 ${
                isActive
                  ? 'border-blue-600 text-blue-600 scale-110'
                  : 'border-gray-400 text-gray-400'
              }`}
            >
              <span className="text-[10px] font-black leading-none">₹</span>
            </div>
            <span className="text-[11px] mt-1 tracking-tight">Recharge</span>
          </>
        )}
      </NavLink>

      {/* Account */}
      <NavLink
        to="/account"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center py-1.5 relative group transition-all duration-150 ${
            isActive ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 rounded-full bg-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.5)]" />
            )}
            <User
              size={20}
              className={`transition-transform duration-200 ${
                isActive ? 'text-blue-600 scale-110 stroke-[2.5]' : 'text-gray-400 stroke-[1.8]'
              }`}
            />
            <span className="text-[11px] mt-1 tracking-tight">Account</span>
          </>
        )}
      </NavLink>
    </div>
  );
};

export default BottomNav;