

// import React, { useEffect, useState } from 'react';
// import { Check, X, UserMinus, Pencil, Lock, AlertCircle } from 'lucide-react';
// import api from '../api/client';
// import { useAuth } from '../context/AuthContext';

// const POLL_INTERVAL_MS = 15000;

// function EditProfileModal({ account, onClose, onSaved }) {
//   const [fullName, setFullName] = useState(account.full_name);
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);
//   const { updateUser } = useAuth();

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
//       const payload = { fullName };
//       if (password) payload.password = password;
//       await api.put('/admin-users/me', payload);
//       updateUser({ name: fullName }); // reflect the new name in the sidebar immediately
//       onSaved();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not save changes');
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
//       <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
//         <p className="font-semibold mb-4">Edit your profile</p>

//         <div className="flex flex-col gap-3">
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Full name</label>
//             <input
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">New password (optional)</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Leave blank to keep current password"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//             />
//           </div>
//           {password && (
//             <div>
//               <label className="text-sm text-gray-600 block mb-1">Confirm new password</label>
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               />
//             </div>
//           )}

//           {error && <p className="text-sm text-red-600">{error}</p>}

//           <div className="flex gap-2 mt-2">
//             <button onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium">
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className="flex-1 bg-emerald-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50"
//             >
//               {saving ? 'Saving…' : 'Save changes'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AdminAccounts() {
//   const [tab, setTab] = useState('pending');
//   const [accounts, setAccounts] = useState([]);
//   const [error, setError] = useState('');
//   const [editingAccount, setEditingAccount] = useState(null);
//   const { user } = useAuth();

//   async function load() {
//     try {
//       const { data } = await api.get('/admin-users', { params: { status: tab } });
//       setAccounts(data);
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not load accounts');
//     }
//   }

//   useEffect(() => {
//     load();
//     const interval = setInterval(load, POLL_INTERVAL_MS);
//     return () => clearInterval(interval);
//   }, [tab]);

//   async function approve(id) {
//     try {
//       await api.post(`/admin-users/${id}/approve`);
//       load();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not approve this account');
//     }
//   }

//   async function deny(id) {
//     if (!confirm('Deny this request? They can register again if this was a mistake.')) return;
//     try {
//       await api.post(`/admin-users/${id}/deny`);
//       load();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not deny this account');
//     }
//   }

//   async function revoke(id) {
//     if (!confirm("Revoke this account's access? They won't be able to log in anymore.")) return;
//     try {
//       await api.delete(`/admin-users/${id}`);
//       load();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not revoke this account');
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-1">
//         <p className="text-2xl font-bold">Admin Accounts</p>
//       </div>
//       <p className="text-sm text-gray-500 mb-4">
//         {accounts.length} {tab === 'pending' ? 'pending request' : tab}{tab === 'pending' && accounts.length !== 1 ? 's' : ''}
//         {' '}&middot; you can only edit your own profile, but can revoke anyone else's access
//       </p>

//       {error && (
//         <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
//           <AlertCircle size={15} className="shrink-0" />
//           {error}
//         </div>
//       )}

//       <div className="flex gap-2 mb-4">
//         {['pending', 'active', 'revoked'].map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
//               tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
//             <tr>
//               <th className="text-left px-4 py-3">Name</th>
//               <th className="text-left px-4 py-3">Email</th>
//               <th className="text-left px-4 py-3">Role</th>
//               <th className="text-left px-4 py-3">Last login</th>
//               <th className="text-left px-4 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {accounts.map((a) => {
//               const isSelf = a.id === user?.id;
//               return (
//                 <tr key={a.id} className="border-t border-gray-100">
//                   <td className="px-4 py-3 font-medium">
//                     {a.full_name} {isSelf && <span className="text-xs text-gray-400">(you)</span>}
//                   </td>
//                   <td className="px-4 py-3 text-gray-500">{a.email}</td>
//                   <td className="px-4 py-3 capitalize">{a.role.replace('_', ' ')}</td>
//                   <td className="px-4 py-3 text-gray-400">
//                     {a.last_login ? new Date(a.last_login).toLocaleString() : 'Never'}
//                   </td>
//                   <td className="px-4 py-3">
//                     {tab === 'pending' ? (
//                       <div className="flex gap-3">
//                         <button onClick={() => approve(a.id)} className="flex items-center gap-1 text-emerald-700 text-xs font-medium">
//                           <Check size={13} /> Approve
//                         </button>
//                         <button onClick={() => deny(a.id)} className="flex items-center gap-1 text-red-600 text-xs font-medium">
//                           <X size={13} /> Deny
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex gap-3 items-center">
//                         <button
//                           disabled={!isSelf}
//                           onClick={() => isSelf && setEditingAccount(a)}
//                           title={isSelf ? 'Edit your profile' : "You can only edit your own profile"}
//                           className={`flex items-center gap-1 text-xs font-medium ${
//                             isSelf ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 cursor-not-allowed'
//                           }`}
//                         >
//                           {isSelf ? <Pencil size={13} /> : <Lock size={13} />} Edit
//                         </button>
//                         {tab === 'active' && (
//                           <button
//                             disabled={isSelf}
//                             onClick={() => revoke(a.id)}
//                             title={isSelf ? "You can't revoke your own account" : 'Revoke access'}
//                             className={`flex items-center gap-1 text-xs font-medium ${
//                               isSelf ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-800'
//                             }`}
//                           >
//                             <UserMinus size={13} /> Revoke
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//             {accounts.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
//                   No {tab} accounts
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {editingAccount && (
//         <EditProfileModal
//           account={editingAccount}
//           onClose={() => setEditingAccount(null)}
//           onSaved={load}
//         />
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { Check, X, UserMinus, Pencil, Lock, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const POLL_INTERVAL_MS = 15000;

function EditProfileModal({ account, onClose, onSaved }) {
  const [fullName, setFullName] = useState(account.full_name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { updateUser } = useAuth();

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
      const payload = { fullName };
      if (password) payload.password = password;
      await api.put('/admin-users/me', payload);
      updateUser({ name: fullName }); // reflect the new name in the sidebar immediately
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#E7E5E0]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold mb-4 text-[#1C1E22]">Edit your profile</p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-[#6B6F76] block mb-1">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
            />
          </div>
          <div>
            <label className="text-sm text-[#6B6F76] block mb-1">New password (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm placeholder:text-[#B5B2A8] focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
            />
          </div>
          {password && (
            <div>
              <label className="text-sm text-[#6B6F76] block mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
              />
            </div>
          )}

          {error && <p className="text-sm text-[#B8451A]">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-[#E7E5E0] rounded-lg py-2 text-sm font-medium text-[#6B6F76] hover:bg-[#F7F6F2] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#1C1E22] text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 hover:bg-[#33363C] transition-colors"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAccounts() {
  const [tab, setTab] = useState('pending');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);
  const { user } = useAuth();

  async function load() {
    try {
      const { data } = await api.get('/admin-users', { params: { status: tab } });
      setAccounts(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load accounts');
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tab]);

  async function approve(id) {
    try {
      await api.post(`/admin-users/${id}/approve`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not approve this account');
    }
  }

  async function deny(id) {
    if (!confirm('Deny this request? They can register again if this was a mistake.')) return;
    try {
      await api.post(`/admin-users/${id}/deny`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not deny this account');
    }
  }

  async function revoke(id) {
    if (!confirm("Revoke this account's access? They won't be able to log in anymore.")) return;
    try {
      await api.delete(`/admin-users/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not revoke this account');
    }
  }

  return (
    <div className="bg-[#FAFAF7] min-h-full font-sans text-[#1C1E22]">
      <div className="flex items-center justify-between mb-1">
        <p className="text-2xl font-bold tracking-tight">Admin Accounts</p>
      </div>
      <p className="text-sm text-[#8A8D93] mb-5">
        {accounts.length} {tab === 'pending' ? 'pending request' : tab}{tab === 'pending' && accounts.length !== 1 ? 's' : ''}
        {' '}&middot; you can only edit your own profile, but can revoke anyone else's access
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-[#FBEAE5] text-[#B8451A] text-sm px-3 py-2.5 rounded-lg mb-4">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-1 bg-[#F0EEE8] p-1 rounded-xl border border-[#E7E5E0] w-fit mb-5">
        {['pending', 'active', 'revoked'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              tab === t ? 'bg-[#1C1E22] text-white shadow-sm' : 'text-[#6B6F76] hover:text-[#1C1E22]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="border border-[#E7E5E0] rounded-2xl overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F6F2] text-[#8A8D93] text-[11px] font-mono uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Last login</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => {
              const isSelf = a.id === user?.id;
              return (
                <tr key={a.id} className="border-t border-[#F1EFE9]">
                  <td className="px-4 py-3 font-medium">
                    {a.full_name} {isSelf && <span className="text-xs text-[#B5B2A8] font-normal">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-[#8A8D93]">{a.email}</td>
                  <td className="px-4 py-3 capitalize">{a.role.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#B5B2A8]">
                    {a.last_login ? new Date(a.last_login).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    {tab === 'pending' ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => approve(a.id)}
                          className="flex items-center gap-1 text-[#3A5A6B] hover:text-[#2C4854] text-xs font-medium"
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          onClick={() => deny(a.id)}
                          className="flex items-center gap-1 text-[#B8451A] hover:text-[#8F3714] text-xs font-medium"
                        >
                          <X size={13} /> Deny
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3 items-center">
                        <button
                          disabled={!isSelf}
                          onClick={() => isSelf && setEditingAccount(a)}
                          title={isSelf ? 'Edit your profile' : "You can only edit your own profile"}
                          className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                            isSelf ? 'text-[#6B6F76] hover:text-[#1C1E22]' : 'text-[#D8D5CC] cursor-not-allowed'
                          }`}
                        >
                          {isSelf ? <Pencil size={13} /> : <Lock size={13} />} Edit
                        </button>
                        {tab === 'active' && (
                          <button
                            disabled={isSelf}
                            onClick={() => revoke(a.id)}
                            title={isSelf ? "You can't revoke your own account" : 'Revoke access'}
                            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                              isSelf ? 'text-[#D8D5CC] cursor-not-allowed' : 'text-[#B8451A] hover:text-[#8F3714]'
                            }`}
                          >
                            <UserMinus size={13} /> Revoke
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#B5B2A8] text-sm">
                  No {tab} accounts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingAccount && (
        <EditProfileModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
