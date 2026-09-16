import api from './apiClient';

/**
 * Register a new user
 * @param {Object} userData - { fullName, mobileNumber, password }
 */
export const registerApi = async (userData) => {
  return await api.post('/auth/register', userData);
};

/**
 * Login user
 * @param {Object} credentials - { mobileNumber, password }
 */
export const loginApi = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

/**
 * Logout current user
 */
export const logoutApi = async () => {
  return await api.post('/auth/logout');
};

/**
 * Fetch current authenticated user profile
 */
export const getMeApi = async () => {
  return await api.get('/auth/me');
};
