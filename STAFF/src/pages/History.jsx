
// // import React, { useEffect, useState } from 'react';
// // import api from '../api/client';
// // import BottomNav from '../components/BottomNav';

// // function toLocalDate(dateStr) {
// //   const [y, m, d] = dateStr.split('-').map(Number);
// //   return new Date(y, m - 1, d);
// // }
// // function formatDay(dateStr) {
// //   return toLocalDate(dateStr).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
// // }
// // function formatTime(iso) {
// //   if (!iso) return null;
// //   return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // }
// // function isToday(dateStr) {
// //   return toLocalDate(dateStr).toDateString() === new Date().toDateString();
// // }

// // const STATUS_STYLES = {
// //   present: { label: 'On time', dot: 'bg-sky-500', pill: 'bg-sky-50 text-sky-700' },
// //   late: { label: 'Late', dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700' },
// // };

// // function RecordRow({ r }) {
// //   const style = STATUS_STYLES[r.status] || STATUS_STYLES.present;
// //   return (
// //     <div className="flex items-center gap-3 px-4 py-3">
// //       <div className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
// //       <div className="flex-1 min-w-0">
// //         <p className="text-sm font-medium text-slate-800">{formatDay(r.day)}</p>
// //         <p className="text-xs text-slate-500">
// //           In {formatTime(r.check_in) || '—'} &middot; Out {formatTime(r.check_out) || '—'}
// //         </p>
// //       </div>
// //       <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${style.pill}`}>{style.label}</span>
// //     </div>
// //   );
// // }

// // export default function History() {
// //   const [range, setRange] = useState('week');
// //   const [records, setRecords] = useState([]);

// //   useEffect(() => {
// //     api.get('/attendance/me', { params: { range } }).then((res) => setRecords(res.data));
// //   }, [range]);

// //   const today = records.filter((r) => isToday(r.day));
// //   const earlier = records.filter((r) => !isToday(r.day));
// //   const onTimeCount = records.filter((r) => r.status === 'present').length;
// //   const lateCount = records.filter((r) => r.status === 'late').length;

// //   return (
// //     <div className="min-h-screen bg-slate-50 pb-20">
// //       <div className="max-w-md mx-auto px-4 pt-6">
// //         <p className="font-semibold text-lg text-slate-900 mb-1">Attendance history</p>
// //         <p className="text-sm text-slate-500 mb-4">Your check-in and check-out record</p>

// //         <div className="flex gap-2 mb-4">
// //           <button
// //             onClick={() => setRange('week')}
// //             className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${range === 'week' ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
// //           >
// //             This week
// //           </button>
// //           <button
// //             onClick={() => setRange('month')}
// //             className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${range === 'month' ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
// //           >
// //             This month
// //           </button>
// //         </div>

// //         <div className="flex gap-3 mb-4">
// //           <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-center">
// //             <p className="text-lg font-bold text-sky-600">{onTimeCount}</p>
// //             <p className="text-xs text-slate-500">On time</p>
// //           </div>
// //           <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-center">
// //             <p className="text-lg font-bold text-amber-500">{lateCount}</p>
// //             <p className="text-xs text-slate-500">Late</p>
// //           </div>
// //         </div>

// //         {today.length > 0 && (
// //           <>
// //             <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 px-1">Today</p>
// //             <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 mb-4">
// //               {today.map((r) => <RecordRow key={r.day} r={r} />)}
// //             </div>
// //           </>
// //         )}

// //         <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 px-1">
// //           {range === 'week' ? 'Earlier this week' : 'Earlier this month'}
// //         </p>
// //         <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
// //           {earlier.map((r) => <RecordRow key={r.day} r={r} />)}
// //           {earlier.length === 0 && (
// //             <div className="px-4 py-8 text-center text-sm text-slate-400">Nothing else to show</div>
// //           )}
// //         </div>
// //       </div>

// //       <BottomNav />
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from 'react';
// import api from '../api/client';
// import BottomNav from '../components/BottomNav';

// function toLocalDate(dateStr) {
//   const [y, m, d] = dateStr.split('-').map(Number);
//   return new Date(y, m - 1, d);
// }
// function formatDay(dateStr) {
//   return toLocalDate(dateStr).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
// }
// function formatTime(iso) {
//   if (!iso) return null;
//   return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }
// function isToday(dateStr) {
//   return toLocalDate(dateStr).toDateString() === new Date().toDateString();
// }

// const STATUS_STYLES = {
//   present: { label: 'On time', dot: 'bg-[#FF6452]', pill: 'bg-[#FF6452]/10 text-[#F04B38]' },
//   late: { label: 'Late', dot: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700' },
// };

// function RecordRow({ r }) {
//   const style = STATUS_STYLES[r.status] || STATUS_STYLES.present;
//   return (
//     <div className="flex items-center gap-3 px-4 py-3">
//       <div className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-[#1C1C1A]">{formatDay(r.day)}</p>
//         <p className="text-xs text-[#6B6558]">
//           In {formatTime(r.check_in) || '—'} &middot; Out {formatTime(r.check_out) || '—'}
//         </p>
//       </div>
//       <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${style.pill}`}>{style.label}</span>
//     </div>
//   );
// }

// export default function History() {
//   const [range, setRange] = useState('week');
//   const [records, setRecords] = useState([]);

//   useEffect(() => {
//     api.get('/attendance/me', { params: { range } }).then((res) => setRecords(res.data));
//   }, [range]);

//   const today = records.filter((r) => isToday(r.day));
//   const earlier = records.filter((r) => !isToday(r.day));
//   const onTimeCount = records.filter((r) => r.status === 'present').length;
//   const lateCount = records.filter((r) => r.status === 'late').length;

//   return (
//     <div className="min-h-screen bg-[#B7C6CB] pb-24">
//       <div className="max-w-md mx-auto px-4 pt-6">
//         <p className="font-semibold text-lg text-[#FDF8F0] mb-1">Attendance history</p>
//         <p className="text-sm text-[#FDF8F0]/60 mb-4">Your check-in and check-out record</p>

//         <div className="flex gap-2 mb-4">
//           <button
//             onClick={() => setRange('week')}
//             className={`flex-1 text-sm py-2.5 rounded-xl font-medium transition-colors shadow-sm ${range === 'week' ? 'bg-[#FF6452] text-[#FDF8F0]' : 'bg-[#FDF8F0] text-[#6B6558]'}`}
//           >
//             This week
//           </button>
//           <button
//             onClick={() => setRange('month')}
//             className={`flex-1 text-sm py-2.5 rounded-xl font-medium transition-colors shadow-sm ${range === 'month' ? 'bg-[#FF6452] text-[#FDF8F0]' : 'bg-[#FDF8F0] text-[#6B6558]'}`}
//           >
//             This month
//           </button>
//         </div>

//         <div className="flex gap-3 mb-4">
//           <div className="flex-1 bg-[#FDF8F0] rounded-2xl px-3 py-2.5 text-center shadow-md shadow-black/10">
//             <p className="text-lg font-bold text-[#FF6452]">{onTimeCount}</p>
//             <p className="text-xs text-[#6B6558]">On time</p>
//           </div>
//           <div className="flex-1 bg-[#FDF8F0] rounded-2xl px-3 py-2.5 text-center shadow-md shadow-black/10">
//             <p className="text-lg font-bold text-amber-500">{lateCount}</p>
//             <p className="text-xs text-[#6B6558]">Late</p>
//           </div>
//         </div>

//         {today.length > 0 && (
//           <>
//             <p className="text-[11px] font-semibold text-[#FDF8F0]/50 uppercase tracking-wide mb-2 px-1">Today</p>
//             <div className="bg-[#FDF8F0] rounded-2xl divide-y divide-black/5 mb-4 shadow-md shadow-black/10">
//               {today.map((r) => <RecordRow key={r.day} r={r} />)}
//             </div>
//           </>
//         )}

//         <p className="text-[11px] font-semibold text-[#FDF8F0]/50 uppercase tracking-wide mb-2 px-1">
//           {range === 'week' ? 'Earlier this week' : 'Earlier this month'}
//         </p>
//         <div className="bg-[#FDF8F0] rounded-2xl divide-y divide-black/5 shadow-md shadow-black/10">
//           {earlier.map((r) => <RecordRow key={r.day} r={r} />)}
//           {earlier.length === 0 && (
//             <div className="px-4 py-8 text-center text-sm text-[#6B6558]">Nothing else to show</div>
//           )}
//         </div>
//       </div>

//       <BottomNav />
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import api from '../api/client';
import BottomNav from '../components/BottomNav';

function toLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function formatDay(dateStr) {
  return toLocalDate(dateStr).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function isToday(dateStr) {
  return toLocalDate(dateStr).toDateString() === new Date().toDateString();
}

const STATUS_STYLES = {
  present: { label: 'On time', dot: 'bg-[#34C76F]', pill: 'bg-[#EAFBEF] text-[#22A75D]' },
  late: { label: 'Late', dot: 'bg-[#FF8A1D]', pill: 'bg-[#FFF3E6] text-[#C96A0E]' },
};

function RecordRow({ r }) {
  const style = STATUS_STYLES[r.status] || STATUS_STYLES.present;
  return (
    <div className="flex items-center gap-3 border-b border-[#EEF0F6] px-5 py-4 last:border-b-0">
      <div className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold text-[#20243F]">{formatDay(r.day)}</p>
        <p className="text-sm font-medium text-[#858BA3]">
          In {formatTime(r.check_in) || '—'} &middot; Out {formatTime(r.check_out) || '—'}
        </p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${style.pill}`}>{style.label}</span>
    </div>
  );
}

export default function History() {
  const [range, setRange] = useState('week');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/attendance/me', { params: { range } }).then((res) => setRecords(res.data));
  }, [range]);

  const today = records.filter((r) => isToday(r.day));
  const earlier = records.filter((r) => !isToday(r.day));
  const onTimeCount = records.filter((r) => r.status === 'present').length;
  const lateCount = records.filter((r) => r.status === 'late').length;

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-28 text-[#20243F]">
      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-[#F8F9FE] shadow-2xl shadow-slate-900/5">
        <header className="relative overflow-hidden bg-gradient-to-br from-[#785BFF] via-[#5F74FF] to-[#1D91FF] px-8 pt-14 pb-24 text-white">
          <div className="absolute -right-16 top-8 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute right-10 top-28 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative z-10">
            <h1 className="text-4xl font-black leading-none">History</h1>
            <p className="mt-3 text-lg font-medium text-white/85">Your check-in and check-out record</p>
          </div>
        </header>

        <main className="relative -mt-16 px-7">
          <section className="relative z-10 flex gap-2 overflow-hidden rounded-[22px] bg-white p-1.5 shadow-xl shadow-[#47546D]/10">
            <button
              type="button"
              onClick={() => setRange('week')}
              className={`flex-1 rounded-[16px] py-2.5 text-sm font-bold transition-colors ${
                range === 'week' ? 'bg-[#7158F6] text-white shadow-lg shadow-[#7158F6]/25' : 'text-[#858BA3]'
              }`}
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => setRange('month')}
              className={`flex-1 rounded-[16px] py-2.5 text-sm font-bold transition-colors ${
                range === 'month' ? 'bg-[#7158F6] text-white shadow-lg shadow-[#7158F6]/25' : 'text-[#858BA3]'
              }`}
            >
              This month
            </button>
          </section>

          <section className="mt-4 flex gap-4">
            <div className="flex-1 rounded-[20px] border border-[#E9ECF5] bg-white px-4 py-4 text-center shadow-xl shadow-[#47546D]/10">
              <p className="text-2xl font-black text-[#34C76F]">{onTimeCount}</p>
              <p className="mt-1 text-sm font-medium text-[#858BA3]">On time</p>
            </div>
            <div className="flex-1 rounded-[20px] border border-[#E9ECF5] bg-white px-4 py-4 text-center shadow-xl shadow-[#47546D]/10">
              <p className="text-2xl font-black text-[#FF8A1D]">{lateCount}</p>
              <p className="mt-1 text-sm font-medium text-[#858BA3]">Late</p>
            </div>
          </section>

          {today.length > 0 && (
            <section className="mt-8">
              <div className="mb-4 flex items-center gap-3 text-[#8D94A9]">
                <p className="text-base font-bold uppercase tracking-normal">Today</p>
              </div>
              <div className="overflow-hidden rounded-[22px] border border-[#E9ECF5] bg-white shadow-xl shadow-[#47546D]/10">
                {today.map((r) => (
                  <RecordRow key={r.day} r={r} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <div className="mb-4 flex items-center gap-3 text-[#8D94A9]">
              <p className="text-base font-bold uppercase tracking-normal">
                {range === 'week' ? 'Earlier this week' : 'Earlier this month'}
              </p>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-[#E9ECF5] bg-white shadow-xl shadow-[#47546D]/10">
              {earlier.map((r) => (
                <RecordRow key={r.day} r={r} />
              ))}
              {earlier.length === 0 && (
                <div className="px-5 py-8 text-center text-sm font-medium text-[#858BA3]">Nothing else to show</div>
              )}
            </div>
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
