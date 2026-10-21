import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-6 text-center select-none bg-[#FAF8F5]">
      {/* 404 Visual Illustration Badge */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#FFF5EC] to-[#F5E6D8] border border-[#EBE3D7] flex flex-col items-center justify-center shadow-lg shadow-[#8B3A13]/5">
          <Compass size={48} className="text-[#8B3A13] animate-pulse" strokeWidth={1.75} />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-[#8B3A13] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md">
          404
        </div>
      </div>

      {/* Main Titles */}
      <h1 className="text-2xl font-black text-[#2B1B14] tracking-tight font-serif mb-2">
        Page Not Found
      </h1>
      <p className="text-xs text-[#7D6B60] max-w-[260px] leading-relaxed mb-8">
        Oops! The page you are looking for does not exist, has been removed, or the URL is incorrect.
      </p>

      {/* Action Button */}
      <div className="w-full max-w-[240px] space-y-3">
        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-[#8B3A13] to-[#6E2A0A] hover:from-[#75300F] hover:to-[#5B2107] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#8B3A13]/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Home size={16} />
          <span>Go Back to Home</span>
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-[#7D6B60] font-semibold text-xs rounded-xl border border-[#EBE3D7] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Previous Page</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
