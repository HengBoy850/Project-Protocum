// import React from 'react'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext'
// import ProtectedRoute from './components/ProtectedRoute'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Pending from './pages/Pending'
// import Home from './pages/Home'
// import History from './pages/History'
// import Profile from './pages/Profile'

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/pending" element={<Pending />} />
//           <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//           <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   )
// }

import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SplashScreen from './components/SplashScreen'
import Login from './pages/Login'
import Register from './pages/Register'
import Pending from './pages/Pending'
import Home from './pages/Home'
import History from './pages/History'
import Profile from './pages/Profile'

const SPLASH_DURATION_MS = 1500;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}