// import React, { createContext, useContext, useState } from 'react';
// import api from '../api/client';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem('pos_user');
//     return stored ? JSON.parse(stored) : null;
//   });

//   async function login(email, password) {
//     const { data } = await api.post('/auth/login', { email, password });
//     localStorage.setItem('pos_token', data.token);
//     localStorage.setItem('pos_user', JSON.stringify(data.user));
//     setUser(data.user);
//     return data.user;
//   }

//   function logout() {
//     localStorage.removeItem('pos_token');
//     localStorage.removeItem('pos_user');
//     setUser(null);
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
import React, { createContext, useContext, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pos_user');
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('pos_token', data.token);
    localStorage.setItem('pos_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
    setUser(null);
  }

  // Called after a successful PUT /api/admin-users/me so the sidebar/greeting
  // update immediately without needing to log out and back in.
  function updateUser(partial) {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('pos_user', JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
