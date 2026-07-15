import React, { createContext, useContext, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(() => {
    const stored = localStorage.getItem('staff_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const { data } = await api.post('/staff/login', { email, password });
    localStorage.setItem('staff_token', data.token);
    localStorage.setItem('staff_user', JSON.stringify(data.staff));
    setStaff(data.staff);
    return data.staff;
  }

  function logout() {
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_user');
    setStaff(null);
  }

  return (
    <AuthContext.Provider value={{ staff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
