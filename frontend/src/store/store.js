import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import parityReducer from "./slices/parity.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parity: parityReducer,
  },
});

export default store;