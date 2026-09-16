import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Cookie options helper for secure cookie setting
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // Prevents client-side scripts from accessing the cookie (XSS protection)
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // CSRF protection & cross-site support
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
  };
};

/**
 * Generate JWT token and attach it to response cookie
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'jannat_jwt_super_secret_key_2026_secure',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '15d',
    }
  );

  // Set secure HTTP-only cookie
  res.cookie('token', token, getCookieOptions());

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user,
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { fullName, mobileNumber, password } = req.body;

    // Validate required fields
    if (!fullName || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, mobile number, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Clean mobile number (trim spaces and dashes)
    const cleanedMobile = mobileNumber.toString().trim().replace(/[\s-]/g, '');

    // Check if mobile number already exists
    const existingUser = await User.findOne({ mobileNumber: cleanedMobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this mobile number is already registered.',
      });
    }

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      mobileNumber: cleanedMobile,
      password,
    });

    return sendTokenResponse(user, 201, res, 'Registration successful!');
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

/**
 * @desc    Authenticate user & get token (Login with mobile number & password)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mobile number and password.',
      });
    }

    // Clean mobile number
    const cleanedMobile = mobileNumber.toString().trim().replace(/[\s-]/g, '');

    // Find user by mobile number
    const user = await User.findOne({ mobileNumber: cleanedMobile });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password.',
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password.',
      });
    }

    return sendTokenResponse(user, 200, res, 'Login successful!');
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during logout.',
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile.',
    });
  }
};
