import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMeUser } from '../store/slices/authSlice';

/**
 * AuthInitializer Component
 * Automatically dispatches getMeUser on application mount to rehydrate session from cookie / token.
 */
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(getMeUser());
    }
  }, [dispatch, isInitialized]);

  return <>{children}</>;
};

export default AuthInitializer;
