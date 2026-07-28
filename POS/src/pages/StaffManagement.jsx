
// import React, { useEffect, useState } from 'react';
// import { QrCode, Pencil, UserX, Download, Printer, X } from 'lucide-react';
// import api from '../api/client';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// const AVATAR_SIZES = {
//   9: 'w-9 h-9',
//   12: 'w-12 h-12',
//   16: 'w-16 h-16',
// };

// function StaffAvatar({ photoUrl, name, size = 9 }) {
//   const sizeClass = AVATAR_SIZES[size] || AVATAR_SIZES[9];
//   if (photoUrl) {
//     return (
//       <img
//         src={`${API_ORIGIN}${photoUrl}`}
//         alt={name}
//         className={`${sizeClass} rounded-full object-cover ring-1 ring-black/5 shrink-0`}
//       />
//     );
//   }
//   const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase();
//   return (
//     <div className={`${sizeClass} rounded-full bg-indigo-50 flex items-center justify-center text-xs font-medium text-indigo-700 shrink-0`}>
//       {initials}
//     </div>
//   );
// }

// function loadImage(src, crossOrigin) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     if (crossOrigin) img.crossOrigin = crossOrigin;
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = src;
//   });
// }

// function roundRectPath(ctx, x, y, w, h, r) {
//   if (ctx.roundRect) {
//     ctx.beginPath();
//     ctx.roundRect(x, y, w, h, r);
//     return;
//   }
//   ctx.beginPath();
//   ctx.moveTo(x + r, y);
//   ctx.arcTo(x + w, y, x + w, y + h, r);
//   ctx.arcTo(x + w, y + h, x, y + h, r);
//   ctx.arcTo(x, y + h, x, y, r);
//   ctx.arcTo(x, y, x + w, y, r);
//   ctx.closePath();
// }

// // Flat-top hexagon centered at (x, y) with "radius" r (center-to-vertex).
// function hexagonPath(ctx, x, y, r) {
//   ctx.beginPath();
//   for (let i = 0; i < 6; i++) {
//     const angle = (Math.PI / 180) * (60 * i - 90);
//     const px = x + r * Math.cos(angle);
//     const py = y + r * Math.sin(angle);
//     if (i === 0) ctx.moveTo(px, py);
//     else ctx.lineTo(px, py);
//   }
//   ctx.closePath();
// }

// // Badge layout: white header w/ logo mark → accent name band with a hexagon
// // photo overlapping it → white position strip → accent QR block with an ID
// // pill → white footer with the department/scan hint. Matches the reference
// // hex-photo badge instead of the earlier round-photo lanyard card.
// async function generateIdCardDataUrl(staff, qrDataUrl) {
//   const canvas = document.createElement('canvas');
//   const W = 320, H = 560;
//   canvas.width = W;
//   canvas.height = H;
//   const ctx = canvas.getContext('2d');
//   const cx = W / 2;

//   const ACCENT = '#3730a3';       // indigo-800 — matches the rest of the app
//   const ACCENT_LIGHT = '#eef2ff';

//   roundRectPath(ctx, 0, 0, W, H, 22);
//   ctx.fillStyle = '#ffffff';
//   ctx.fill();
//   ctx.save();
//   roundRectPath(ctx, 0, 0, W, H, 22);
//   ctx.clip();

//   // Section layout
//   const headerH = 54;
//   const nameBandY = headerH, nameBandH = 108;
//   const positionBandY = nameBandY + nameBandH, positionBandH = 56;
//   const qrSectionY = positionBandY + positionBandH, qrSectionH = 268;

//   ctx.fillStyle = ACCENT;
//   ctx.fillRect(0, nameBandY, W, nameBandH);
//   ctx.fillStyle = ACCENT;
//   ctx.fillRect(0, qrSectionY, W, qrSectionH);

//   // Logo mark, top-left
//   ctx.beginPath();
//   ctx.arc(30, 27, 9, 0, Math.PI * 2);
//   ctx.strokeStyle = ACCENT;
//   ctx.lineWidth = 2.5;
//   ctx.stroke();
//   ctx.beginPath();
//   ctx.arc(30, 27, 3, 0, Math.PI * 2);
//   ctx.fillStyle = ACCENT;
//   ctx.fill();
//   ctx.fillStyle = '#334155';
//   ctx.font = '600 13px sans-serif';
//   ctx.textAlign = 'left';
//   ctx.textBaseline = 'middle';
//   ctx.fillText('StaffSync', 46, 27);

//   // Hexagon photo, right side, overlapping the name band
//   const hexCx = W - 92;
//   const hexCy = nameBandY + nameBandH / 2 - 6;
//   const hexR = 58;
//   const hexRInner = 50;

//   hexagonPath(ctx, hexCx, hexCy, hexR);
//   ctx.fillStyle = '#ffffff';
//   ctx.fill();
//   hexagonPath(ctx, hexCx, hexCy, hexR - 5);
//   ctx.fillStyle = ACCENT_LIGHT;
//   ctx.fill();

//   try {
//     if (!staff.photo_url) throw new Error('no photo');
//     const img = await loadImage(`${API_ORIGIN}${staff.photo_url}`, 'anonymous');
//     ctx.save();
//     hexagonPath(ctx, hexCx, hexCy, hexRInner);
//     ctx.clip();
//     ctx.drawImage(img, hexCx - hexRInner, hexCy - hexRInner, hexRInner * 2, hexRInner * 2);
//     ctx.restore();
//   } catch {
//     hexagonPath(ctx, hexCx, hexCy, hexRInner);
//     ctx.fillStyle = ACCENT_LIGHT;
//     ctx.fill();
//     ctx.fillStyle = ACCENT;
//     ctx.font = '600 26px sans-serif';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     const initials = staff.full_name.split(' ').map((p) => p[0]).join('').toUpperCase();
//     ctx.fillText(initials, hexCx, hexCy + 2);
//   }

//   // Name / surname — left-aligned in the accent band, next to the hexagon
//   const [firstName, ...restName] = staff.full_name.split(' ');
//   const surname = restName.join(' ');
//   ctx.textAlign = 'left';
//   ctx.textBaseline = 'alphabetic';
//   ctx.fillStyle = '#ffffff';
//   ctx.font = '700 20px sans-serif';
//   ctx.fillText(firstName.toUpperCase(), 26, nameBandY + nameBandH / 2 + 2);
//   if (surname) {
//     ctx.fillText(surname.toUpperCase(), 26, nameBandY + nameBandH / 2 + 26);
//   }

//   // Position strip
//   ctx.textAlign = 'center';
//   ctx.fillStyle = '#475569';
//   ctx.font = '600 12px sans-serif';
//   ctx.save();
//   ctx.letterSpacing = '1.5px';
//   ctx.fillText((staff.position || '').toUpperCase(), cx, positionBandY + positionBandH / 2 + 4);
//   ctx.restore();

//   // QR box
//   const qrBoxSize = 168;
//   const qrBoxX = cx - qrBoxSize / 2;
//   const qrBoxY = qrSectionY + 24;
//   roundRectPath(ctx, qrBoxX - 10, qrBoxY - 10, qrBoxSize + 20, qrBoxSize + 20, 14);
//   ctx.fillStyle = '#ffffff';
//   ctx.fill();
//   const qrImg = await loadImage(qrDataUrl);
//   ctx.drawImage(qrImg, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

//   // ID pill
//   const idText = `ID: ${staff.employee_code || ''}`;
//   ctx.font = '600 13px sans-serif';
//   const idPillW = ctx.measureText(idText).width + 36;
//   const idPillY = qrBoxY + qrBoxSize + 22;
//   roundRectPath(ctx, cx - idPillW / 2, idPillY, idPillW, 30, 15);
//   ctx.fillStyle = '#ffffff';
//   ctx.fill();
//   ctx.fillStyle = ACCENT;
//   ctx.textBaseline = 'middle';
//   ctx.fillText(idText, cx, idPillY + 15);

//   // Footer — address / scan hint
//   ctx.fillStyle = '#94a3b8';
//   ctx.font = '400 10px sans-serif';
//   ctx.textBaseline = 'alphabetic';
//   const footerCenterY = qrSectionY + qrSectionH + (H - (qrSectionY + qrSectionH)) / 2;
//   const footerLine = staff.department_name
//     ? `${staff.department_name} · Scan to check in / out`
//     : 'Scan to check in / out';
//   ctx.fillText(footerLine, cx, footerCenterY + 4);

//   ctx.restore();
//   return canvas.toDataURL('image/png');
// }

// function StaffDetailModal({ staff, departments, onClose, onSaved }) {
//   const [departmentId, setDepartmentId] = useState(staff.department_id || '');
//   const [position, setPosition] = useState(staff.position || '');
//   const [status, setStatus] = useState(staff.status || 'active');
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   async function handleSave() {
//     setSaving(true);
//     setError('');
//     try {
//       await api.put(`/staff/${staff.id}`, { departmentId, position, status });
//       onSaved();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not save changes');
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
//         <div className="flex items-center justify-between mb-5">
//           <p className="font-semibold text-lg">Staff details</p>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-1">
//             <X size={18} />
//           </button>
//         </div>

//         <div className="flex items-center gap-3 mb-5">
//           <StaffAvatar photoUrl={staff.photo_url} name={staff.full_name} size={12} />
//           <div>
//             <p className="font-medium">{staff.full_name}</p>
//             <p className="text-xs text-slate-500">{staff.employee_code}</p>
//           </div>
//         </div>

//         <div className="text-sm text-slate-500 mb-5 space-y-0.5 bg-slate-50 rounded-lg px-3 py-2.5">
//           <p>{staff.email}</p>
//           <p>{staff.phone}</p>
//         </div>

//         <div className="space-y-3">
//           <div>
//             <label className="text-sm text-slate-600 block mb-1">Department</label>
//             <select
//               value={departmentId}
//               onChange={(e) => setDepartmentId(e.target.value)}
//               className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
//             >
//               {departments.map((d) => (
//                 <option key={d.id} value={d.id}>{d.name}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm text-slate-600 block mb-1">Position</label>
//             <input
//               value={position}
//               onChange={(e) => setPosition(e.target.value)}
//               className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
//             />
//           </div>

//           <div>
//             <label className="text-sm text-slate-600 block mb-1">Status</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//         </div>

//         {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

//         <div className="flex gap-2 mt-5">
//           <button onClick={onClose} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-50 shadow shadow-indigo-200"
//           >
//             {saving ? 'Saving…' : 'Save changes'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function QrCardModal({ staff, qrDataUrl, onClose }) {
//   const [cardDataUrl, setCardDataUrl] = useState(null);
//   const [generating, setGenerating] = useState(true);
//   const [genError, setGenError] = useState('');

//   useEffect(() => {
//     generateIdCardDataUrl(staff, qrDataUrl)
//       .then(setCardDataUrl)
//       .catch(() => setGenError('Could not render the photo onto the card — showing QR only.'))
//       .finally(() => setGenerating(false));
//   }, [staff, qrDataUrl]);

//   function handleDownload() {
//     const a = document.createElement('a');
//     a.href = cardDataUrl || qrDataUrl;
//     a.download = `${staff.employee_code}-id-card.png`;
//     a.click();
//   }

//   function handlePrint() {
//     const win = window.open('', '_blank', 'width=400,height=680');
//     win.document.write(`
//       <html>
//         <head><title>${staff.full_name} — ID Card</title></head>
//         <body style="margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f1f5f9;">
//           <img src="${cardDataUrl || qrDataUrl}" style="width: 300px;" />
//           <script>window.onload = () => window.print();</script>
//         </body>
//       </html>
//     `);
//     win.document.close();
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
//       <div className="bg-[#16213E] rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center " onClick={(e) => e.stopPropagation()}>
//         {generating ? (
//           <div style={{ aspectRatio: '320 / 560' }} className="rounded-xl bg-slate-100 flex items-center justify-center text-sm text-slate-400 mb-4">
//             Rendering card…
//           </div>
//         ) : (
//           <img src={cardDataUrl || qrDataUrl} alt="ID card" className="w-full rounded-xl mb-4 shadow" />
//         )}

//         {genError && <p className="text-xs text-amber-600 mb-3">{genError}</p>}

//         <div className="flex gap-2">
//           <button
//             onClick={handleDownload}
//             disabled={generating}
//             className="flex-1 flex items-center justify-center gap-1.5 border border-slate-300 rounded-lg py-2.5 text-sm font-medium bg-slate-50 hover:bg-slate-300 disabled:opacity-50"
//           >
//             <Download size={14} /> Download
//           </button>
//           <button
//             onClick={handlePrint}
//             disabled={generating}
//             className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-50 shadow shadow-indigo-200"
//           >
//             <Printer size={14} /> Print
//           </button>
//         </div>
//         <button onClick={onClose} className="mt-4 text-sm text-slate-500 underline">Close</button>
//       </div>
//     </div>
//   );
// }

// export default function StaffManagement() {
//   const [staff, setStaff] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [search, setSearch] = useState('');
//   const [qrModal, setQrModal] = useState(null);
//   const [detailStaff, setDetailStaff] = useState(null);

//   async function load() {
//     const { data } = await api.get('/staff', { params: { status: 'active', search } });
//     setStaff(data);
//   }

//   useEffect(() => { load(); }, [search]);
//   useEffect(() => {
//     api.get('/departments').then((res) => setDepartments(res.data));
//   }, []);

//   async function deactivate(id) {
//     if (!confirm('Deactivate this staff member? Their attendance history is kept.')) return;
//     await api.delete(`/staff/${id}`);
//     load();
//   }

//   return (
//     <div>
//       <p className="text-2xl font-bold text-slate-800 mb-1 fade-in-up">Staff Management</p>
//       <p className="text-sm text-slate-500 mb-6 fade-in-up">{staff.length} staff across your departments</p>

//       <input
//         type="text"
//         placeholder="Search staff by name, ID, or department…"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full max-w-md border border-slate-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-slate-700 fade-in-up"
//       />

//       <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm fade-in-up">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
//             <tr>
//               <th className="text-left px-4 py-3">Staff</th>
//               <th className="text-left px-4 py-3">Department</th>
//               <th className="text-left px-4 py-3">Position</th>
//               <th className="text-left px-4 py-3">Status</th>
//               <th className="text-left px-4 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {staff.map((s) => (
//               <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50/50">
//                 <td className="px-4 py-3 flex items-center gap-3">
//                   <StaffAvatar photoUrl={s.photo_url} name={s.full_name} />
//                   <div>
//                     <p className="font-medium text-slate-800">{s.full_name}</p>
//                     <p className="text-xs text-slate-500">{s.employee_code}</p>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 text-slate-600">{s.department_name || '—'}</td>
//                 <td className="px-4 py-3 text-slate-600">{s.position}</td>
//                 <td className="px-4 py-3">
//                   <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">Active</span>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex gap-3 text-slate-400">
//                     <button onClick={() => setDetailStaff(s)} className="hover:text-indigo-600" title="View / edit details">
//                       <Pencil size={15} />
//                     </button>
//                     <button
//                       onClick={async () => {
//                         const { data } = await api.get(`/staff/${s.id}/qr`);
//                         setQrModal({ staff: s, qrDataUrl: data.qrDataUrl });
//                       }}
//                       className="hover:text-indigo-600"
//                       title="View QR card"
//                     >
//                       <QrCode size={15} />
//                     </button>
//                     <button onClick={() => deactivate(s.id)} className="hover:text-red-600" title="Deactivate">
//                       <UserX size={15} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {staff.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No staff found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {detailStaff && (
//         <StaffDetailModal
//           staff={detailStaff}
//           departments={departments}
//           onClose={() => setDetailStaff(null)}
//           onSaved={load}
//         />
//       )}

//       {qrModal && (
//         <QrCardModal staff={qrModal.staff} qrDataUrl={qrModal.qrDataUrl} onClose={() => setQrModal(null)} />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { QrCode, Pencil, UserX, Download, Printer, X, Search } from 'lucide-react';
import api from '../api/client';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const AVATAR_SIZES = {
  9: 'w-9 h-9',
  12: 'w-12 h-12',
  16: 'w-16 h-16',
};

function StaffAvatar({ photoUrl, name, size = 9 }) {
  const sizeClass = AVATAR_SIZES[size] || AVATAR_SIZES[9];
  if (photoUrl) {
    return (
      <img
        src={`${API_ORIGIN}${photoUrl}`}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-1 ring-black/5 shrink-0`}
      />
    );
  }
  const initials = name.split(' ').map((p) => p[0]).join('').toUpperCase();
  return (
    <div className={`${sizeClass} rounded-full bg-[#E9F0F2] flex items-center justify-center text-xs font-medium text-[#3A5A6B] shrink-0`}>
      {initials}
    </div>
  );
}

function loadImage(src, crossOrigin) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Flat-top hexagon centered at (x, y) with "radius" r (center-to-vertex).
function hexagonPath(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 90);
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// Badge layout: white header w/ logo mark → accent name band with a hexagon
// photo overlapping it → white position strip → accent QR block with an ID
// pill → white footer with the department/scan hint. Matches the reference
// hex-photo badge instead of the earlier round-photo lanyard card.
async function generateIdCardDataUrl(staff, qrDataUrl) {
  const canvas = document.createElement('canvas');
  const W = 320, H = 560;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const cx = W / 2;

  const ACCENT = '#2C4854';       // deep teal — matches the rest of the app
  const ACCENT_LIGHT = '#E9F0F2';

  roundRectPath(ctx, 0, 0, W, H, 22);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.save();
  roundRectPath(ctx, 0, 0, W, H, 22);
  ctx.clip();

  // Section layout
  const headerH = 54;
  const nameBandY = headerH, nameBandH = 108;
  const positionBandY = nameBandY + nameBandH, positionBandH = 56;
  const qrSectionY = positionBandY + positionBandH, qrSectionH = 268;

  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, nameBandY, W, nameBandH);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, qrSectionY, W, qrSectionH);

  // Logo mark, top-left
  ctx.beginPath();
  ctx.arc(30, 27, 9, 0, Math.PI * 2);
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(30, 27, 3, 0, Math.PI * 2);
  ctx.fillStyle = ACCENT;
  ctx.fill();
  ctx.fillStyle = '#334155';
  ctx.font = '600 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('StaffSync', 46, 27);

  // Hexagon photo, right side, overlapping the name band
  const hexCx = W - 92;
  const hexCy = nameBandY + nameBandH / 2 - 6;
  const hexR = 58;
  const hexRInner = 50;

  hexagonPath(ctx, hexCx, hexCy, hexR);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  hexagonPath(ctx, hexCx, hexCy, hexR - 5);
  ctx.fillStyle = ACCENT_LIGHT;
  ctx.fill();

  try {
    if (!staff.photo_url) throw new Error('no photo');
    const img = await loadImage(`${API_ORIGIN}${staff.photo_url}`, 'anonymous');
    ctx.save();
    hexagonPath(ctx, hexCx, hexCy, hexRInner);
    ctx.clip();
    ctx.drawImage(img, hexCx - hexRInner, hexCy - hexRInner, hexRInner * 2, hexRInner * 2);
    ctx.restore();
  } catch {
    hexagonPath(ctx, hexCx, hexCy, hexRInner);
    ctx.fillStyle = ACCENT_LIGHT;
    ctx.fill();
    ctx.fillStyle = ACCENT;
    ctx.font = '600 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initials = staff.full_name.split(' ').map((p) => p[0]).join('').toUpperCase();
    ctx.fillText(initials, hexCx, hexCy + 2);
  }

  // Name / surname — left-aligned in the accent band, next to the hexagon
  const [firstName, ...restName] = staff.full_name.split(' ');
  const surname = restName.join(' ');
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px sans-serif';
  ctx.fillText(firstName.toUpperCase(), 26, nameBandY + nameBandH / 2 + 2);
  if (surname) {
    ctx.fillText(surname.toUpperCase(), 26, nameBandY + nameBandH / 2 + 26);
  }

  // Position strip
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';
  ctx.font = '600 12px sans-serif';
  ctx.save();
  ctx.letterSpacing = '1.5px';
  ctx.fillText((staff.position || '').toUpperCase(), cx, positionBandY + positionBandH / 2 + 4);
  ctx.restore();

  // QR box
  const qrBoxSize = 168;
  const qrBoxX = cx - qrBoxSize / 2;
  const qrBoxY = qrSectionY + 24;
  roundRectPath(ctx, qrBoxX - 10, qrBoxY - 10, qrBoxSize + 20, qrBoxSize + 20, 14);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

  // ID pill
  const idText = `ID: ${staff.employee_code || ''}`;
  ctx.font = '600 13px sans-serif';
  const idPillW = ctx.measureText(idText).width + 36;
  const idPillY = qrBoxY + qrBoxSize + 22;
  roundRectPath(ctx, cx - idPillW / 2, idPillY, idPillW, 30, 15);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = ACCENT;
  ctx.textBaseline = 'middle';
  ctx.fillText(idText, cx, idPillY + 15);

  // Footer — address / scan hint
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 10px sans-serif';
  ctx.textBaseline = 'alphabetic';
  const footerCenterY = qrSectionY + qrSectionH + (H - (qrSectionY + qrSectionH)) / 2;
  const footerLine = staff.department_name
    ? `${staff.department_name} · Scan to check in / out`
    : 'Scan to check in / out';
  ctx.fillText(footerLine, cx, footerCenterY + 4);

  ctx.restore();
  return canvas.toDataURL('image/png');
}

function StaffDetailModal({ staff, departments, onClose, onSaved }) {
  const [departmentId, setDepartmentId] = useState(staff.department_id || '');
  const [position, setPosition] = useState(staff.position || '');
  const [status, setStatus] = useState(staff.status || 'active');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await api.put(`/staff/${staff.id}`, { departmentId, position, status });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl border border-[#E7E5E0] shadow-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-lg tracking-tight">Staff details</p>
          <button onClick={onClose} className="text-[#B5B2A8] hover:text-[#1C1E22] hover:bg-[#F0EEE8] rounded-full p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <StaffAvatar photoUrl={staff.photo_url} name={staff.full_name} size={12} />
          <div>
            <p className="font-medium">{staff.full_name}</p>
            <p className="text-xs font-mono text-[#8A8D93]">{staff.employee_code}</p>
          </div>
        </div>

        <div className="text-sm text-[#6B6F76] mb-5 space-y-0.5 bg-[#F7F6F2] rounded-lg px-3 py-2.5">
          <p>{staff.email}</p>
          <p>{staff.phone}</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-[#6B6F76] block mb-1">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[#6B6F76] block mb-1">Position</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
            />
          </div>

          <div>
            <label className="text-sm text-[#6B6F76] block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-[#E7E5E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-[#B8451A] mt-3">{error}</p>}

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-[#E7E5E0] rounded-lg py-2.5 text-sm font-medium text-[#6B6F76] hover:bg-[#F7F6F2] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#1C1E22] hover:bg-[#33363C] text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function QrCardModal({ staff, qrDataUrl, onClose }) {
  const [cardDataUrl, setCardDataUrl] = useState(null);
  const [generating, setGenerating] = useState(true);
  const [genError, setGenError] = useState('');

  useEffect(() => {
    generateIdCardDataUrl(staff, qrDataUrl)
      .then(setCardDataUrl)
      .catch(() => setGenError('Could not render the photo onto the card — showing QR only.'))
      .finally(() => setGenerating(false));
  }, [staff, qrDataUrl]);

  function handleDownload() {
    const a = document.createElement('a');
    a.href = cardDataUrl || qrDataUrl;
    a.download = `${staff.employee_code}-id-card.png`;
    a.click();
  }

  function handlePrint() {
    const win = window.open('', '_blank', 'width=400,height=680');
    win.document.write(`
      <html>
        <head><title>${staff.full_name} — ID Card</title></head>
        <body style="margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f1f5f9;">
          <img src="${cardDataUrl || qrDataUrl}" style="width: 300px;" />
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    win.document.close();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#1C1E22] rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {generating ? (
          <div style={{ aspectRatio: '320 / 560' }} className="rounded-xl bg-white/5 flex items-center justify-center text-sm text-[#8A8D93] mb-4">
            Rendering card…
          </div>
        ) : (
          <img src={cardDataUrl || qrDataUrl} alt="ID card" className="w-full rounded-xl mb-4 shadow" />
        )}

        {genError && <p className="text-xs text-[#E0A85C] mb-3">{genError}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={generating}
            className="flex-1 flex items-center justify-center gap-1.5 border border-white/10 rounded-lg py-2.5 text-sm font-medium bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            <Download size={14} /> Download
          </button>
          <button
            onClick={handlePrint}
            disabled={generating}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white text-[#1C1E22] rounded-lg py-2.5 text-sm font-medium hover:bg-[#F0EEE8] disabled:opacity-50 transition-colors"
          >
            <Printer size={14} /> Print
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-sm text-[#8A8D93] hover:text-white underline underline-offset-2 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [qrModal, setQrModal] = useState(null);
  const [detailStaff, setDetailStaff] = useState(null);

  async function load() {
    const { data } = await api.get('/staff', { params: { status: 'active', search } });
    setStaff(data);
  }

  useEffect(() => { load(); }, [search]);
  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data));
  }, []);

  async function deactivate(id) {
    if (!confirm('Deactivate this staff member? Their attendance history is kept.')) return;
    await api.delete(`/staff/${id}`);
    load();
  }

  return (
    <div className="bg-[#FAFAF7] min-h-full font-sans text-[#1C1E22]">
      <p className="text-2xl font-bold tracking-tight mb-1 fade-in-up">Staff Management</p>
      <p className="text-sm text-[#8A8D93] mb-5 fade-in-up">{staff.length} staff across your departments</p>

      <div className="relative w-full max-w-md mb-5 fade-in-up">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B5B2A8]" />
        <input
          type="text"
          placeholder="Search staff by name, ID, or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[#E7E5E0] bg-white rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-[#B5B2A8] focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
        />
      </div>

      <div className="border border-[#E7E5E0] rounded-2xl overflow-hidden bg-white fade-in-up">
        <table className="w-full text-sm">
          <thead className="bg-[#F7F6F2] text-[#8A8D93] text-[11px] font-mono uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Staff</th>
              <th className="text-left px-4 py-3 font-medium">Department</th>
              <th className="text-left px-4 py-3 font-medium">Position</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t border-[#F1EFE9] hover:bg-[#FAFAF7] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <StaffAvatar photoUrl={s.photo_url} name={s.full_name} />
                    <div>
                      <p className="font-medium">{s.full_name}</p>
                      <p className="text-xs font-mono text-[#8A8D93]">{s.employee_code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6B6F76]">{s.department_name || '—'}</td>
                <td className="px-4 py-3 text-[#6B6F76]">{s.position}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#E9F0F2] text-[#2C4854] font-medium">Active</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-[#B5B2A8]">
                    <button onClick={() => setDetailStaff(s)} className="hover:text-[#1C1E22] transition-colors" title="View / edit details">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={async () => {
                        const { data } = await api.get(`/staff/${s.id}/qr`);
                        setQrModal({ staff: s, qrDataUrl: data.qrDataUrl });
                      }}
                      className="hover:text-[#3A5A6B] transition-colors"
                      title="View QR card"
                    >
                      <QrCode size={15} />
                    </button>
                    <button onClick={() => deactivate(s.id)} className="hover:text-[#B8451A] transition-colors" title="Deactivate">
                      <UserX size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#B5B2A8] text-sm">No staff found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailStaff && (
        <StaffDetailModal
          staff={detailStaff}
          departments={departments}
          onClose={() => setDetailStaff(null)}
          onSaved={load}
        />
      )}

      {qrModal && (
        <QrCardModal staff={qrModal.staff} qrDataUrl={qrModal.qrDataUrl} onClose={() => setQrModal(null)} />
      )}
    </div>
  );
}
