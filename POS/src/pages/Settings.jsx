
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Building2, Bell, ShieldCheck, ArrowRight, UserCircle, AlertCircle, CheckCircle2, QrCode, ExternalLink } from 'lucide-react';
// import api from '../api/client';
// import { useAuth } from '../context/AuthContext';

// function SettingsCard({ icon: Icon, title, children, delay = 0 }) {
//   return (
//     <div
//       style={{ animationDelay: `${delay}s` }}
//       className="fade-in-up border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300"
//     >
//       <div className="flex items-center gap-2 mb-4">
//         <Icon size={16} className="text-indigo-500" />
//         <p className="font-medium text-slate-800">{title}</p>
//       </div>
//       {children}
//     </div>
//   );
// }

// function MyProfileCard() {
//   const { user, updateUser } = useAuth();
//   const [fullName, setFullName] = useState(user?.name || '');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [saving, setSaving] = useState(false);

//   async function handleSave() {
//     setError('');
//     setSuccess('');

//     if (password && password !== confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }
//     if (password && password.length < 8) {
//       setError('Password must be at least 8 characters');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = { fullName };
//       if (password) payload.password = password;
//       await api.put('/admin-users/me', payload);
//       updateUser({ name: fullName });
//       setPassword('');
//       setConfirmPassword('');
//       setSuccess('Profile updated');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not save changes');
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <SettingsCard icon={UserCircle} title="My Profile">
//       <p className="text-xs text-slate-400 mb-3">{user?.email} &middot; <span className="capitalize">{user?.role?.replace('_', ' ')}</span></p>

//       <label className="text-sm text-slate-600 block mb-1">Full name</label>
//       <input
//         value={fullName}
//         onChange={(e) => setFullName(e.target.value)}
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//       />

//       <label className="text-sm text-slate-600 block mb-1">New password</label>
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Leave blank to keep current password"
//         className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//       />

//       {password && (
//         <>
//           <label className="text-sm text-slate-600 block mb-1">Confirm new password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//         </>
//       )}

//       {error && (
//         <p className="flex items-center gap-1.5 text-sm text-red-600 mb-3"><AlertCircle size={14} /> {error}</p>
//       )}
//       {success && (
//         <p className="flex items-center gap-1.5 text-sm text-indigo-600 mb-3"><CheckCircle2 size={14} /> {success}</p>
//       )}

//       <button
//         onClick={handleSave}
//         disabled={saving}
//         className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50 shadow shadow-indigo-200"
//       >
//         {saving ? 'Saving…' : 'Save changes'}
//       </button>
//     </SettingsCard>
//   );
// }

// export default function Settings() {
//   const [companyName, setCompanyName] = useState('My Company');
//   const [notifyLate, setNotifyLate] = useState(true);
//   const [notifyRequests, setNotifyRequests] = useState(true);
//   const { user } = useAuth();

//   return (
//     <div>
//       <p className="text-2xl font-bold text-slate-800 mb-1 fade-in-up">Settings</p>
//       <p className="text-sm text-slate-500 mb-6 fade-in-up">Manage system preferences</p>

//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <MyProfileCard />

//         <SettingsCard icon={Bell} title="Notifications" delay={0.08}>
//           <label className="flex items-center justify-between text-sm mb-3 text-slate-600">
//             Notify me when staff check in late
//             <input
//               type="checkbox"
//               checked={notifyLate}
//               onChange={(e) => setNotifyLate(e.target.checked)}
//               style={{ accentColor: '#6366f1' }}
//             />
//           </label>
//           <label className="flex items-center justify-between text-sm text-slate-600">
//             Notify me about new account requests
//             <input
//               type="checkbox"
//               checked={notifyRequests}
//               onChange={(e) => setNotifyRequests(e.target.checked)}
//               style={{ accentColor: '#6366f1' }}
//             />
//           </label>
//         </SettingsCard>
//       </div>

//       <div className="mb-4">
//         <a href="/scan" target="_blank" rel="noopener noreferrer">
//           <SettingsCard icon={QrCode} title="Kiosk Scanner" delay={0.16}>
//             <div className="flex items-center justify-between text-sm text-slate-500">
//               <span>Opens the public check-in scanner in a new tab — for testing on this device</span>
//               <ExternalLink size={16} className="shrink-0" />
//             </div>
//           </SettingsCard>
//         </a>
//       </div>

//       {user?.role === 'super_admin' && (
//         <div className="grid grid-cols-2 gap-4">
//           <SettingsCard icon={Building2} title="Company" delay={0.24}>
//             <label className="text-sm text-slate-600 block mb-1">Company name</label>
//             <input
//               value={companyName}
//               onChange={(e) => setCompanyName(e.target.value)}
//               className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             <button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium shadow shadow-indigo-200">
//               Save changes
//             </button>
//           </SettingsCard>

//           <Link to="/admin-accounts">
//             <SettingsCard icon={ShieldCheck} title="Admin accounts" delay={0.32}>
//               <div className="flex items-center justify-between text-sm text-slate-500">
//                 <span>Manage who has access to this dashboard — approve requests, revoke access</span>
//                 <ArrowRight size={16} className="shrink-0" />
//               </div>
//             </SettingsCard>
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Bell, ShieldCheck, ArrowRight, UserCircle, AlertCircle, CheckCircle2, QrCode, ExternalLink } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function SettingsCard({ icon: Icon, title, children, delay = 0, interactive = false }) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={`fade-in-up border rounded-2xl p-5 bg-white shadow-sm transition-all duration-200 ${
        interactive
          ? 'border-slate-200 hover:border-[#22D3A5]/50 hover:shadow-md cursor-pointer'
          : 'border-slate-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-[#0B1120]" />
        </div>
        <p className="font-medium text-slate-800 tracking-tight">{title}</p>
      </div>
      {children}
    </div>
  );
}

function MyProfileCard() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      const payload = { fullName };
      if (password) payload.password = password;
      await api.put('/admin-users/me', payload);
      updateUser({ name: fullName });
      setPassword('');
      setConfirmPassword('');
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsCard icon={UserCircle} title="My Profile">
      <p className="text-xs text-slate-400 mb-3">
        {user?.email} &middot; <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
      </p>

      <label className="text-sm font-medium text-slate-700 block mb-1.5">Full name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 mb-3 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
      />

      <label className="text-sm font-medium text-slate-700 block mb-1.5">New password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Leave blank to keep current password"
        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 mb-3 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
      />

      {password && (
        <>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 mb-3 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
          />
        </>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
          <AlertCircle size={14} className="shrink-0" /> {error}
        </p>
      )}
      {success && (
        <p className="flex items-center gap-1.5 text-sm text-[#0d9488] bg-[#22D3A5]/10 border border-[#22D3A5]/20 rounded-lg px-3 py-2 mb-3">
          <CheckCircle2 size={14} className="shrink-0" /> {success}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#0B1120] hover:bg-[#161f36] text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition-colors duration-150 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </SettingsCard>
  );
}

export default function Settings() {
  const [companyName, setCompanyName] = useState('My Company');
  const [notifyLate, setNotifyLate] = useState(true);
  const [notifyRequests, setNotifyRequests] = useState(true);
  const { user } = useAuth();

  return (
    <div>
      <p className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight fade-in-up">Settings</p>
      <p className="text-sm text-slate-500 mb-6 fade-in-up">Manage system preferences</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <MyProfileCard />

        <SettingsCard icon={Bell} title="Notifications" delay={0.08}>
          <label className="flex items-center justify-between text-sm mb-3 text-slate-600">
            Notify me when staff check in late
            <input
              type="checkbox"
              checked={notifyLate}
              onChange={(e) => setNotifyLate(e.target.checked)}
              style={{ accentColor: '#22D3A5' }}
            />
          </label>
          <label className="flex items-center justify-between text-sm text-slate-600">
            Notify me about new account requests
            <input
              type="checkbox"
              checked={notifyRequests}
              onChange={(e) => setNotifyRequests(e.target.checked)}
              style={{ accentColor: '#22D3A5' }}
            />
          </label>
        </SettingsCard>
      </div>

      <div className="mb-4">
        <a href="/scan" target="_blank" rel="noopener noreferrer">
          <SettingsCard icon={QrCode} title="Kiosk Scanner" delay={0.16} interactive>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Opens the public check-in scanner in a new tab — for testing on this device</span>
              <ExternalLink size={16} className="shrink-0" />
            </div>
          </SettingsCard>
        </a>
      </div>

      {user?.role === 'super_admin' && (
        <div className="grid grid-cols-2 gap-4">
          <SettingsCard icon={Building2} title="Company" delay={0.24}>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Company name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 mb-3 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
            />
            <button className="bg-[#0B1120] hover:bg-[#161f36] text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition-colors duration-150">
              Save changes
            </button>
          </SettingsCard>

          <Link to="/admin-accounts">
            <SettingsCard icon={ShieldCheck} title="Admin accounts" delay={0.32} interactive>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Manage who has access to this dashboard — approve requests, revoke access</span>
                <ArrowRight size={16} className="shrink-0" />
              </div>
            </SettingsCard>
          </Link>
        </div>
      )}
    </div>
  );
}
