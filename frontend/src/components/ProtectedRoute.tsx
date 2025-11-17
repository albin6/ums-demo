import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'user' | 'admin';
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  userType,
  redirectTo
}) => {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();

  const checkAuth = (): boolean => {
    if (userType === 'user') {
      return isAuthenticated;
    } else if (userType === 'admin') {
      return isAdminAuthenticated;
    }
    return false;
  };

  if (!checkAuth()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;