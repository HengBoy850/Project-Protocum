


// import React from 'react'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext'
// import ProtectedRoute from './components/ProtectedRoute'
// import SuperAdminRoute from './components/SuperAdminRoute'
// import Sidebar from './components/Sidebar'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
// import AccountRequests from './pages/AccountRequests'
// import StaffManagement from './pages/StaffManagement'
// import AttendanceRecords from './pages/AttendanceRecords'
// import Departments from './pages/Departments'
// import AdminAccounts from './pages/AdminAccounts'
// import Settings from './pages/Settings'
// import ScanKiosk from './pages/ScanKiosk'

// function Layout({ children }) {
//   return (
//     <div className="flex bg-gray-50 min-h-screen">
//       <Sidebar />
//       <main className="flex-1 p-8">{children}</main>
//     </div>
//   )
// }

// function Protected({ children }) {
//   return (
//     <ProtectedRoute>
//       <Layout>{children}</Layout>
//     </ProtectedRoute>
//   )
// }

// function SuperAdminOnly({ children }) {
//   return (
//     <ProtectedRoute>
//       <SuperAdminRoute>
//         <Layout>{children}</Layout>
//       </SuperAdminRoute>
//     </ProtectedRoute>
//   )
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Public — no login, meant for a kiosk tablet at the door */}
//           <Route path="/scan" element={<ScanKiosk />} />

//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/" element={<Protected><Dashboard /></Protected>} />
//           <Route path="/requests" element={<Protected><AccountRequests /></Protected>} />
//           <Route path="/staff" element={<Protected><StaffManagement /></Protected>} />
//           <Route path="/attendance" element={<Protected><AttendanceRecords /></Protected>} />
//           <Route path="/departments" element={<Protected><Departments /></Protected>} />
//           <Route path="/admin-accounts" element={<SuperAdminOnly><AdminAccounts /></SuperAdminOnly>} />
//           <Route path="/settings" element={<Protected><Settings /></Protected>} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   )
// }


import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SuperAdminRoute from './components/SuperAdminRoute'
import Sidebar from './components/Sidebar'
import PageTransition from './components/PageTransition'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AccountRequests from './pages/AccountRequests'
import StaffManagement from './pages/StaffManagement'
import AttendanceRecords from './pages/AttendanceRecords'
import Departments from './pages/Departments'
import AdminAccounts from './pages/AdminAccounts'
import Settings from './pages/Settings'
import ScanKiosk from './pages/ScanKiosk'

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      {/* Only this scrolls — sidebar stays put */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  )
}

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

function SuperAdminOnly({ children }) {
  return (
    <ProtectedRoute>
      <SuperAdminRoute>
        <Layout>{children}</Layout>
      </SuperAdminRoute>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/scan" element={<ScanKiosk />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/requests" element={<Protected><AccountRequests /></Protected>} />
          <Route path="/staff" element={<Protected><StaffManagement /></Protected>} />
          <Route path="/attendance" element={<Protected><AttendanceRecords /></Protected>} />
          <Route path="/departments" element={<Protected><Departments /></Protected>} />
          <Route path="/admin-accounts" element={<SuperAdminOnly><AdminAccounts /></SuperAdminOnly>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}