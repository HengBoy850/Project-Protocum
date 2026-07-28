
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Mail, Lock, User, KeyRound, ClipboardCheck, ShieldCheck, Users, TrendingUp } from 'lucide-react';
// import api from '../api/client';

// const BG_IMAGE_URL =
//   'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop';

// export default function Register() {
//   const [form, setForm] = useState({
//     fullName: '', email: '', password: '', confirmPassword: '',
//     requestedRole: 'manager', accessCode: '',
//   });
//   const [error, setError] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   function update(field, value) {
//     setForm((f) => ({ ...f, [field]: value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }
//     if (form.password.length < 8) {
//       setError('Password must be at least 8 characters');
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post('/auth/register', form);
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex bg-white">
//       {/* Left — photo panel, hidden on small screens */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
//         <img
//           src={BG_IMAGE_URL}
//           alt="Team at work"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="bg-gradient-to-br from-indigo-900/90 via-indigo-800/70 to-violet-900/80" />

//         <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
//           <div className="flex items-center gap-2">
//             <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
//               <ClipboardCheck size={18} />
//             </div>
//             <p className="text-lg font-bold">StaffSync</p>
//           </div>

//           <div>
//             <h2 className="text-3xl font-bold leading-tight mb-3 max-w-md">
//               Get your team set up in minutes.
//             </h2>
//             <p className="text-indigo-100/80 max-w-sm mb-10">
//               Request access and your Super Admin will review it — you'll be checking in with a QR code shortly after.
//             </p>

//             <div className="flex gap-8">
//               <div className="flex items-center gap-2">
//                 <Users size={18} className="text-indigo-200" />
//                 <span className="text-sm text-indigo-100/90">Team management</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <ShieldCheck size={18} className="text-indigo-200" />
//                 <span className="text-sm text-indigo-100/90">Role-based access</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <TrendingUp size={18} className="text-indigo-200" />
//                 <span className="text-sm text-indigo-100/90">Live reporting</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right — form panel */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50 overflow-y-auto">
//         {submitted ? (
//           <div className="w-full max-w-sm text-center fade-in-up">
//             <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
//               <ClipboardCheck size={22} className="text-indigo-600" />
//             </div>
//             <p className="font-semibold text-lg text-slate-800 mb-1">Request submitted</p>
//             <p className="text-sm text-slate-500 mb-6">
//               A Super Admin will review your request. You'll be able to log in once approved.
//             </p>
//             <Link to="/login" className="text-sm text-indigo-600 underline">Back to login</Link>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="w-full max-w-sm fade-in-up">
//             <div className="flex items-center gap-2 mb-1 lg:hidden">
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
//                 <ClipboardCheck size={16} className="text-white" />
//               </div>
//               <p className="text-xl font-bold text-slate-800">StaffSync</p>
//             </div>

//             <h1 className="text-2xl font-bold text-slate-800 mb-1">Request access</h1>
//             <p className="text-sm text-slate-500 mb-8">Fill in your details to get started</p>

//             <div className="flex flex-col gap-3">
//               <div>
//                 <label className="text-sm text-slate-600 block mb-1.5">Full name</label>
//                 <div className="relative">
//                   <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                   <input
//                     value={form.fullName}
//                     onChange={(e) => update('fullName', e.target.value)}
//                     className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                     placeholder="Your name"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm text-slate-600 block mb-1.5">Email</label>
//                 <div className="relative">
//                   <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                   <input
//                     type="email"
//                     value={form.email}
//                     onChange={(e) => update('email', e.target.value)}
//                     className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                     placeholder="you@company.com"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm text-slate-600 block mb-1.5">Requested role</label>
//                 <select
//                   value={form.requestedRole}
//                   onChange={(e) => update('requestedRole', e.target.value)}
//                   className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                 >
//                   <option value="manager">Manager</option>
//                   <option value="hr">HR</option>
//                 </select>
//                 <p className="text-xs text-slate-400 mt-1">Super Admin can adjust this when approving.</p>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-sm text-slate-600 block mb-1.5">Password</label>
//                   <div className="relative">
//                     <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input
//                       type="password"
//                       value={form.password}
//                       onChange={(e) => update('password', e.target.value)}
//                       className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                       placeholder="••••••••"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-sm text-slate-600 block mb-1.5">Confirm</label>
//                   <div className="relative">
//                     <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input
//                       type="password"
//                       value={form.confirmPassword}
//                       onChange={(e) => update('confirmPassword', e.target.value)}
//                       className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                       placeholder="••••••••"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm text-slate-600 block mb-1.5">Company access code</label>
//                 <div className="relative">
//                   <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                   <input
//                     value={form.accessCode}
//                     onChange={(e) => update('accessCode', e.target.value)}
//                     className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                     placeholder="Ask your Super Admin"
//                     required
//                   />
//                 </div>
//               </div>

//               {error && <p className="text-sm text-red-600">{error}</p>}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="mt-2 w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
//               >
//                 {loading ? 'Submitting…' : 'Request access'}
//               </button>

//               <p className="text-center text-sm text-slate-500 mt-1">
//                 Already approved? <Link to="/login" className="text-indigo-600 underline">Sign in</Link>
//               </p>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, KeyRound, Users, ClipboardCheck, Check } from 'lucide-react';
import api from '../api/client';

// Sample data purely for the "approval queue" signature element on the left
// panel. Swap for a real recent-requests query if you want it to reflect
// actual activity instead of illustrative placeholders.
const QUEUE = [
  { initials: 'JR', name: 'Jordan R.', role: 'Manager', status: 'approved' },
  { initials: 'PN', name: 'Priya N.', role: 'HR', status: 'approved' },
  { initials: 'TC', name: 'Tomas C.', role: 'Manager', status: 'approved' },
  { initials: 'EW', name: 'Ella W.', role: 'HR', status: 'pending' },
];

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    requestedRole: 'manager', accessCode: '',
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      <style>{`
        @keyframes ss-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .ss-live-dot { animation: ss-pulse 1.8s ease-in-out infinite; }
        @keyframes ss-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ss-fade-up { animation: ss-fade-up 0.5s ease-out both; }
        .ss-right-bg {
          background-color: #F8FAFC;
          background-image:
            radial-gradient(circle at 15% 15%, rgba(34,211,165,0.10), transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(11,17,32,0.06), transparent 45%),
            radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: auto, auto, 20px 20px;
        }
      `}</style>

      {/* Left — signature panel, hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0B1120]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#22D3A5]/15 flex items-center justify-center">
              <ClipboardCheck size={18} className="text-[#22D3A5]" />
            </div>
            <p className="text-lg font-semibold text-white tracking-tight">StaffSync</p>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-semibold leading-[1.15] mb-3 text-white tracking-tight">
              Get your team set up in minutes.
            </h2>
            <p className="text-slate-400 mb-10 leading-relaxed">
              Request access and your Super Admin reviews it — you'll be
              checking in with a QR code shortly after.
            </p>

            {/* Signature element: an approval queue */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A5]" />
                <span className="text-xs font-medium text-slate-300 tracking-wide">
                  Approval queue
                </span>
              </div>
              <div>
                {QUEUE.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#22D3A5]/15 flex items-center justify-center text-[11px] font-semibold text-[#22D3A5] shrink-0">
                      {p.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-200 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.role}</p>
                    </div>
                    {p.status === 'approved' ? (
                      <span className="ml-auto flex items-center gap-1 text-xs text-[#22D3A5] bg-[#22D3A5]/10 rounded-full px-2 py-1 shrink-0">
                        <Check size={11} /> Approved
                      </span>
                    ) : (
                      <span className="ml-auto flex items-center gap-1.5 text-xs text-amber-300 bg-amber-300/10 rounded-full px-2 py-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300 ss-live-dot" />
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 tracking-wide">
            Approved within 24h · Role-based · Audit-ready
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 ss-right-bg overflow-y-auto">
        {submitted ? (
          <div className="w-full max-w-sm ss-fade-up">
            <div className="rounded-3xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-12px_rgba(15,23,42,0.12)] p-8 sm:p-9 text-center">
              <div className="w-12 h-12 rounded-full bg-[#22D3A5]/10 flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck size={22} className="text-[#22D3A5]" />
              </div>
              <p className="font-semibold text-lg text-slate-900 mb-1">Request submitted</p>
              <p className="text-sm text-slate-500">
                A Super Admin will review your request. You'll be able to sign
                in once it's approved.
              </p>
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/login" className="text-slate-900 font-medium underline underline-offset-2">
                Back to login
              </Link>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm ss-fade-up">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-[#0B1120] flex items-center justify-center">
                <ClipboardCheck size={16} className="text-[#22D3A5]" />
              </div>
              <p className="text-xl font-semibold text-slate-900 tracking-tight">StaffSync</p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-12px_rgba(15,23,42,0.12)] p-8 sm:p-9">
              <div className="w-10 h-10 rounded-xl bg-[#0B1120] flex items-center justify-center mb-5">
                <ClipboardCheck size={18} className="text-[#22D3A5]" />
              </div>

              <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
                Request access
              </h1>
              <p className="text-sm text-slate-500 mb-6">Fill in your details to get started</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    Requested role
                  </label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={form.requestedRole}
                      onChange={(e) => update('requestedRole', e.target.value)}
                      className="w-full appearance-none border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                    >
                      <option value="manager">Manager</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">Super Admin can adjust this when approving.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => update('password', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    Company access code
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.accessCode}
                      onChange={(e) => update('accessCode', e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                      placeholder="Ask your Super Admin"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full bg-[#0B1120] hover:bg-[#161f36] text-white rounded-xl py-3 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting…' : 'Request access'}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already approved?{' '}
              <Link to="/login" className="text-slate-900 font-medium underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
