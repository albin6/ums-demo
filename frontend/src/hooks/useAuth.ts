import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  loginUser,
  loginAdmin,
  signupUser,
  fetchUserProfile,
  logoutUser,
  logoutAdmin,
  clearError,
  setAuthFromStorage,
  createUserByAdmin
} from '../store/authSlice';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return {
    user: auth.user,
    token: auth.token,
    admin: auth.admin,
    adminToken: auth.adminToken,
    isAuthenticated: auth.isAuthenticated,
    isAdminAuthenticated: auth.isAdminAuthenticated,
    loading: auth.loading,
    error: auth.error,

    login: (email: string, password: string) => dispatch(loginUser({ email, password })),
    loginAdmin: (email: string, password: string) => dispatch(loginAdmin({ email, password })),
    signup: (name: string, email: string, password: string) => dispatch(signupUser({ name, email, password })),
    fetchProfile: () => dispatch(fetchUserProfile()),
    logoutUser: () => dispatch(logoutUser()),
    logoutAdmin: () => dispatch(logoutAdmin()),
    clearError: () => dispatch(clearError()),
    setAuthFromStorage: () => dispatch(setAuthFromStorage()),
    createUserByAdmin: (name: string, email: string, password: string) =>
      dispatch(createUserByAdmin({ name, email, password })),
  };
};