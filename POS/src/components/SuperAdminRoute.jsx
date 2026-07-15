import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'super_admin') return <Navigate to="/" replace />;
  return children;
}
