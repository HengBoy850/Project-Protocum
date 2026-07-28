

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, ClipboardCheck, ShieldCheck, Users, TrendingUp } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// const BG_IMAGE_URL =
//   'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
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
//         {/* Brand-color wash so the photo reads as part of the product, not a stock photo */}
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
//               Run attendance and staff access from one place.
//             </h2>
//             <p className="text-indigo-100/80 max-w-sm mb-10">
//               Approvals, QR check-ins, and reporting — built for teams that move fast.
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
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50">
//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-sm fade-in-up"
//         >
//           <div className="flex items-center gap-2 mb-1 lg:hidden">
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
//               <ClipboardCheck size={16} className="text-white" />
//             </div>
//             <p className="text-xl font-bold text-slate-800">StaffSync</p>
//           </div>

//           <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
//           <p className="text-sm text-slate-500 mb-8">Sign in to the admin dashboard</p>

//           <div className="flex flex-col gap-4">
//             <div>
//               <label className="text-sm text-slate-600 block mb-1.5">Email</label>
//               <div className="relative">
//                 <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                   placeholder="admin@company.com"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm text-slate-600 block mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>
//             </div>

//             {error && <p className="text-sm text-red-600">{error}</p>}

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-2 w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
//             >
//               {loading ? 'Signing in…' : 'Sign in'}
//             </button>

//             <p className="text-center text-sm text-slate-500 mt-1">
//               New admin or manager? <Link to="/register" className="text-indigo-600 underline">Request access</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, ClipboardCheck } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

// // Sample data purely for the live-feed signature element on the left panel.
// // Swap this for a real "recent check-ins" query if you want it to reflect
// // actual activity instead of illustrative placeholders.
// const FEED = [
//   { initials: 'MJ', name: 'Maria J.', dept: 'Front Desk', time: '8:58 AM' },
//   { initials: 'DK', name: 'David K.', dept: 'Warehouse', time: '8:59 AM' },
//   { initials: 'AL', name: 'Aisha L.', dept: 'Support', time: '9:01 AM' },
//   { initials: 'RT', name: 'Ravi T.', dept: 'Front Desk', time: '9:02 AM' },
//   { initials: 'SC', name: 'Sofia C.', dept: 'Operations', time: '9:03 AM' },
//   { initials: 'BW', name: 'Ben W.', dept: 'Warehouse', time: '9:05 AM' },
// ];

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex bg-white">
//       <style>{`
//         @keyframes ss-scroll {
//           from { transform: translateY(0); }
//           to { transform: translateY(-50%); }
//         }
//         .ss-ticker-track {
//           animation: ss-scroll 14s linear infinite;
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .ss-ticker-track { animation: none; }
//         }
//         @keyframes ss-pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.35; }
//         }
//         .ss-live-dot { animation: ss-pulse 1.8s ease-in-out infinite; }
//         @keyframes ss-fade-up {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .ss-fade-up { animation: ss-fade-up 0.5s ease-out both; }
//       `}</style>

//       {/* Left — signature panel, hidden on small screens */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0B1120]">
//         <div
//           className="absolute inset-0 opacity-[0.07]"
//           style={{
//             backgroundImage:
//               'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
//             backgroundSize: '48px 48px',
//           }}
//         />

//         <div className="relative z-10 flex flex-col justify-between p-12 w-full">
//           <div className="flex items-center gap-2.5">
//             <div className="w-9 h-9 rounded-lg bg-[#22D3A5]/15 flex items-center justify-center">
//               <ClipboardCheck size={18} className="text-[#22D3A5]" />
//             </div>
//             <p className="text-lg font-semibold text-white tracking-tight">StaffSync</p>
//           </div>

//           <div className="max-w-md">
//             <h2 className="text-3xl font-semibold leading-[1.15] mb-3 text-white tracking-tight">
//               Every check-in, tracked in real time.
//             </h2>
//             <p className="text-slate-400 mb-10 leading-relaxed">
//               See who's in, approve access, and pull reports without leaving
//               the dashboard.
//             </p>

//             {/* Signature element: a live attendance feed */}
//             <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
//               <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
//                 <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A5] ss-live-dot" />
//                 <span className="text-xs font-medium text-slate-300 tracking-wide">
//                   Live check-ins
//                 </span>
//               </div>
//               <div className="h-[168px] overflow-hidden relative">
//                 <div className="ss-ticker-track">
//                   {[...FEED, ...FEED].map((p, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5"
//                     >
//                       <div className="w-7 h-7 rounded-full bg-[#22D3A5]/15 flex items-center justify-center text-[11px] font-semibold text-[#22D3A5] shrink-0">
//                         {p.initials}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm text-slate-200 truncate">{p.name}</p>
//                         <p className="text-xs text-slate-500">{p.dept}</p>
//                       </div>
//                       <span className="ml-auto text-xs text-slate-500 shrink-0">
//                         {p.time}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0B1120] to-transparent" />
//               </div>
//             </div>
//           </div>

//           <p className="text-xs text-slate-500 tracking-wide">
//             Real-time attendance · Role-based access · Exportable reports
//           </p>
//         </div>
//       </div>

//       {/* Right — form panel */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
//         <form onSubmit={handleSubmit} className="w-full max-w-sm ss-fade-up">
//           <div className="flex items-center gap-2 mb-1 lg:hidden">
//             <div className="w-8 h-8 rounded-lg bg-[#0B1120] flex items-center justify-center">
//               <ClipboardCheck size={16} className="text-[#22D3A5]" />
//             </div>
//             <p className="text-xl font-semibold text-slate-900 tracking-tight">StaffSync</p>
//           </div>

//           <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
//             Welcome back
//           </h1>
//           <p className="text-sm text-slate-500 mb-8">Sign in to the admin dashboard</p>

//           <div className="flex flex-col gap-4">
//             <div>
//               <label className="text-sm font-medium text-slate-700 block mb-1.5">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail
//                   size={16}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
//                   placeholder="admin@company.com"
//                   required
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-slate-700 block mb-1.5">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   size={16}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//                 />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>
//             </div>

//             {error && (
//               <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="mt-2 w-full bg-[#0B1120] hover:bg-[#161f36] text-white rounded-xl py-3 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Signing in…' : 'Sign in'}
//             </button>

//             <p className="text-center text-sm text-slate-500 mt-1">
//               New admin or manager?{' '}
//               <Link to="/register" className="text-slate-900 font-medium underline underline-offset-2">
//                 Request access
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Sample data purely for the live-feed signature element on the left panel.
// Swap this for a real "recent check-ins" query if you want it to reflect
// actual activity instead of illustrative placeholders.
const FEED = [
  { initials: 'MJ', name: 'Maria J.', dept: 'Front Desk', time: '8:58 AM' },
  { initials: 'DK', name: 'David K.', dept: 'Warehouse', time: '8:59 AM' },
  { initials: 'AL', name: 'Aisha L.', dept: 'Support', time: '9:01 AM' },
  { initials: 'RT', name: 'Ravi T.', dept: 'Front Desk', time: '9:02 AM' },
  { initials: 'SC', name: 'Sofia C.', dept: 'Operations', time: '9:03 AM' },
  { initials: 'BW', name: 'Ben W.', dept: 'Warehouse', time: '9:05 AM' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      <style>{`
        @keyframes ss-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .ss-ticker-track {
          animation: ss-scroll 14s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ss-ticker-track { animation: none; }
        }
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
              Every check-in, tracked in real time.
            </h2>
            <p className="text-slate-400 mb-10 leading-relaxed">
              See who's in, approve access, and pull reports without leaving
              the dashboard.
            </p>

            {/* Signature element: a live attendance feed */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A5] ss-live-dot" />
                <span className="text-xs font-medium text-slate-300 tracking-wide">
                  Live check-ins
                </span>
              </div>
              <div className="h-[168px] overflow-hidden relative">
                <div className="ss-ticker-track">
                  {[...FEED, ...FEED].map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#22D3A5]/15 flex items-center justify-center text-[11px] font-semibold text-[#22D3A5] shrink-0">
                        {p.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-200 truncate">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.dept}</p>
                      </div>
                      <span className="ml-auto text-xs text-slate-500 shrink-0">
                        {p.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0B1120] to-transparent" />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 tracking-wide">
            Real-time attendance · Role-based access · Exportable reports
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 ss-right-bg relative">
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
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mb-7">Sign in to the admin dashboard</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                  placeholder="admin@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#22D3A5]/40 focus:border-[#22D3A5]"
                  placeholder="••••••••"
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            New admin or manager?{' '}
            <Link to="/register" className="text-slate-900 font-medium underline underline-offset-2">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
