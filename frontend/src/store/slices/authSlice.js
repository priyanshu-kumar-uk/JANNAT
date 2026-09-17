import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi, loginApi, logoutApi, getMeApi } from '../../apis/auth.api';

// Initial stored token if available
const storedToken = localStorage.getItem('token') || null;

/**
 * Async Thunk: Register User
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed.');
    }
  }
);

/**
 * Async Thunk: Login User
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed.');
    }
  }
);

/**
 * Async Thunk: Get Current Authenticated User (Profile / Session Check)
 */
export const getMeUser = createAsyncThunk(
  'auth/getMeUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMeApi();
      return response;
    } catch (error) {
      // Clear token on 401 or invalid session
      localStorage.removeItem('token');
      return rejectWithValue(error.message || 'Session expired.');
    }
  }
);

/**
 * Async Thunk: Logout User
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.message || 'Logout failed.');
    }
  }
);

const initialState = {
  user: null,
  token: storedToken,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false, // Tracks initial profile fetch on app launch
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    updateWalletBalance: (state, action) => {
      const amountToAdd = Number(action.payload) || 0;
      if (state.user) {
        state.user.walletBalance = (Number(state.user.walletBalance) || 0) + amountToAdd;
      } else {
        state.user = {
          fullName: 'Guest User',
          mobileNumber: '9999999999',
          walletBalance: amountToAdd,
        };
      }
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isInitialized = true;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token || state.token;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token || state.token;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Me / Session Check
      .addCase(getMeUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMeUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(getMeUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearAuthError, resetAuth, updateWalletBalance } = authSlice.actions;
export default authSlice.reducer;
