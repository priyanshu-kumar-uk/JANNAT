import React from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Lock, Eye, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = () => {
  return (
    <div className="h-screen w-full overflow-hidden bg-gray-500 flex items-center justify-center p-2 sm:p-4 select-none font-sans">
      <div className="w-full h-screen md:w-[420px] p-4 sm:p-6 lg:p-7 flex flex-col justify-between bg-white overflow-hidden relative shadow-2xl">
        
        {/* Top Bar with Back to Home Button */}
        <div className="flex items-center justify-between w-full mb-1 sm:mb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-blue-600 border border-gray-200 text-[11px] font-bold transition-colors group"
            title="Back to Home"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Jannat
          </span>
        </div>

        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-2.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-1.5 mb-1.5">
            <img
              src="/logo/Jannat-Logo.png"
              alt="Jannat Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black font-serif">
            Create Account
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Join Jannat & claim your welcome bonus
          </p>
        </div>

        {/* Form */}
        <form className="space-y-2.5 sm:space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-black uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={15} />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 text-black placeholder-gray-300 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[10px] font-bold text-black uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone size={15} />
              </div>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 text-black placeholder-gray-300 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-black uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={15} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                className="w-full pl-9 pr-8 py-2 bg-gray-50 text-black placeholder-gray-300 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-black transition-colors focus:outline-none cursor-pointer"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center pt-0.5">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              defaultChecked
              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
            <label
              htmlFor="agreeTerms"
              className="ml-2 text-[11px] text-gray-500 cursor-pointer"
            >
              I agree to the{' '}
              <a href="#terms" className="text-blue-600 hover:underline font-semibold">
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <Link
            to="/"
            className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer text-center"
          >
            <span>Create Account</span>
            <ArrowRight size={14} />
          </Link>
        </form>

        {/* Switch to Login */}
        <div className="mt-3.5 pt-2.5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline ml-1"
            >
              Login
            </Link>
          </p>
        </div>

        <div className="text-center text-[10px] text-gray-400 mt-2">
          &copy; 2026 Jannat. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Register;
