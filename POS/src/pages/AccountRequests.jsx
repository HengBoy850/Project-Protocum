
// import React, { useEffect, useState } from 'react';
// import { Check, X, Clock3, AlertCircle } from 'lucide-react';
// import api from '../api/client';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const POLL_INTERVAL_MS = 15000;

// function timeAgo(iso) {
//   const diffMs = Date.now() - new Date(iso).getTime();
//   const hours = Math.floor(diffMs / (1000 * 60 * 60));
//   if (hours < 1) return 'Just now';
//   if (hours < 24) return `${hours}h ago`;
//   return `${Math.floor(hours / 24)}d ago`;
// }

// export default function AccountRequests() {
//   const [requests, setRequests] = useState([]);
//   const [qrModal, setQrModal] = useState(null);
//   const [error, setError] = useState('');

//   async function load() {
//     try {
//       const { data } = await api.get('/staff', { params: { status: 'pending' } });
//       setRequests(data);
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not load requests');
//     }
//   }

//   useEffect(() => {
//     load();
//     const interval = setInterval(load, POLL_INTERVAL_MS); // new sign-ups appear on their own
//     return () => clearInterval(interval);
//   }, []);

//   async function approve(id, name) {
//     try {
//       const { data } = await api.post(`/staff/${id}/approve`);
//       setQrModal({ name, qrDataUrl: data.qrDataUrl, employeeCode: data.employeeCode });
//       load();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not approve this request');
//     }
//   }

//   async function deny(id) {
//     if (!confirm('Deny this registration? They can re-register if this was a mistake.')) return;
//     try {
//       await api.post(`/staff/${id}/deny`);
//       load();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not deny this request');
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-1">
//         <p className="text-2xl font-bold">Account Requests</p>
//         <span className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
//           {requests.length} pending
//         </span>
//       </div>
//       <p className="text-sm text-gray-500 mb-4">
//         New staff sign up themselves — confirm their identity against the photo before approving.
//       </p>

//       {error && (
//         <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
//           <AlertCircle size={15} className="shrink-0" />
//           {error}
//         </div>
//       )}

//       {requests.length === 0 && !error && (
//         <div className="border border-dashed border-gray-300 rounded-xl py-16 text-center text-gray-400 text-sm">
//           No pending requests right now
//         </div>
//       )}

//       <div className="flex flex-col gap-3">
//         {requests.map((r) => (
//           <div key={r.id} className="border border-gray-200 rounded-xl p-4 bg-white flex items-center gap-4">
//             {r.photo_url ? (
//               <img
//                 src={`${API_ORIGIN}${r.photo_url}`}
//                 alt={r.full_name}
//                 className="w-16 h-16 rounded-xl object-cover border border-gray-100"
//               />
//             ) : (
//               <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
//                 No photo
//               </div>
//             )}

//             <div className="flex-1 min-w-0">
//               <p className="font-semibold">{r.full_name}</p>
//               <p className="text-sm text-gray-500">{r.position} &middot; {r.department_name || 'No department'}</p>
//               <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
//                 <Clock3 size={12} /> Requested {timeAgo(r.created_at)}
//               </p>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => deny(r.id)}
//                 className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50"
//               >
//                 <X size={14} /> Deny
//               </button>
//               <button
//                 onClick={() => approve(r.id, r.full_name)}
//                 className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
//               >
//                 <Check size={14} /> Approve
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {qrModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={() => setQrModal(null)}>
//           <div className="bg-white rounded-xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
//             <p className="font-medium mb-1">{qrModal.name} approved</p>
//             <p className="text-xs text-gray-400 mb-3">{qrModal.employeeCode}</p>
//             <img src={qrModal.qrDataUrl} alt="QR code" className="w-48 h-48 mx-auto" />
//             <p className="text-xs text-gray-400 mt-3">This has also been saved to their profile</p>
//             <button onClick={() => setQrModal(null)} className="mt-4 text-sm text-gray-500 underline">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { Check, X, Clock3, AlertCircle } from 'lucide-react';
import api from '../api/client';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const POLL_INTERVAL_MS = 15000;

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AccountRequests() {
  const [requests, setRequests] = useState([]);
  const [qrModal, setQrModal] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/staff', { params: { status: 'pending' } });
      setRequests(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load requests');
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  async function approve(id, name) {
    try {
      const { data } = await api.post(`/staff/${id}/approve`);
      setQrModal({ name, qrDataUrl: data.qrDataUrl, employeeCode: data.employeeCode });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not approve this request');
    }
  }

  async function deny(id) {
    if (!confirm('Deny this registration? They can re-register if this was a mistake.')) return;
    try {
      await api.post(`/staff/${id}/deny`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not deny this request');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1 fade-in-up">
        <p className="text-2xl font-bold text-slate-800">Account Requests</p>
        <span className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
          {requests.length} pending
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-4 fade-in-up">
        New staff sign up themselves — confirm their identity against the photo before approving.
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {requests.length === 0 && !error && (
        <div className="border border-dashed border-slate-300 rounded-2xl py-16 text-center text-slate-400 text-sm bg-white">
          No pending requests right now
        </div>
      )}

      <div className="flex flex-col gap-3">
        {requests.map((r, i) => (
          <div
            key={r.id}
            style={{ animationDelay: `${i * 0.05}s` }}
            className="fade-in-up border border-slate-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
          >
            {r.photo_url ? (
              <img
                src={`${API_ORIGIN}${r.photo_url}`}
                alt={r.full_name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                No photo
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800">{r.full_name}</p>
              <p className="text-sm text-slate-500">{r.position} &middot; {r.department_name || 'No department'}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Clock3 size={12} /> Requested {timeAgo(r.created_at)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => deny(r.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50"
              >
                <X size={14} /> Deny
              </button>
              <button
                onClick={() => approve(r.id, r.full_name)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-90 shadow shadow-indigo-200"
              >
                <Check size={14} /> Approve
              </button>
            </div>
          </div>
        ))}
      </div>

      {qrModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={() => setQrModal(null)}>
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-medium mb-1">{qrModal.name} approved</p>
            <p className="text-xs text-slate-400 mb-3">{qrModal.employeeCode}</p>
            <img src={qrModal.qrDataUrl} alt="QR code" className="w-48 h-48 mx-auto" />
            <p className="text-xs text-slate-400 mt-3">This has also been saved to their profile</p>
            <button onClick={() => setQrModal(null)} className="mt-4 text-sm text-indigo-600 underline">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}