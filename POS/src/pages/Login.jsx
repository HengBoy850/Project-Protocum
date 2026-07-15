

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ClipboardCheck, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BG_IMAGE_URL =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop';

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
      {/* Left — photo panel, hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={BG_IMAGE_URL}
          alt="Team at work"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Brand-color wash so the photo reads as part of the product, not a stock photo */}
        <div className="bg-gradient-to-br from-indigo-900/90 via-indigo-800/70 to-violet-900/80" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <ClipboardCheck size={18} />
            </div>
            <p className="text-lg font-bold">StaffSync</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight mb-3 max-w-md">
              Run attendance and staff access from one place.
            </h2>
            <p className="text-indigo-100/80 max-w-sm mb-10">
              Approvals, QR check-ins, and reporting — built for teams that move fast.
            </p>

            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-indigo-200" />
                <span className="text-sm text-indigo-100/90">Team management</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-200" />
                <span className="text-sm text-indigo-100/90">Role-based access</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-200" />
                <span className="text-sm text-indigo-100/90">Live reporting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm fade-in-up"
        >
          <div className="flex items-center gap-2 mb-1 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
              <ClipboardCheck size={16} className="text-white" />
            </div>
            <p className="text-xl font-bold text-slate-800">StaffSync</p>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-8">Sign in to the admin dashboard</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-600 block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                  placeholder="admin@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-500 mt-1">
              New admin or manager? <Link to="/register" className="text-indigo-600 underline">Request access</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}