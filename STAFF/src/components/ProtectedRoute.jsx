import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { staff } = useAuth();
  if (!staff) return <Navigate to="/login" replace />;
  return children;
}
