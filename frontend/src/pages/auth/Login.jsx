import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GameShowcase from '../../components/games/GameShowcase';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Login failed.');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF6F0] flex items-center justify-center p-2 sm:p-4 select-none">
      
      {/* Centralized Card Wrapper - Fixed Viewport Height */}
      <div className="w-full max-w-4xl max-h-[95vh] bg-white border border-[#EBE3D7] rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row my-auto">
        
        {/* Left Side: Game Showcase */}
        <div className="hidden md:flex w-1/2 bg-[#1A110B]">
          <GameShowcase />
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 lg:p-7 flex flex-col justify-between bg-white overflow-hidden">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D7] flex items-center justify-center p-1.5 mb-1.5">
              <img
                src="/logo/Jannat-Logo.png"
                alt="Jannat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2B1B14] font-serif">
              Welcome Back
            </h1>
            <p className="text-[11px] text-[#7D6B60] mt-0.5">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-2.5 p-2 rounded-xl bg-[#FDF2F2] border border-[#F8D7DA] text-[#BC2B38] text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Email / Gmail Field */}
            <div>
              <label className="block text-[10px] font-bold text-[#4A382F] uppercase tracking-wider mb-1">
                Email / Gmail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#FCFBF8] text-[#2B1B14] placeholder-[#B5A599] text-xs rounded-xl border border-[#E2D8CC] focus:outline-none focus:border-[#8B3A13] focus:ring-1 focus:ring-[#8B3A13] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-[#4A382F] uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot-password"
                  className="text-[11px] font-medium text-[#8B3A13] hover:text-[#6E2C0D] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-8 py-2 bg-[#FCFBF8] text-[#2B1B14] placeholder-[#B5A599] text-xs rounded-xl border border-[#E2D8CC] focus:outline-none focus:border-[#8B3A13] focus:ring-1 focus:ring-[#8B3A13] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#9C8A7E] hover:text-[#4A382F] transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-0.5">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-3.5 h-3.5 rounded border-[#D9CEBF] text-[#8B3A13] focus:ring-[#8B3A13] accent-[#8B3A13] cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-[11px] text-[#625146] cursor-pointer font-medium"
              >
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8B3A13] hover:bg-[#732E0E] text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-3.5 pt-2.5 border-t border-[#F2ECE2] text-center">
            <p className="text-xs text-[#7D6B60]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#8B3A13] hover:text-[#6E2C0D] transition-colors underline-offset-2 hover:underline ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="text-center text-[10px] text-[#A8988C] mt-2">
            &copy; {new Date().getFullYear()} Jannat. All rights reserved.
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
