

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Building2, Bell, ShieldCheck, ArrowRight, UserCircle, AlertCircle, CheckCircle2, QrCode, ExternalLink } from 'lucide-react';
// import api from '../api/client';
// import { useAuth } from '../context/AuthContext';

// function SettingsCard({ icon: Icon, title, children }) {
//   return (
//     <div className="border border-gray-200 rounded-xl p-5 bg-white">
//       <div className="flex items-center gap-2 mb-4">
//         <Icon size={16} className="text-gray-400" />
//         <p className="font-medium">{title}</p>
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
//       <p className="text-xs text-gray-400 mb-3">{user?.email} &middot; <span className="capitalize">{user?.role?.replace('_', ' ')}</span></p>

//       <label className="text-sm text-gray-600 block mb-1">Full name</label>
//       <input
//         value={fullName}
//         onChange={(e) => setFullName(e.target.value)}
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
//       />

//       <label className="text-sm text-gray-600 block mb-1">New password</label>
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Leave blank to keep current password"
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
//       />

//       {password && (
//         <>
//           <label className="text-sm text-gray-600 block mb-1">Confirm new password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
//           />
//         </>
//       )}

//       {error && (
//         <p className="flex items-center gap-1.5 text-sm text-red-600 mb-3"><AlertCircle size={14} /> {error}</p>
//       )}
//       {success && (
//         <p className="flex items-center gap-1.5 text-sm text-sky-600 mb-3"><CheckCircle2 size={14} /> {success}</p>
//       )}

//       <button
//         onClick={handleSave}
//         disabled={saving}
//         className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50"
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
//       <p className="text-2xl font-bold mb-1">Settings</p>
//       <p className="text-sm text-gray-500 mb-6">Manage system preferences</p>

//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <MyProfileCard />

//         <SettingsCard icon={Bell} title="Notifications">
//           <label className="flex items-center justify-between text-sm mb-3">
//             Notify me when staff check in late
//             <input type="checkbox" checked={notifyLate} onChange={(e) => setNotifyLate(e.target.checked)} />
//           </label>
//           <label className="flex items-center justify-between text-sm">
//             Notify me about new account requests
//             <input type="checkbox" checked={notifyRequests} onChange={(e) => setNotifyRequests(e.target.checked)} />
//           </label>
//         </SettingsCard>
//       </div>

//       <div className="mb-4">
//         <a href="/scan" target="_blank" rel="noopener noreferrer">
//           <SettingsCard icon={QrCode} title="Kiosk Scanner">
//             <div className="flex items-center justify-between text-sm text-gray-500">
//               <span>Opens the public check-in scanner in a new tab — for testing on this device</span>
//               <ExternalLink size={16} className="shrink-0" />
//             </div>
//           </SettingsCard>
//         </a>
//       </div>

//       {user?.role === 'super_admin' && (
//         <div className="grid grid-cols-2 gap-4">
//           <SettingsCard icon={Building2} title="Company">
//             <label className="text-sm text-gray-600 block mb-1">Company name</label>
//             <input
//               value={companyName}
//               onChange={(e) => setCompanyName(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
//             />
//             <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-lg font-medium">
//               Save changes
//             </button>
//           </SettingsCard>

//           <Link to="/admin-accounts">
//             <SettingsCard icon={ShieldCheck} title="Admin accounts">
//               <div className="flex items-center justify-between text-sm text-gray-500">
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

function SettingsCard({ icon: Icon, title, children, delay = 0 }) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className="fade-in-up border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-indigo-500" />
        <p className="font-medium text-slate-800">{title}</p>
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
      <p className="text-xs text-slate-400 mb-3">{user?.email} &middot; <span className="capitalize">{user?.role?.replace('_', ' ')}</span></p>

      <label className="text-sm text-slate-600 block mb-1">Full name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <label className="text-sm text-slate-600 block mb-1">New password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Leave blank to keep current password"
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {password && (
        <>
          <label className="text-sm text-slate-600 block mb-1">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600 mb-3"><AlertCircle size={14} /> {error}</p>
      )}
      {success && (
        <p className="flex items-center gap-1.5 text-sm text-indigo-600 mb-3"><CheckCircle2 size={14} /> {success}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50 shadow shadow-indigo-200"
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
      <p className="text-2xl font-bold text-slate-800 mb-1 fade-in-up">Settings</p>
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
              style={{ accentColor: '#6366f1' }}
            />
          </label>
          <label className="flex items-center justify-between text-sm text-slate-600">
            Notify me about new account requests
            <input
              type="checkbox"
              checked={notifyRequests}
              onChange={(e) => setNotifyRequests(e.target.checked)}
              style={{ accentColor: '#6366f1' }}
            />
          </label>
        </SettingsCard>
      </div>

      <div className="mb-4">
        <a href="/scan" target="_blank" rel="noopener noreferrer">
          <SettingsCard icon={QrCode} title="Kiosk Scanner" delay={0.16}>
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
            <label className="text-sm text-slate-600 block mb-1">Company name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg font-medium shadow shadow-indigo-200">
              Save changes
            </button>
          </SettingsCard>

          <Link to="/admin-accounts">
            <SettingsCard icon={ShieldCheck} title="Admin accounts" delay={0.32}>
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