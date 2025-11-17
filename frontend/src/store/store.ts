import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { injectStore } from '../services/storeAccess';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginUser/fulfilled', 'auth/loginAdmin/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;