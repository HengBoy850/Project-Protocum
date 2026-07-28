

// import React, { useEffect, useState } from 'react';
// import { RefreshCw, LogIn, LogOut, FileSpreadsheet, FileText, Printer } from 'lucide-react';
// import api from '../api/client';

// const POLL_INTERVAL_MS = 10000;
// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// function formatTime(iso) {
//   return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// function formatDayHeader(dateStr) {
//   const [y, m, d] = dateStr.split('-').map(Number);
//   const local = new Date(y, m - 1, d);
//   const today = new Date();
//   const isToday = local.toDateString() === today.toDateString();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
//   const isYesterday = local.toDateString() === yesterday.toDateString();

//   if (isToday) return 'Today';
//   if (isYesterday) return 'Yesterday';
//   return local.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
// }

// function groupByDay(records) {
//   const groups = {};
//   records.forEach((r) => {
//     if (!groups[r.day]) groups[r.day] = [];
//     groups[r.day].push(r);
//   });
//   return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
// }

// function downloadExport(period, format) {
//   const token = localStorage.getItem('pos_token');
//   const url = `${API_ORIGIN}/api/attendance/export?period=${period}&format=${format}`;
//   fetch(url, { headers: { Authorization: `Bearer ${token}` } })
//     .then((res) => res.blob())
//     .then((blob) => {
//       const labels = { day: 'Daily', month: 'Monthly', year: 'Yearly' };
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `${labels[period]}-Attendance-Report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
//       link.click();
//     })
//     .catch(() => alert('Could not download the report — check your connection and try again.'));
// }

// function printReport() {
//   window.print();
// }

// export default function AttendanceRecords() {
//   const [range, setRange] = useState('today');
//   const [search, setSearch] = useState('');
//   const [records, setRecords] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   async function load() {
//     const { data } = await api.get('/attendance', { params: { range, search } });
//     setRecords(data);
//     setLastUpdated(new Date());
//   }

//   useEffect(() => {
//     load();
//     const interval = setInterval(load, POLL_INTERVAL_MS);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [range, search]);

//   const grouped = groupByDay(records);

//   const reportCards = [
//     { key: 'day', title: 'Daily Report', subtitle: new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }) },
//     { key: 'month', title: 'Monthly Report', subtitle: `${new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })} · all departments` },
//     { key: 'year', title: 'Yearly Report', subtitle: `${new Date().getFullYear()} year to date` },
//   ];

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-1">
//         <p className="text-2xl font-bold">Attendance Records</p>
//         {lastUpdated && (
//           <span className="flex items-center gap-1.5 text-xs text-gray-400">
//             <RefreshCw size={12} />
//             Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </span>
//         )}
//       </div>
//       <p className="text-sm text-gray-500 mb-6">
//         Every check-in and check-out &middot; {search ? 'searching all history' : 'refreshes automatically'}
//       </p>

//       <div className="flex items-center justify-between mb-4">
//         <div className="flex gap-2">
//           {['today', 'week', 'month', 'all'].map((r) => (
//             <button
//               key={r}
//               onClick={() => setRange(r)}
//               disabled={!!search}
//               title={search ? 'Clear search to use date tabs' : undefined}
//               className={`px-3 py-1.5 rounded-lg text-sm capitalize disabled:opacity-40 ${
//                 range === r && !search ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
//               }`}
//             >
//               {r === 'today' ? 'Today' : r === 'all' ? 'All time' : `This ${r}`}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Search name or department… (searches all history)"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2  focus:ring-slate-700 focus:border-slate-700"
//         />
//       </div>

//       <div className="flex flex-col gap-4 mb-8">
//         {grouped.map(([day, events]) => (
//           <div key={day} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
//             <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//               {formatDayHeader(day)}
//             </div>
//             <table className="w-full text-sm">
//               <tbody>
//                 {events.map((r) => (
//                   <tr key={r.id} className="border-t border-gray-100">
//                     <td className="px-4 py-2.5 font-medium w-1/3">{r.full_name}</td>
//                     <td className="px-4 py-2.5 text-gray-500 w-1/4">{r.department_name || '—'}</td>
//                     <td className="px-4 py-2.5">
//                       <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${
//                         r.type === 'check_in' ? 'bg-sky-50 text-sky-700' : 'bg-gray-100 text-gray-600'
//                       }`}>
//                         {r.type === 'check_in' ? <LogIn size={12} /> : <LogOut size={12} />}
//                         {r.type === 'check_in' ? 'Check In' : 'Check Out'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2.5 text-gray-500">{formatTime(r.scanned_at)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}

//         {grouped.length === 0 && (
//           <div className="border border-gray-200 rounded-xl bg-white px-4 py-10 text-center text-gray-400 text-sm">
//             No records found
//           </div>
//         )}
//       </div>

//       <p className="text-2xl font-bold mb-1">Reports</p>
//       <p className="text-sm text-gray-500 mb-4">Export or print attendance summaries</p>

//       <div className="grid grid-cols-3 gap-4">
//         {reportCards.map((r) => (
//           <div key={r.key} className="border border-gray-200 rounded-xl p-5 bg-white">
//             <p className="font-semibold mb-0.5">{r.title}</p>
//             <p className="text-sm text-gray-400 mb-4">{r.subtitle}</p>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => downloadExport(r.key, 'pdf')}
//                 className="flex items-center gap-1.5 bg-red-50 text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-100"
//               >
//                 <FileText size={14} /> PDF
//               </button>
//               <button
//                 onClick={() => downloadExport(r.key, 'excel')}
//                 className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-emerald-100"
//               >
//                 <FileSpreadsheet size={14} /> Excel
//               </button>
//               <button
//                 onClick={printReport}
//                 className="flex items-center gap-1.5 border border-gray-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
//               >
//                 <Printer size={14} /> Print
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import { RefreshCw, LogIn, LogOut, FileSpreadsheet, FileText, Printer, Search } from 'lucide-react';
import api from '../api/client';

const POLL_INTERVAL_MS = 10000;
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDayHeader(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const local = new Date(y, m - 1, d);
  const today = new Date();
  const isToday = local.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = local.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return local.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDayCompact(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const local = new Date(y, m - 1, d);
  return local.toLocaleDateString([], { day: '2-digit', month: 'short' });
}

function groupByDay(records) {
  const groups = {};
  records.forEach((r) => {
    if (!groups[r.day]) groups[r.day] = [];
    groups[r.day].push(r);
  });
  return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

function downloadExport(period, format) {
  const token = localStorage.getItem('pos_token');
  const url = `${API_ORIGIN}/api/attendance/export?period=${period}&format=${format}`;
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.blob())
    .then((blob) => {
      const labels = { day: 'Daily', month: 'Monthly', year: 'Yearly' };
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${labels[period]}-Attendance-Report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      link.click();
    })
    .catch(() => alert('Could not download the report — check your connection and try again.'));
}

function printReport() {
  window.print();
}

export default function AttendanceRecords() {
  const [range, setRange] = useState('today');
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function load() {
    const { data } = await api.get('/attendance', { params: { range, search } });
    setRecords(data);
    setLastUpdated(new Date());
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, search]);

  const grouped = groupByDay(records);

  const reportCards = [
    {
      key: 'day',
      title: 'Daily',
      subtitle: new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }),
    },
    {
      key: 'month',
      title: 'Monthly',
      subtitle: `${new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })} · all departments`,
    },
    {
      key: 'year',
      title: 'Yearly',
      subtitle: `${new Date().getFullYear()} year to date`,
    },
  ];

  return (
    <div className="bg-[#FAFAF7] min-h-full font-sans text-[#1C1E22]">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-2xl font-bold tracking-tight">Attendance Ledger</p>
          <p className="text-sm text-[#8A8D93] mt-0.5">
            Every check-in and check-out &middot; {search ? 'searching all history' : 'refreshes automatically'}
          </p>
        </div>
        {lastUpdated && (
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A8D93] mt-1 shrink-0">
            <RefreshCw size={11} />
            SYNCED {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()}
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 mt-6 mb-5">
        <div className="flex gap-1 bg-[#F0EEE8] p-1 rounded-xl border border-[#E7E5E0]">
          {['today', 'week', 'month', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              disabled={!!search}
              title={search ? 'Clear search to use date tabs' : undefined}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize disabled:opacity-40 transition-colors ${
                range === r && !search
                  ? 'bg-[#1C1E22] text-white shadow-sm'
                  : 'text-[#6B6F76] hover:text-[#1C1E22]'
              }`}
            >
              {r === 'today' ? 'Today' : r === 'all' ? 'All time' : `This ${r}`}
            </button>
          ))}
        </div>
        <div className="relative w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B5B2A8]" />
          <input
            type="text"
            placeholder="Search name or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#E7E5E0] bg-white rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-[#B5B2A8] focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
          />
        </div>
      </div>

      {/* Ledger */}
      <div className="flex flex-col gap-6 mb-10">
        {grouped.map(([day, events]) => (
          <div key={day}>
            <div className="flex items-center gap-2 mb-2.5 pl-1">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#8A8D93] uppercase">
                {formatDayHeader(day)}
              </span>
              <span className="text-[11px] font-mono text-[#C7C4BA]">{formatDayCompact(day)}</span>
              <div className="flex-1 h-px bg-[#E7E5E0]" />
              <span className="text-[11px] font-mono text-[#C7C4BA]">{events.length} entries</span>
            </div>

            <div className="border border-[#E7E5E0] rounded-2xl bg-white overflow-hidden">
              <div className="relative">
                {/* punch rail */}
                <div className="absolute left-[27px] top-0 bottom-0 w-px bg-[#E7E5E0]" />
                {events.map((r, i) => {
                  const isCheckIn = r.type === 'check_in';
                  return (
                    <div
                      key={r.id}
                      className={`relative flex items-center gap-4 pl-6 pr-4 py-3 ${
                        i !== 0 ? 'border-t border-[#F1EFE9]' : ''
                      }`}
                    >
                      <span
                        className={`relative z-10 shrink-0 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ${
                          isCheckIn ? 'bg-[#B8791A] ring-[#B8791A]/20' : 'bg-[#3A5A6B] ring-[#3A5A6B]/20'
                        }`}
                      />
                      <span className="font-medium text-sm w-1/3 truncate">{r.full_name}</span>
                      <span className="text-sm text-[#8A8D93] w-1/4 truncate">{r.department_name || '—'}</span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md font-medium ${
                          isCheckIn ? 'bg-[#FBF0DE] text-[#8A5A12]' : 'bg-[#E9F0F2] text-[#2C4854]'
                        }`}
                      >
                        {isCheckIn ? <LogIn size={12} /> : <LogOut size={12} />}
                        {isCheckIn ? 'Check In' : 'Check Out'}
                      </span>
                      <span className="ml-auto font-mono text-sm text-[#6B6F76] tabular-nums">
                        {formatTime(r.scanned_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="border border-dashed border-[#E0DDD3] rounded-2xl bg-white px-4 py-14 text-center">
            <p className="text-sm text-[#8A8D93]">No punches recorded for this view.</p>
            <p className="text-xs text-[#C7C4BA] mt-1 font-mono">Try a wider date range or clear your search</p>
          </div>
        )}
      </div>

      {/* Reports */}
      <p className="text-2xl font-bold tracking-tight mb-1">Reports</p>
      <p className="text-sm text-[#8A8D93] mb-4">Export or print attendance summaries</p>

      <div className="grid grid-cols-3 gap-4">
        {reportCards.map((r) => (
          <div key={r.key} className="border border-[#E7E5E0] rounded-2xl p-5 bg-white">
            <div className="w-8 h-8 rounded-lg bg-[#F0EEE8] flex items-center justify-center mb-3">
              <span className="font-mono text-[11px] font-semibold text-[#6B6F76]">
                {r.key === 'day' ? '1D' : r.key === 'month' ? '1M' : '1Y'}
              </span>
            </div>
            <p className="font-semibold mb-0.5">{r.title} Report</p>
            <p className="text-xs text-[#B5B2A8] mb-4">{r.subtitle}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => downloadExport(r.key, 'pdf')}
                className="flex items-center gap-1.5 bg-[#1C1E22] text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#33363C] transition-colors"
              >
                <FileText size={14} /> PDF
              </button>
              <button
                onClick={() => downloadExport(r.key, 'excel')}
                className="flex items-center gap-1.5 bg-[#F0EEE8] text-[#1C1E22] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#E7E5E0] transition-colors"
              >
                <FileSpreadsheet size={14} /> Excel
              </button>
              <button
                onClick={printReport}
                className="flex items-center gap-1.5 border border-[#E7E5E0] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#F7F6F2] transition-colors"
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
