

// import React, { useEffect, useState } from 'react';
// import { LogOut, Mail, Phone, Building2, Briefcase, Pencil, X, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
// import api from '../api/client';
// import BottomNav from '../components/BottomNav';
// import { useAuth } from '../context/AuthContext';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// function EditProfileModal({ profile, onClose, onSaved }) {
//   const [fullName, setFullName] = useState(profile.full_name);
//   const [phone, setPhone] = useState(profile.phone);
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);

//   async function handleSave() {
//     setError('');
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
//       const payload = { fullName, phone };
//       if (password) payload.password = password;
//       await api.put('/staff/me', payload);
//       onSaved();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not save changes');
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
//       <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
//         <div className="flex items-center justify-between mb-4">
//           <p className="font-semibold text-lg text-[#1E1B3A]">Edit profile</p>
//           <button onClick={onClose} className="text-[#8B87A6] hover:text-[#1E1B3A] hover:bg-[#F4F5FA] rounded-full p-1">
//             <X size={18} />
//           </button>
//         </div>

//         <div className="space-y-3">
//           <div>
//             <label className="text-sm text-[#8B87A6] block mb-1">Full name</label>
//             <input
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full bg-[#F4F5FA] border border-transparent rounded-xl px-3 py-2.5 text-sm text-[#1E1B3A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-[#8B87A6] block mb-1">Phone</label>
//             <input
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full bg-[#F4F5FA] border border-transparent rounded-xl px-3 py-2.5 text-sm text-[#1E1B3A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-[#8B87A6] block mb-1">New password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Leave blank to keep current password"
//               className="w-full bg-[#F4F5FA] border border-transparent rounded-xl px-3 py-2.5 text-sm text-[#1E1B3A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
//             />
//           </div>
//           {password && (
//             <div>
//               <label className="text-sm text-[#8B87A6] block mb-1">Confirm new password</label>
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full bg-[#F4F5FA] border border-transparent rounded-xl px-3 py-2.5 text-sm text-[#1E1B3A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40"
//               />
//             </div>
//           )}
//         </div>

//         {error && (
//           <p className="flex items-center gap-1.5 text-sm text-[#E24C3F] mt-3">
//             <AlertCircle size={14} /> {error}
//           </p>
//         )}

//         <div className="flex gap-2 mt-5">
//           <button onClick={onClose} className="flex-1 border border-[#E8E9F3] text-[#1E1B3A] rounded-xl py-2.5 text-sm font-medium hover:bg-[#F4F5FA] transition-colors">
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex-1 bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 transition-colors shadow-md shadow-[#6C63FF]/25"
//           >
//             {saving ? 'Saving…' : 'Save changes'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const INFO_ROWS_CONFIG = [
//   { key: 'email', icon: Mail, label: 'Email', chip: 'bg-[#EAF1FF] text-[#3D7BF0]' },
//   { key: 'phone', icon: Phone, label: 'Phone', chip: 'bg-[#E9FBF3] text-[#22B87C]' },
//   { key: 'department_name', icon: Building2, label: 'Department', fallback: 'No department', chip: 'bg-[#FFF3E6] text-[#F0973D]' },
//   { key: 'position', icon: Briefcase, label: 'Position', chip: 'bg-[#F1EDFF] text-[#6C63FF]' },
// ];

// export default function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [savedMsg, setSavedMsg] = useState(false);
//   const { logout } = useAuth();

//   function load() {
//     api.get('/staff/me').then((res) => setProfile(res.data));
//   }

//   useEffect(() => { load(); }, []);

//   const initials = profile?.full_name?.split(' ').map((p) => p[0]).join('').toUpperCase() || '?';

//   return (
//     <div className="min-h-screen bg-[#F4F5FA] pb-28">
//       <div className="max-w-md mx-auto">

//         <div className="relative pb-16" style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #4A42D6 100%)', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}>
//           <div className="flex items-center justify-between px-5 pt-6">
//             <div>
//               <p className="font-semibold text-lg text-white">Profile</p>
//               <p className="text-xs text-white/70 mt-0.5">Manage your account</p>
//             </div>
//             <button
//               onClick={() => setEditing(true)}
//               className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#6C63FF] shadow-md"
//             >
//               <Pencil size={14} />
//             </button>
//           </div>
//         </div>

//         <div className="px-4 -mt-12">
//           <div className="bg-white rounded-3xl shadow-lg shadow-black/5 px-4 pt-4 pb-5">
//             <div className="flex items-center gap-3">
//               {profile?.photo_url ? (
//                 <img
//                   src={`${API_ORIGIN}${profile.photo_url}`}
//                   alt={profile.full_name}
//                   className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
//                 />
//               ) : (
//                 <div className="w-16 h-16 rounded-2xl bg-[#F1EDFF] flex items-center justify-center text-xl font-semibold text-[#6C63FF] ring-4 ring-white shadow-md">
//                   {initials}
//                 </div>
//               )}
//               <div>
//                 <p className="font-semibold text-base text-[#1E1B3A]">{profile?.full_name}</p>
//                 <p className="text-xs text-[#8B87A6] font-mono mt-0.5">{profile?.employee_code}</p>
//               </div>
//             </div>

//             {savedMsg && (
//               <p className="flex items-center gap-1.5 text-xs text-[#22B87C] mt-3">
//                 <CheckCircle2 size={13} /> Profile updated
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="px-4 mt-6">
//           <p className="text-[11px] font-semibold text-[#8B87A6] uppercase tracking-wide mb-2 px-1">Account details</p>
//           <div className="bg-white rounded-2xl divide-y divide-[#F0F0F7] mb-5 shadow-sm shadow-black/5">
//             {INFO_ROWS_CONFIG.map(({ key, icon: Icon, label, fallback, chip }) => (
//               <div key={key} className="flex items-center gap-3 px-4 py-3.5">
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${chip}`}>
//                   <Icon size={16} />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="text-[11px] text-[#8B87A6]">{label}</p>
//                   <p className="text-sm font-medium text-[#1E1B3A] truncate">{profile?.[key] || fallback || '—'}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={logout}
//             className="w-full flex items-center justify-center gap-2 bg-white border border-[#FBDAD6] text-[#E24C3F] rounded-2xl py-3 text-sm font-medium hover:bg-[#FFF6F5] transition-colors shadow-sm shadow-black/5 mb-5"
//           >
//             <LogOut size={15} /> Log out
//           </button>

//           <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #4A42D6 100%)' }}>
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-white">Account security</p>
//               <p className="text-xs text-white/70 mt-0.5">Keep your account secure and update your information regularly.</p>
//             </div>
//             <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
//               <ShieldCheck size={20} className="text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {editing && (
//         <EditProfileModal
//           profile={profile}
//           onClose={() => setEditing(false)}
//           onSaved={() => {
//             load();
//             setSavedMsg(true);
//             setTimeout(() => setSavedMsg(false), 3000);
//           }}
//         />
//       )}

//       <BottomNav />
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Grip,
  LogOut,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import api from '../api/client';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function EditProfileModal({ profile, onClose, onSaved }) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setError('');

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
      const payload = { fullName, phone };
      if (password) payload.password = password;

      await api.put('/staff/me', payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl shadow-slate-950/25"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[#20243F]">Edit profile</p>
            <p className="text-sm text-[#858BA3]">Update your account details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F5FB] text-[#858BA3] transition hover:bg-[#EDEFFA] hover:text-[#20243F]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3.5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#747A93]">Full name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#747A93]">Phone</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#747A93]">New password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
            />
          </label>

          {password && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#747A93]">Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              />
            </label>
          )}
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#FF5A4A]">
            <AlertCircle size={16} /> {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[#E5E7F2] py-3 text-sm font-bold text-[#747A93] transition hover:bg-[#F6F7FC]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-2xl bg-[#7158F6] py-3 text-sm font-bold text-white shadow-lg shadow-[#7158F6]/25 transition hover:bg-[#6047E8] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

const INFO_ROWS_CONFIG = [
  {
    key: 'email',
    icon: Mail,
    label: 'Email',
    iconClassName: 'bg-[#F0EDFF] text-[#7158F6]',
  },
  {
    key: 'phone',
    icon: Phone,
    label: 'Phone',
    iconClassName: 'bg-[#EAFBEF] text-[#34C76F]',
  },
  {
    key: 'department_name',
    icon: Building2,
    label: 'Department',
    fallback: 'No department',
    iconClassName: 'bg-[#FFF3E6] text-[#FF8A1D]',
  },
  {
    key: 'position',
    icon: BriefcaseBusiness,
    label: 'Position',
    fallback: 'No position',
    iconClassName: 'bg-[#EDF5FF] text-[#3F8DFF]',
  },
];

function ProfileAvatar({ profile, initials }) {
  if (profile?.photo_url) {
    return (
      <img
        src={`${API_ORIGIN}${profile.photo_url}`}
        alt={profile.full_name || 'Profile'}
        className="h-28 w-28 rounded-full border-[5px] border-white object-cover shadow-xl shadow-[#7158F6]/20"
      />
    );
  }

  return (
    <div className="flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-white bg-gradient-to-br from-[#F0EDFF] to-[#E8F2FF] text-3xl font-black text-[#7158F6] shadow-xl shadow-[#7158F6]/20">
      {initials}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const { logout } = useAuth();

  function load() {
    api.get('/staff/me').then((res) => setProfile(res.data));
  }

  useEffect(() => {
    load();
  }, []);

  const initials = useMemo(() => {
    return (
      profile?.full_name
        ?.split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '?'
    );
  }, [profile?.full_name]);

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-28 text-[#20243F]">
      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-[#F8F9FE] shadow-2xl shadow-slate-900/5">
        <header className="relative h-[305px] overflow-hidden bg-gradient-to-br from-[#785BFF] via-[#5F74FF] to-[#1D91FF] px-8 pt-14 text-white">
          <div className="absolute -right-16 top-12 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute right-8 top-32 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 left-1/2 h-44 w-[620px] -translate-x-1/2 rounded-[50%] bg-[#F8F9FE]" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black leading-none tracking-normal">Profile</h1>
              <p className="mt-3 text-xl font-medium text-white/85">Manage your account</p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#20243F] shadow-xl shadow-[#293B95]/20 transition hover:scale-105 hover:bg-white"
              aria-label="Edit profile"
            >
              <Pencil size={24} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        <main className="relative -mt-20 px-7">
          <section className="relative z-20 flex items-end gap-7">
            <div className="relative shrink-0">
              <ProfileAvatar profile={profile} initials={initials} />
              <span className="absolute bottom-3 right-1 h-7 w-7 rounded-full border-[5px] border-white bg-[#33D176]" />
            </div>

            <div className="pb-5">
              <h2 className="max-w-[190px] truncate text-3xl font-black tracking-normal text-[#20243F]">
                {profile?.full_name || 'Loading...'}
              </h2>
              <span className="mt-4 inline-flex max-w-[160px] items-center rounded-full border border-[#DDD6FF] bg-white px-4 py-1 text-sm font-black text-[#7158F6] shadow-sm">
                <span className="truncate">{profile?.employee_code || 'EMP_0000'}</span>
              </span>
            </div>
          </section>

          {savedMsg && (
            <p className="mt-4 flex items-center gap-2 rounded-2xl bg-[#EAFBEF] px-4 py-3 text-sm font-bold text-[#22A75D]">
              <CheckCircle2 size={17} /> Profile updated
            </p>
          )}

          <section className="mt-8">
            <div className="mb-4 flex items-center gap-3 text-[#8D94A9]">
              <Grip size={21} className="text-[#C9CEDD]" />
              <p className="text-base font-bold uppercase tracking-normal">Account Details</p>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#E9ECF5] bg-white shadow-xl shadow-[#47546D]/10">
              {INFO_ROWS_CONFIG.map(({ key, icon: Icon, label, fallback, iconClassName }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex w-full items-center gap-5 border-b border-[#EEF0F6] px-5 py-5 text-left last:border-b-0 transition hover:bg-[#FAFBFF]"
                >
                  <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] ${iconClassName}`}>
                    <Icon size={30} strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-[#858BA3]">{label}</span>
                    <span className="mt-1 block truncate text-xl font-bold text-[#20243F]">
                      {profile?.[key] || fallback || '-'}
                    </span>
                  </span>
                  <ChevronRight size={28} className="shrink-0 text-[#A5AAB8]" strokeWidth={2.2} />
                </button>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={logout}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-[20px] border-2 border-[#FFC7C0] bg-white py-5 text-xl font-bold text-[#FF5A4A] transition hover:bg-[#FFF3F1]"
          >
            <LogOut size={26} strokeWidth={2.4} />
            Log out
          </button>

          <section className="relative mt-8 overflow-hidden rounded-[20px] border border-[#E5E0FF] bg-gradient-to-br from-[#F6F2FF] via-[#F9F7FF] to-[#EEF3FF] px-6 py-7 shadow-lg shadow-[#7158F6]/10">
            <div className="relative z-10 max-w-[62%]">
              <h3 className="text-xl font-black text-[#5436B9]">Account Security</h3>
              <p className="mt-3 text-base font-medium leading-7 text-[#3F348F]">
                Keep your account secure and update your information regularly.
              </p>
            </div>
            <Sparkles size={24} className="absolute right-8 top-5 text-[#9C86FF]" fill="currentColor" />
            <Sparkles size={15} className="absolute right-16 top-20 text-[#9C86FF]" fill="currentColor" />
            <Sparkles size={13} className="absolute right-36 top-14 text-[#9C86FF]" fill="currentColor" />
            <div className="absolute bottom-5 right-7 flex h-24 w-24 rotate-6 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#8C73FF] to-[#5C43DA] text-white shadow-2xl shadow-[#7158F6]/35">
              <ShieldCheck size={58} strokeWidth={2.4} />
            </div>
          </section>
        </main>
      </div>

      {editing && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSaved={() => {
            load();
            setSavedMsg(true);
            setTimeout(() => setSavedMsg(false), 3000);
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}
