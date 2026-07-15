

// import React, { useEffect, useRef, useState } from 'react';
// import { CircleCheck, Clock, LogIn, LogOut } from 'lucide-react';
// import api from '../api/client';
// import BottomNav from '../components/BottomNav';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const POLL_INTERVAL_MS = 30000;

// function todayKey() {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// }
// function formatTime(iso) {
//   return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }
// function greeting() {
//   const h = new Date().getHours();
//   if (h < 12) return 'Good morning';
//   if (h < 18) return 'Good afternoon';
//   return 'Good evening';
// }

// export default function Home() {
//   const [profile, setProfile] = useState(null);
//   const [qrDataUrl, setQrDataUrl] = useState(null);
//   const [todayEvents, setTodayEvents] = useState([]);
//   const [error, setError] = useState('');
//   const currentDayRef = useRef(todayKey());

//   function loadTodayEvents() {
//     api.get('/attendance/me/today').then((res) => setTodayEvents(res.data)).catch(() => {});
//   }

//   useEffect(() => {
//     api.get('/staff/me').then((res) => setProfile(res.data)).catch(() => setError('Could not load your profile'));
//     api.get('/staff/me/qr').then((res) => setQrDataUrl(res.data.qrDataUrl)).catch(() => {});
//     loadTodayEvents();

//     const interval = setInterval(() => {
//       if (todayKey() !== currentDayRef.current) {
//         currentDayRef.current = todayKey();
//       }
//       loadTodayEvents();
//     }, POLL_INTERVAL_MS);

//     return () => clearInterval(interval);
//   }, []);

//   const initials = profile?.full_name?.split(' ').map((p) => p[0]).join('').toUpperCase() || '?';
//   const firstName = profile?.full_name?.split(' ')[0];
//   const lastEvent = todayEvents[todayEvents.length - 1];
//   const isCheckedIn = lastEvent?.type === 'check_in';

//   return (
//     <div className="min-h-screen bg-[#B7C6CB] pb-28">
//       <div className="max-w-md mx-auto px-4 pt-6">

//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <p className="text-xs text-[#FDF8F0]/60">{greeting()}</p>
//             <p className="font-semibold text-lg text-[#FDF8F0]">{firstName || '—'}</p>
//           </div>
//           {profile?.photo_url ? (
//             <img
//               src={`${API_ORIGIN}${profile.photo_url}`}
//               alt={profile.full_name}
//               className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#FDF8F0]/20 shadow-md"
//             />
//           ) : (
//             <div className="w-11 h-11 rounded-2xl bg-[#FF6452] flex items-center justify-center text-sm font-semibold text-[#FDF8F0] ring-2 ring-[#FDF8F0]/20 shadow-md">
//               {initials}
//             </div>
//           )}
//         </div>

//         {error && <p className="text-sm text-[#FF9C8F] mb-3">{error}</p>}

//         <div className="relative rounded-3xl overflow-hidden mb-4 shadow-2xl shadow-black/30 bg-[#FDF8F0]">
//           <div className="bg-[#FF6452] px-6 pt-6 pb-16">
//             <div className="flex items-center justify-between text-[#FDF8F0]">
//               <div>
//                 <p className="text-xs uppercase tracking-wide opacity-80">Employee</p>
//                 <p className="font-semibold text-sm">{profile?.position || '—'}</p>
//               </div>
//               <p className="text-xs font-mono opacity-90 bg-white/15 px-2 py-1 rounded-md">
//                 {profile?.employee_code || '—'}
//               </p>
//             </div>
//           </div>

//           <div className="bg-[#FDF8F0] mx-4 -mt-10 rounded-2xl p-5 text-center shadow-md shadow-black/10 relative">
//             <p className="text-[11px] text-[#6B6558] uppercase tracking-wide mb-3">Your check-in code</p>
//             {qrDataUrl ? (
//               <img src={qrDataUrl} alt="Your QR code" className="w-36 h-36 mx-auto" />
//             ) : (
//               <div className="w-36 h-36 mx-auto rounded-xl bg-[#F5EFE3] flex items-center justify-center text-xs text-[#6B6558] animate-pulse">
//                 Loading…
//               </div>
//             )}
//             <p className="text-xs text-[#6B6558] mt-3">Show this to the scanner at entry</p>
//           </div>
//           <div className="h-4" />
//         </div>

//         <div className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-4 shadow-md shadow-black/10 ${isCheckedIn ? 'bg-[#FF6452]' : 'bg-[#FDF8F0]'}`}>
//           <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCheckedIn ? 'bg-white/20' : 'bg-[#F5EFE3]'}`}>
//             {isCheckedIn ? (
//               <CircleCheck size={18} className="text-[#FDF8F0]" />
//             ) : (
//               <Clock size={18} className="text-[#6B6558]" />
//             )}
//           </div>
//           <div>
//             <p className={`text-sm font-medium ${isCheckedIn ? 'text-[#FDF8F0]' : 'text-[#1C1C1A]'}`}>
//               {isCheckedIn ? 'Checked in' : todayEvents.length ? 'Checked out' : 'Not checked in yet'}
//             </p>
//             <p className={`text-xs ${isCheckedIn ? 'text-[#FDF8F0]/70' : 'text-[#6B6558]'}`}>
//               {lastEvent ? `Since ${formatTime(lastEvent.scanned_at)}` : 'Scan your QR when you arrive'}
//             </p>
//           </div>
//         </div>

//         <p className="text-[11px] font-semibold text-[#FDF8F0]/50 uppercase tracking-wide mb-2 px-1">Today's activity</p>
//         <div className="bg-[#FDF8F0] rounded-2xl divide-y divide-black/5 shadow-md shadow-black/10">
//           {todayEvents.length === 0 && (
//             <div className="px-4 py-8 text-center text-sm text-[#6B6558]">No activity yet today</div>
//           )}
//           {todayEvents.map((e) => (
//             <div key={e.id} className="flex items-center gap-3 px-4 py-3">
//               <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
//                 e.type === 'check_in' ? 'bg-[#FF6452]/10' : 'bg-[#F5EFE3]'
//               }`}>
//                 {e.type === 'check_in' ? (
//                   <LogIn size={14} className="text-[#FF6452]" />
//                 ) : (
//                   <LogOut size={14} className="text-[#6B6558]" />
//                 )}
//               </div>
//               <p className="text-sm flex-1 text-[#1C1C1A]">{e.type === 'check_in' ? 'Checked in' : 'Checked out'}</p>
//               <p className="text-sm text-[#6B6558]">{formatTime(e.scanned_at)}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import { CircleCheck, Clock, LogIn, LogOut } from 'lucide-react';
import api from '../api/client';
import BottomNav from '../components/BottomNav';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const POLL_INTERVAL_MS = 30000;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [todayEvents, setTodayEvents] = useState([]);
  const [error, setError] = useState('');
  const currentDayRef = useRef(todayKey());

  function loadTodayEvents() {
    api.get('/attendance/me/today').then((res) => setTodayEvents(res.data)).catch(() => {});
  }

  useEffect(() => {
    api.get('/staff/me').then((res) => setProfile(res.data)).catch(() => setError('Could not load your profile'));
    api.get('/staff/me/qr').then((res) => setQrDataUrl(res.data.qrDataUrl)).catch(() => {});
    loadTodayEvents();

    const interval = setInterval(() => {
      if (todayKey() !== currentDayRef.current) {
        currentDayRef.current = todayKey();
      }
      loadTodayEvents();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const initials =
    profile?.full_name
      ?.split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';
  const firstName = profile?.full_name?.split(' ')[0];
  const lastEvent = todayEvents[todayEvents.length - 1];
  const isCheckedIn = lastEvent?.type === 'check_in';

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-28 text-[#20243F]">
      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-[#F8F9FE] shadow-2xl shadow-slate-900/5">
        <header className="relative overflow-hidden bg-gradient-to-br from-[#785BFF] via-[#5F74FF] to-[#1D91FF] px-8 pt-14 pb-24 text-white">
          <div className="absolute -right-16 top-8 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute right-10 top-28 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/75">{greeting()}</p>
              <p className="mt-1 text-3xl font-black leading-none">{firstName || '—'}</p>
              <span className="mt-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-bold text-white/90">
                {profile?.position || 'Employee'}
              </span>
            </div>
            {profile?.photo_url ? (
              <img
                src={`${API_ORIGIN}${profile.photo_url}`}
                alt={profile.full_name}
                className="h-16 w-16 rounded-2xl border-[3px] border-white/70 object-cover shadow-lg shadow-black/20"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-white/70 bg-white/15 text-lg font-black text-white shadow-lg shadow-black/20">
                {initials}
              </div>
            )}
          </div>
        </header>

        <main className="relative -mt-16 px-7">
          {error && (
            <p className="mb-4 rounded-2xl bg-[#FFF3F1] px-4 py-3 text-sm font-medium text-[#FF5A4A]">{error}</p>
          )}

          <section className="relative z-10 overflow-hidden rounded-[28px] bg-white p-6 text-center shadow-xl shadow-[#47546D]/10">
            <p className="text-xs font-bold uppercase tracking-normal text-[#8D94A9]">Your check-in code</p>
            <span className="mt-2 inline-flex items-center rounded-full border border-[#DDD6FF] bg-[#FAFAFF] px-4 py-1 text-xs font-black text-[#7158F6]">
              {profile?.employee_code || 'EMP_0000'}
            </span>

            <div className="mx-auto mt-4 flex h-40 w-40 items-center justify-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Your QR code" className="h-40 w-40" />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-[#F4F5FB] text-xs font-medium text-[#858BA3]">
                  Loading…
                </div>
              )}
            </div>
            <p className="mt-3 text-sm font-medium text-[#858BA3]">Show this to the scanner at entry</p>
          </section>

          <section
            className={`mt-5 flex items-center gap-4 rounded-[22px] px-5 py-4 shadow-xl shadow-[#47546D]/10 ${
              isCheckedIn ? 'bg-[#7158F6]' : 'border border-[#E9ECF5] bg-white'
            }`}
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] ${
                isCheckedIn ? 'bg-white/20' : 'bg-[#F0EDFF] text-[#7158F6]'
              }`}
            >
              {isCheckedIn ? <CircleCheck size={24} className="text-white" /> : <Clock size={24} />}
            </span>
            <div>
              <p className={`text-base font-bold ${isCheckedIn ? 'text-white' : 'text-[#20243F]'}`}>
                {isCheckedIn ? 'Checked in' : todayEvents.length ? 'Checked out' : 'Not checked in yet'}
              </p>
              <p className={`text-sm font-medium ${isCheckedIn ? 'text-white/75' : 'text-[#858BA3]'}`}>
                {lastEvent ? `Since ${formatTime(lastEvent.scanned_at)}` : 'Scan your QR when you arrive'}
              </p>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center gap-3 text-[#8D94A9]">
              <p className="text-base font-bold uppercase tracking-normal">Today's activity</p>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#E9ECF5] bg-white shadow-xl shadow-[#47546D]/10">
              {todayEvents.length === 0 && (
                <div className="px-5 py-8 text-center text-sm font-medium text-[#858BA3]">No activity yet today</div>
              )}
              {todayEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-4 border-b border-[#EEF0F6] px-5 py-4 last:border-b-0">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${
                      e.type === 'check_in' ? 'bg-[#F0EDFF] text-[#7158F6]' : 'bg-[#EAFBEF] text-[#34C76F]'
                    }`}
                  >
                    {e.type === 'check_in' ? <LogIn size={20} /> : <LogOut size={20} />}
                  </span>
                  <p className="flex-1 text-base font-bold text-[#20243F]">
                    {e.type === 'check_in' ? 'Checked in' : 'Checked out'}
                  </p>
                  <p className="text-sm font-semibold text-[#858BA3]">{formatTime(e.scanned_at)}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
