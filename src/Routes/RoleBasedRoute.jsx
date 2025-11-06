import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const RoleBasedRoute = ({ children, unauthorizedRole }) => {
  const user = getUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.RoleId == unauthorizedRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default RoleBasedRoute;
