import {
  Menu,
  X,
  LayoutDashboard,
  IndianRupee,
  ArrowDownToLine,
  Users,
  Shield,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Recharge', icon: IndianRupee, path: '/admin/recharge' },
  { label: 'Withdraw', icon: ArrowDownToLine, path: '/admin/withdraw' },
  { label: 'Users', icon: Users, path: '/admin/users' },
];

const AdminNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger / Close Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:border-blue-400 active:scale-90 cursor-pointer group shadow-sm"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
      >
        <div className="relative w-5 h-5">
          <Menu
            className={`w-5 h-5 text-black group-hover:text-blue-600 absolute inset-0 transition-all duration-300 ${
              open ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <X
            className={`w-5 h-5 text-black group-hover:text-blue-600 absolute inset-0 transition-all duration-300 ${
              open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
            }`}
          />
        </div>
      </button>

      {/* Overlay Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-[55] h-full w-64 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full bg-white border-r border-gray-200 flex flex-col shadow-lg">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-600" />

          {/* Brand Header */}
          <div className="px-5 pt-16 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black tracking-tight">
                  Admin Panel
                </h2>
                <p className="text-[10px] text-gray-400 font-medium">
                  Management Console
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-gray-200" />

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-500 hover:text-black hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400 group-hover:text-black group-hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="px-5 pb-6">
            <div className="h-px bg-gray-200 mb-4" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">A</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-black">Admin</p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminNav;