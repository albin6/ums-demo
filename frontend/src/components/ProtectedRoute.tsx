import React from 'react';
import { Navigate } from 'react-router-dom';

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
  const isAuthenticated = (): boolean => {
    if (userType === 'user') {
      return !!localStorage.getItem('token');
    } else if (userType === 'admin') {
      return !!localStorage.getItem('adminToken');
    }
    return false;
  };

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;