import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-6 text-center select-none bg-white">
      {/* 404 Visual Illustration Badge */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center shadow-sm">
          <Compass size={48} className="text-blue-600 animate-pulse" strokeWidth={1.75} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md">
          404
        </div>
      </div>

      {/* Main Titles */}
      <h1 className="text-2xl font-black text-black tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-xs text-gray-500 max-w-[260px] leading-relaxed mb-8">
        The page you are looking for does not exist or has been moved.
      </p>

      {/* Action Button */}
      <div className="w-full max-w-[240px]">
        <Link
          to="/"
          className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Home size={16} />
          <span>Go Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
