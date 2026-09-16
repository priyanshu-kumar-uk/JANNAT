import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Middleware to authenticate requests using cookie-based token or Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check cookies first for the token
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization Bearer header if cookie is not present
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found in cookie or header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token is missing.',
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jannat_jwt_super_secret_key_2026_secure'
    );

    // Fetch user details from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists. Authorization denied.',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Attach authenticated user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};

/**
 * Middleware to restrict route access to specific roles (e.g. 'admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role || 'user'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};
