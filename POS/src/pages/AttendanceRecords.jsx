

import React, { useEffect, useState } from 'react';
import { RefreshCw, LogIn, LogOut, FileSpreadsheet, FileText, Printer } from 'lucide-react';
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
    { key: 'day', title: 'Daily Report', subtitle: new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }) },
    { key: 'month', title: 'Monthly Report', subtitle: `${new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })} · all departments` },
    { key: 'year', title: 'Yearly Report', subtitle: `${new Date().getFullYear()} year to date` },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-2xl font-bold">Attendance Records</p>
        {lastUpdated && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <RefreshCw size={12} />
            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Every check-in and check-out &middot; {search ? 'searching all history' : 'refreshes automatically'}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {['today', 'week', 'month', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              disabled={!!search}
              title={search ? 'Clear search to use date tabs' : undefined}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize disabled:opacity-40 ${
                range === r && !search ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {r === 'today' ? 'Today' : r === 'all' ? 'All time' : `This ${r}`}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search name or department… (searches all history)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2  focus:ring-slate-700 focus:border-slate-700"
        />
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {grouped.map(([day, events]) => (
          <div key={day} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {formatDayHeader(day)}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {events.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-4 py-2.5 font-medium w-1/3">{r.full_name}</td>
                    <td className="px-4 py-2.5 text-gray-500 w-1/4">{r.department_name || '—'}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${
                        r.type === 'check_in' ? 'bg-sky-50 text-sky-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {r.type === 'check_in' ? <LogIn size={12} /> : <LogOut size={12} />}
                        {r.type === 'check_in' ? 'Check In' : 'Check Out'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{formatTime(r.scanned_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="border border-gray-200 rounded-xl bg-white px-4 py-10 text-center text-gray-400 text-sm">
            No records found
          </div>
        )}
      </div>

      <p className="text-2xl font-bold mb-1">Reports</p>
      <p className="text-sm text-gray-500 mb-4">Export or print attendance summaries</p>

      <div className="grid grid-cols-3 gap-4">
        {reportCards.map((r) => (
          <div key={r.key} className="border border-gray-200 rounded-xl p-5 bg-white">
            <p className="font-semibold mb-0.5">{r.title}</p>
            <p className="text-sm text-gray-400 mb-4">{r.subtitle}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => downloadExport(r.key, 'pdf')}
                className="flex items-center gap-1.5 bg-red-50 text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-100"
              >
                <FileText size={14} /> PDF
              </button>
              <button
                onClick={() => downloadExport(r.key, 'excel')}
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-emerald-100"
              >
                <FileSpreadsheet size={14} /> Excel
              </button>
              <button
                onClick={printReport}
                className="flex items-center gap-1.5 border border-gray-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
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
//       <div className="flex items-center justify-between mb-1 fade-in-up">
//         <p className="text-2xl font-bold text-slate-800">Attendance Records</p>
//         {lastUpdated && (
//           <span className="flex items-center gap-1.5 text-xs text-slate-400">
//             <RefreshCw size={12} />
//             Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </span>
//         )}
//       </div>
//       <p className="text-sm text-slate-500 mb-6 fade-in-up">
//         Every check-in and check-out &middot; {search ? 'searching all history' : 'refreshes automatically'}
//       </p>

//       <div className="flex items-center justify-between mb-4 fade-in-up">
//         <div className="flex gap-2">
//           {['today', 'week', 'month', 'all'].map((r) => (
//             <button
//               key={r}
//               onClick={() => setRange(r)}
//               disabled={!!search}
//               title={search ? 'Clear search to use date tabs' : undefined}
//               className={`px-3 py-1.5 rounded-lg text-sm capitalize disabled:opacity-40 transition-colors ${
//                 range === r && !search
//                   ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow shadow-indigo-200'
//                   : 'bg-slate-100 text-slate-600'
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
//           className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
//         />
//       </div>

//       <div className="flex flex-col gap-4 mb-8">
//         {grouped.map(([day, events], i) => (
//           <div
//             key={day}
//             style={{ animationDelay: `${i * 0.06}s` }}
//             className="fade-in-up border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
//           >
//             <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
//               {formatDayHeader(day)}
//             </div>
//             <table className="w-full text-sm">
//               <tbody>
//                 {events.map((r) => (
//                   <tr key={r.id} className="border-t border-slate-100">
//                     <td className="px-4 py-2.5 font-medium text-slate-800 w-1/3">{r.full_name}</td>
//                     <td className="px-4 py-2.5 text-slate-500 w-1/4">{r.department_name || '—'}</td>
//                     <td className="px-4 py-2.5">
//                       <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${
//                         r.type === 'check_in' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
//                       }`}>
//                         {r.type === 'check_in' ? <LogIn size={12} /> : <LogOut size={12} />}
//                         {r.type === 'check_in' ? 'Check In' : 'Check Out'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2.5 text-slate-500">{formatTime(r.scanned_at)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}

//         {grouped.length === 0 && (
//           <div className="border border-slate-200 rounded-2xl bg-white px-4 py-10 text-center text-slate-400 text-sm shadow-sm">
//             No records found
//           </div>
//         )}
//       </div>

//       <p className="text-2xl font-bold text-slate-800 mb-1 fade-in-up">Reports</p>
//       <p className="text-sm text-slate-500 mb-4 fade-in-up">Export or print attendance summaries</p>

//       <div className="grid grid-cols-3 gap-4">
//         {reportCards.map((r, i) => (
//           <div
//             key={r.key}
//             style={{ animationDelay: `${i * 0.08}s` }}
//             className="fade-in-up border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300"
//           >
//             <p className="font-semibold text-slate-800 mb-0.5">{r.title}</p>
//             <p className="text-sm text-slate-400 mb-4">{r.subtitle}</p>
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
//                 className="flex items-center gap-1.5 border border-indigo-200 text-indigo-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-indigo-50"
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