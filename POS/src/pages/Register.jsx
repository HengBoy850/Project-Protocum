
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, KeyRound, ClipboardCheck, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import api from '../api/client';

const BG_IMAGE_URL =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop';

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
      {/* Left — photo panel, hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={BG_IMAGE_URL}
          alt="Team at work"
          className="absolute inset-0 w-full h-full object-cover"
        />
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
              Get your team set up in minutes.
            </h2>
            <p className="text-indigo-100/80 max-w-sm mb-10">
              Request access and your Super Admin will review it — you'll be checking in with a QR code shortly after.
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
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50 overflow-y-auto">
        {submitted ? (
          <div className="w-full max-w-sm text-center fade-in-up">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <ClipboardCheck size={22} className="text-indigo-600" />
            </div>
            <p className="font-semibold text-lg text-slate-800 mb-1">Request submitted</p>
            <p className="text-sm text-slate-500 mb-6">
              A Super Admin will review your request. You'll be able to log in once approved.
            </p>
            <Link to="/login" className="text-sm text-indigo-600 underline">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-sm fade-in-up">
            <div className="flex items-center gap-2 mb-1 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                <ClipboardCheck size={16} className="text-white" />
              </div>
              <p className="text-xl font-bold text-slate-800">StaffSync</p>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-1">Request access</h1>
            <p className="text-sm text-slate-500 mb-8">Fill in your details to get started</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-slate-600 block mb-1.5">Full name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1.5">Requested role</label>
                <select
                  value={form.requestedRole}
                  onChange={(e) => update('requestedRole', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                >
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">Super Admin can adjust this when approving.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600 block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1.5">Confirm</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1.5">Company access code</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.accessCode}
                    onChange={(e) => update('accessCode', e.target.value)}
                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 bg-white text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                    placeholder="Ask your Super Admin"
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
                {loading ? 'Submitting…' : 'Request access'}
              </button>

              <p className="text-center text-sm text-slate-500 mt-1">
                Already approved? <Link to="/login" className="text-indigo-600 underline">Sign in</Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}