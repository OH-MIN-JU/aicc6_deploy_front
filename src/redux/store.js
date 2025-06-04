import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import apiReducer from './slices/apiSlice';
import modalReducer from './slices/modalSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    modal: modalReducer,
  },
});

export default store;
