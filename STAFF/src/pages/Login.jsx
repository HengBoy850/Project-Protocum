

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, ClipboardCheck } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

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
//     <div className="min-h-screen bg-[#14403F] flex items-center justify-center px-4">
//       <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#FDF8F0] rounded-3xl p-8 shadow-2xl shadow-black/20">
//         <div className="flex items-center gap-2 mb-1">
//           <div className="w-9 h-9 rounded-xl bg-[#FF6452] flex items-center justify-center shadow-md shadow-[#FF6452]/30">
//             <ClipboardCheck size={17} className="text-[#FDF8F0]" />
//           </div>
//           <p className="text-xl font-bold text-[#1C1C1A]">StaffSync</p>
//         </div>
//         <p className="text-sm text-[#6B6558] mb-6">Sign in to view your QR and attendance</p>

//         <div className="flex flex-col gap-3">
//           <div className="relative">
//             <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6558]" />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               className="w-full bg-[#F5EFE3] border border-black/5 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               required
//             />
//           </div>
//           <div className="relative">
//             <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6558]" />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full bg-[#F5EFE3] border border-black/5 rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               required
//             />
//           </div>

//           {error && <p className="text-sm text-[#E24C3F]">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-1 bg-[#FF6452] hover:bg-[#F04B38] text-[#FDF8F0] rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 transition-colors shadow-md shadow-[#FF6452]/25"
//           >
//             {loading ? 'Signing in…' : 'Sign in'}
//           </button>

//           <p className="text-center text-sm text-[#6B6558] mt-1">
//             New here? <Link to="/register" className="text-[#FF6452] font-medium underline">Register to get your QR</Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#785BFF] via-[#5F74FF] to-[#1D91FF] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-[28px] bg-white p-8 shadow-2xl shadow-black/20">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7158F6] shadow-md shadow-[#7158F6]/30">
            <ClipboardCheck size={17} className="text-white" />
          </div>
          <p className="text-xl font-black text-[#20243F]">StaffSync</p>
        </div>
        <p className="mb-6 text-sm text-[#858BA3]">Sign in to view your QR and attendance</p>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#858BA3]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] py-3 pl-11 pr-4 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              required
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#858BA3]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] py-3 pl-11 pr-4 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              required
            />
          </div>

          {error && <p className="text-sm font-medium text-[#FF5A4A]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-2xl bg-[#7158F6] py-3 text-sm font-bold text-white shadow-lg shadow-[#7158F6]/25 transition hover:bg-[#6047E8] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-1 text-center text-sm text-[#858BA3]">
            New here?{' '}
            <Link to="/register" className="font-bold text-[#7158F6] underline">
              Register to get your QR
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
