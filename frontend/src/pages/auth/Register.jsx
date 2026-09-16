import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import GameShowcase from '../../components/games/GameShowcase';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error: authError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Clear previous auth errors when component mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
    if (authError) dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const mobileNumber = formData.mobileNumber.trim();

    if (!fullName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!mobileNumber) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions.');
      return;
    }

    setErrorMessage('');

    try {
      const resultAction = await dispatch(
        registerUser({
          fullName,
          mobileNumber,
          password: formData.password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/', { replace: true });
      } else if (registerUser.rejected.match(resultAction)) {
        setErrorMessage(resultAction.payload || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  const displayError = errorMessage || authError;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF6F0] flex items-center justify-center p-2 sm:p-4 select-none">
      
      {/* Centralized Card Container - Fixed to Viewport Height */}
      <div className="w-full max-w-4xl max-h-[95vh] bg-white border border-[#EBE3D7] rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row my-auto relative">
        
        {/* Left Side: Game Showcase */}
        <div className="hidden md:flex w-1/2 bg-[#1A110B]">
          <GameShowcase />
        </div>

        {/* Right Side: Compact Non-scrolling Register Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 lg:p-7 flex flex-col justify-between bg-white overflow-hidden relative">
          
          {/* Top Bar with Back to Home Button */}
          <div className="flex items-center justify-between w-full mb-1 sm:mb-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#F2ECE2] text-[#8B3A13] border border-[#EBE3D7] text-[11px] font-bold transition-colors cursor-pointer group"
              title="Back to Home"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>
            <span className="text-[10px] font-semibold text-[#8C7A6F] uppercase tracking-wider">
              Jannat
            </span>
          </div>

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-2.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D7] flex items-center justify-center p-1.5 mb-1.5">
              <img
                src="/logo/Jannat-Logo.png"
                alt="Jannat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2B1B14] font-serif">
              Create Account
            </h1>
            <p className="text-[11px] text-[#7D6B60] mt-0.5">
              Join Jannat & claim your welcome bonus
            </p>
          </div>

          {/* Error Notice */}
          {displayError && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-[#FDF2F2] border border-[#F8D7DA] text-[#BC2B38] text-xs font-medium">
              {displayError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#4A382F] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-3 py-2 bg-[#FCFBF8] text-[#2B1B14] placeholder-[#B5A599] text-xs rounded-xl border border-[#E2D8CC] focus:outline-none focus:border-[#8B3A13] focus:ring-1 focus:ring-[#8B3A13] transition-colors"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[10px] font-bold text-[#4A382F] uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9C8A7E]">
                  <Phone size={15} />
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  required
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-[#FCFBF8] text-[#2B1B14] placeholder-[#B5A599] text-xs rounded-xl border border-[#E2D8CC] focus:outline-none focus:border-[#8B3A13] focus:ring-1 focus:ring-[#8B3A13] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-[#4A382F] uppercase tracking-wider mb-1">
                Password
              </label>
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
                  placeholder="Min 6 characters"
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

            {/* Terms Agreement */}
            <div className="flex items-center pt-0.5">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-3.5 h-3.5 rounded border-[#D9CEBF] text-[#8B3A13] focus:ring-[#8B3A13] accent-[#8B3A13] cursor-pointer"
              />
              <label
                htmlFor="agreeTerms"
                className="ml-2 text-[11px] text-[#625146] cursor-pointer"
              >
                I agree to the{' '}
                <a href="#terms" className="text-[#8B3A13] hover:underline font-semibold">
                  Terms & Conditions
                </a>
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
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-3.5 pt-2.5 border-t border-[#F2ECE2] text-center">
            <p className="text-xs text-[#7D6B60]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#8B3A13] hover:text-[#6E2C0D] transition-colors underline-offset-2 hover:underline ml-1"
              >
                Login
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

export default Register;
