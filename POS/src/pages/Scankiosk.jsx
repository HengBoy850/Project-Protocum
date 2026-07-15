
// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { CheckCircle2, LogOut, AlertCircle, QrCode, Camera, Check, ChevronDown } from 'lucide-react';
// import api from '../api/client';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const SCANNER_ELEMENT_ID = 'qr-reader';
// const RESULT_DISPLAY_MS = 2500;
// const REMEMBERED_CAMERA_KEY = 'kiosk_camera_id';

// function playBeep() {
//   try {
//     const ctx = new (window.AudioContext || window.webkitAudioContext)();
//     const now = ctx.currentTime;
//     [880, 1175].forEach((freq, i) => {
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.frequency.value = freq;
//       osc.type = 'sine';
//       gain.gain.setValueAtTime(0.15, now + i * 0.12);
//       gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
//       osc.connect(gain).connect(ctx.destination);
//       osc.start(now + i * 0.12);
//       osc.stop(now + i * 0.12 + 0.15);
//     });
//   } catch {}
// }

// // Custom camera picker — pill button + dropdown with a checkmark on the active
// // camera, styled to match the dark kiosk theme instead of a plain <select>.
// function CameraPicker({ cameras, activeCameraId, onChange }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const active = cameras.find((c) => c.id === activeCameraId);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   if (cameras.length <= 1) return null;

//   return (
//     <div className="relative inline-block" ref={ref}>
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs rounded-full px-3 py-1.5 hover:bg-slate-800"
//       >
//         <Camera size={13} />
//         <span className="max-w-[160px] truncate">{active?.label || 'Select camera'}</span>
//         <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>

//       {open && (
//         <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-10">
//           {cameras.map((cam) => (
//             <button
//               key={cam.id}
//               onClick={() => {
//                 onChange(cam.id);
//                 setOpen(false);
//               }}
//               className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700"
//             >
//               <span className="w-4 shrink-0">
//                 {cam.id === activeCameraId && <Check size={13} className="text-sky-400" />}
//               </span>
//               <span className="truncate">{cam.label || cam.id}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ScanKiosk() {
//   const [result, setResult] = useState(null);
//   const [clockText, setClockText] = useState('');
//   const [cameras, setCameras] = useState([]);
//   const [activeCameraId, setActiveCameraId] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const scannerRef = useRef(null);
//   const busyRef = useRef(false);

//   useEffect(() => {
//     const tick = () => setClockText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
//     tick();
//     const clockInterval = setInterval(tick, 1000 * 15);
//     return () => clearInterval(clockInterval);
//   }, []);

//   useEffect(() => {
//     Html5Qrcode.getCameras()
//       .then((devices) => {
//         setCameras(devices);
//         const remembered = localStorage.getItem(REMEMBERED_CAMERA_KEY);
//         const stillExists = devices.find((d) => d.id === remembered);
//         if (stillExists) {
//           setActiveCameraId(remembered);
//           return;
//         }
//         const realCamera = devices.find((d) => !/nvidia|obs|virtual/i.test(d.label));
//         setActiveCameraId((realCamera || devices[0])?.id || null);
//       })
//       .catch((err) => setCameraError(err?.message || 'Could not list cameras'));
//   }, []);

//   useEffect(() => {
//     if (!activeCameraId) return;

//     const container = document.getElementById(SCANNER_ELEMENT_ID);
//     if (container) container.innerHTML = '';

//     const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
//     scannerRef.current = scanner;

//     scanner
//       .start(
//         activeCameraId,
//         { fps: 10, qrbox: { width: 240, height: 240 } },
//         handleScanSuccess,
//         () => {}
//       )
//       .then(() => setScanning(true))
//       .catch((err) => setCameraError(err?.message || String(err)));

//     return () => {
//       scanner.stop().catch(() => {});
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeCameraId]);

//   function handleCameraChange(id) {
//     localStorage.setItem(REMEMBERED_CAMERA_KEY, id);
//     setScanning(false);
//     setActiveCameraId(id);
//   }

//   async function handleScanSuccess(decodedText) {
//     if (busyRef.current) return;
//     busyRef.current = true;

//     try {
//       const { data } = await api.post('/attendance/scan', {
//         qrToken: decodedText,
//         deviceLabel: 'Front Door Kiosk',
//       });

//       if (data.duplicate) {
//         setResult({ kind: 'duplicate', name: data.staff?.name, photoUrl: data.staff?.photoUrl });
//       } else {
//         playBeep();
//         setResult({
//           kind: 'success',
//           type: data.type,
//           name: data.staff?.name,
//           photoUrl: data.staff?.photoUrl,
//           time: new Date(data.scannedAt),
//         });
//       }
//     } catch (err) {
//       setResult({ kind: 'error', message: err.response?.data?.error || 'Scan failed — try again' });
//     }

//     setTimeout(() => {
//       setResult(null);
//       busyRef.current = false;
//     }, RESULT_DISPLAY_MS);
//   }

//   const activeCameraLabel = cameras.find((c) => c.id === activeCameraId)?.label;
//   const statusLine = cameraError
//     ? 'Camera unavailable'
//     : !scanning
//     ? 'Starting camera…'
//     : result
//     ? '\u00A0'
//     : `Waiting for scan${activeCameraLabel ? ` · ${activeCameraLabel}` : '…'}`;

//   return (
//     <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 text-white">
//       <div className="w-full max-w-sm">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
//               <QrCode size={16} />
//             </div>
//             <p className="font-semibold">StaffSync Check-in</p>
//           </div>
//           <p className="text-sm text-slate-400">{clockText}</p>
//         </div>

//         <p className="text-center font-medium mb-1">Scan QR Code</p>
//         <p className="text-center text-sm text-slate-400 mb-4">Position the QR code within the frame</p>

//         <div className="relative aspect-square rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl ring-1 ring-white/5">
//           <div
//             id={SCANNER_ELEMENT_ID}
//             className="w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:object-cover"
//           />

//           {/* Vignette — darkens everything outside the scan square */}
//           {scanning && !result && (
//             <div
//               className="absolute inset-0 pointer-events-none"
//               style={{
//                 boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.45)',
//                 WebkitMaskImage:
//                   'radial-gradient(circle at center, transparent 128px, black 129px)',
//               }}
//             />
//           )}

//           {/* Corner brackets, glowing cyan */}
//           {scanning && !result && (
//             <>
//               <div className="absolute top-10 left-10 w-10 h-10 border-l-4 border-t-4 border-cyan-400 rounded-tl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute top-10 right-10 w-10 h-10 border-r-4 border-t-4 border-cyan-400 rounded-tr-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 left-10 w-10 h-10 border-l-4 border-b-4 border-cyan-400 rounded-bl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 right-10 w-10 h-10 border-r-4 border-b-4 border-cyan-400 rounded-br-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute left-16 right-16 h-0.5 bg-cyan-400/90 shadow-[0_0_10px_3px_rgba(34,211,238,0.7)] animate-[scanline_2.2s_ease-in-out_infinite]" />
//             </>
//           )}

//           {!scanning && !cameraError && (
//             <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
//               Starting camera…
//             </div>
//           )}

//           {cameraError && (
//             <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3 px-6 text-center">
//               <AlertCircle size={40} className="text-red-400" />
//               <p className="font-medium">Camera problem</p>
//               <p className="text-xs text-slate-400 break-words">{cameraError}</p>
//             </div>
//           )}

//           {result && (
//             <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center gap-3 px-6 text-center animate-[fadeIn_0.2s_ease-out]">
//               {result.kind === 'error' ? (
//                 <>
//                   <AlertCircle size={40} className="text-red-400" />
//                   <p className="font-medium">{result.message}</p>
//                 </>
//               ) : (
//                 <>
//                   {result.photoUrl ? (
//                     <img
//                       src={`${API_ORIGIN}${result.photoUrl}`}
//                       alt={result.name}
//                       className="w-20 h-20 rounded-full object-cover ring-4 ring-white/10"
//                     />
//                   ) : (
//                     <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl font-semibold">
//                       {result.name?.[0] || '?'}
//                     </div>
//                   )}
//                   <p className="font-semibold text-lg">{result.name}</p>

//                   {result.kind === 'duplicate' ? (
//                     <p className="text-sm text-amber-300">Already recorded — scanned twice</p>
//                   ) : (
//                     <div className={`flex items-center gap-1.5 text-sm font-medium ${result.type === 'check_in' ? 'text-sky-300' : 'text-slate-300'}`}>
//                       {result.type === 'check_in' ? <CheckCircle2 size={16} /> : <LogOut size={16} />}
//                       {result.type === 'check_in' ? 'Checked in' : 'Checked out'}
//                       {' · '}
//                       {result.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col items-center gap-3 mt-4">
//           <CameraPicker cameras={cameras} activeCameraId={activeCameraId} onChange={handleCameraChange} />
//           <p className="text-xs text-slate-500">{statusLine}</p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes scanline {
//           0%, 100% { top: 20%; opacity: 0; }
//           10% { opacity: 1; }
//           50% { top: 80%; opacity: 1; }
//           90% { opacity: 1; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.97); }
//           to { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// }


// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { CheckCircle2, LogOut, AlertCircle, QrCode, Camera, Check, ChevronDown } from 'lucide-react';
// import api from '../api/client';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const SCANNER_ELEMENT_ID = 'qr-reader';
// const RESULT_DISPLAY_MS = 2500;
// const REMEMBERED_CAMERA_KEY = 'kiosk_camera_id';
// // Virtual / software cameras that should never be auto-selected or remembered
// // for QR scanning — they apply processing (blur, auto-framing, background
// // replacement) that hurts decode reliability.
// const VIRTUAL_CAMERA_REGEX = /nvidia|obs|virtual|snap camera|droidcam|manycam/i;

// function playBeep() {
//   try {
//     const ctx = new (window.AudioContext || window.webkitAudioContext)();
//     const now = ctx.currentTime;
//     [880, 1175].forEach((freq, i) => {
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.frequency.value = freq;
//       osc.type = 'sine';
//       gain.gain.setValueAtTime(0.15, now + i * 0.12);
//       gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
//       osc.connect(gain).connect(ctx.destination);
//       osc.start(now + i * 0.12);
//       osc.stop(now + i * 0.12 + 0.15);
//     });
//   } catch {}
// }

// // Custom camera picker — pill button + dropdown with a checkmark on the active
// // camera, styled to match the dark kiosk theme instead of a plain <select>.
// function CameraPicker({ cameras, activeCameraId, onChange }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const active = cameras.find((c) => c.id === activeCameraId);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   if (cameras.length <= 1) return null;

//   return (
//     <div className="relative inline-block" ref={ref}>
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs rounded-full px-3 py-1.5 hover:bg-slate-800"
//       >
//         <Camera size={13} />
//         <span className="max-w-[160px] truncate">{active?.label || 'Select camera'}</span>
//         <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>

//       {open && (
//         <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-10">
//           {cameras.map((cam) => (
//             <button
//               key={cam.id}
//               onClick={() => {
//                 onChange(cam.id);
//                 setOpen(false);
//               }}
//               className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700"
//             >
//               <span className="w-4 shrink-0">
//                 {cam.id === activeCameraId && <Check size={13} className="text-sky-400" />}
//               </span>
//               <span className="truncate">{cam.label || cam.id}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ScanKiosk() {
//   const [result, setResult] = useState(null);
//   const [clockText, setClockText] = useState('');
//   const [cameras, setCameras] = useState([]);
//   const [activeCameraId, setActiveCameraId] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const scannerRef = useRef(null);
//   const busyRef = useRef(false);

//   useEffect(() => {
//     const tick = () => setClockText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
//     tick();
//     const clockInterval = setInterval(tick, 1000 * 15);
//     return () => clearInterval(clockInterval);
//   }, []);

//   useEffect(() => {
//     Html5Qrcode.getCameras()
//       .then((devices) => {
//         setCameras(devices);

//         // Prefer real hardware cameras over virtual ones (NVIDIA Broadcast,
//         // OBS Virtual Cam, etc). If only virtual cameras are available, fall
//         // back to the full list rather than showing no camera at all.
//         const realDevices = devices.filter((d) => !VIRTUAL_CAMERA_REGEX.test(d.label));
//         const pickFrom = realDevices.length > 0 ? realDevices : devices;

//         const remembered = localStorage.getItem(REMEMBERED_CAMERA_KEY);
//         const rememberedIsUsable = pickFrom.find((d) => d.id === remembered);

//         if (rememberedIsUsable) {
//           setActiveCameraId(remembered);
//           return;
//         }

//         setActiveCameraId(pickFrom[0]?.id || null);
//       })
//       .catch((err) => setCameraError(err?.message || 'Could not list cameras'));
//   }, []);

//   useEffect(() => {
//     if (!activeCameraId) return;

//     const container = document.getElementById(SCANNER_ELEMENT_ID);
//     if (container) container.innerHTML = '';

//     const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
//     scannerRef.current = scanner;

//     scanner
//       .start(
//         activeCameraId,
//         { fps: 10, qrbox: { width: 240, height: 240 } },
//         handleScanSuccess,
//         (err) => {
//           // Fires continuously while no QR code is detected in a frame — this
//           // is normal. Left as a no-op console.debug (instead of a totally
//           // silent no-op) so scan issues are visible in devtools without
//           // spamming the UI. Safe to remove entirely once things are stable.
//           // console.debug('scan miss:', err);
//         }
//       )
//       .then(() => setScanning(true))
//       .catch((err) => setCameraError(err?.message || String(err)));

//     return () => {
//       scanner.stop().catch(() => {});
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeCameraId]);

//   function handleCameraChange(id) {
//     localStorage.setItem(REMEMBERED_CAMERA_KEY, id);
//     setScanning(false);
//     setActiveCameraId(id);
//   }

//   async function handleScanSuccess(decodedText) {
//     if (busyRef.current) return;
//     busyRef.current = true;

//     try {
//       const { data } = await api.post('/attendance/scan', {
//         qrToken: decodedText,
//         deviceLabel: 'Front Door Kiosk',
//       });

//       if (data.duplicate) {
//         setResult({ kind: 'duplicate', name: data.staff?.name, photoUrl: data.staff?.photoUrl });
//       } else {
//         playBeep();
//         setResult({
//           kind: 'success',
//           type: data.type,
//           name: data.staff?.name,
//           photoUrl: data.staff?.photoUrl,
//           time: new Date(data.scannedAt),
//         });
//       }
//     } catch (err) {
//       setResult({ kind: 'error', message: err.response?.data?.error || 'Scan failed — try again' });
//     }

//     setTimeout(() => {
//       setResult(null);
//       busyRef.current = false;
//     }, RESULT_DISPLAY_MS);
//   }

//   const activeCameraLabel = cameras.find((c) => c.id === activeCameraId)?.label;
//   const statusLine = cameraError
//     ? 'Camera unavailable'
//     : !scanning
//     ? 'Starting camera…'
//     : result
//     ? '\u00A0'
//     : `Waiting for scan${activeCameraLabel ? ` · ${activeCameraLabel}` : '…'}`;

//   return (
//     <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 text-white">
//       <div className="w-full max-w-sm">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
//               <QrCode size={16} />
//             </div>
//             <p className="font-semibold">StaffSync Check-in</p>
//           </div>
//           <p className="text-sm text-slate-400">{clockText}</p>
//         </div>

//         <p className="text-center font-medium mb-1">Scan QR Code</p>
//         <p className="text-center text-sm text-slate-400 mb-4">Position the QR code within the frame</p>

//         <div className="relative aspect-square rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl ring-1 ring-white/5">
//           <div
//             id={SCANNER_ELEMENT_ID}
//             className="w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:object-cover"
//           />

//           {/* Vignette — darkens everything outside the scan square */}
//           {scanning && !result && (
//             <div
//               className="absolute inset-0 pointer-events-none"
//               style={{
//                 boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.45)',
//                 WebkitMaskImage:
//                   'radial-gradient(circle at center, transparent 128px, black 129px)',
//               }}
//             />
//           )}

//           {/* Corner brackets, glowing cyan */}
//           {scanning && !result && (
//             <>
//               <div className="absolute top-10 left-10 w-10 h-10 border-l-4 border-t-4 border-cyan-400 rounded-tl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute top-10 right-10 w-10 h-10 border-r-4 border-t-4 border-cyan-400 rounded-tr-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 left-10 w-10 h-10 border-l-4 border-b-4 border-cyan-400 rounded-bl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 right-10 w-10 h-10 border-r-4 border-b-4 border-cyan-400 rounded-br-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute left-16 right-16 h-0.5 bg-cyan-400/90 shadow-[0_0_10px_3px_rgba(34,211,238,0.7)] animate-[scanline_2.2s_ease-in-out_infinite]" />
//             </>
//           )}

//           {!scanning && !cameraError && (
//             <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
//               Starting camera…
//             </div>
//           )}

//           {cameraError && (
//             <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3 px-6 text-center">
//               <AlertCircle size={40} className="text-red-400" />
//               <p className="font-medium">Camera problem</p>
//               <p className="text-xs text-slate-400 break-words">{cameraError}</p>
//             </div>
//           )}

//           {result && (
//             <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center gap-3 px-6 text-center animate-[fadeIn_0.2s_ease-out]">
//               {result.kind === 'error' ? (
//                 <>
//                   <AlertCircle size={40} className="text-red-400" />
//                   <p className="font-medium">{result.message}</p>
//                 </>
//               ) : (
//                 <>
//                   {result.photoUrl ? (
//                     <img
//                       src={`${API_ORIGIN}${result.photoUrl}`}
//                       alt={result.name}
//                       className="w-20 h-20 rounded-full object-cover ring-4 ring-white/10"
//                     />
//                   ) : (
//                     <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl font-semibold">
//                       {result.name?.[0] || '?'}
//                     </div>
//                   )}
//                   <p className="font-semibold text-lg">{result.name}</p>

//                   {result.kind === 'duplicate' ? (
//                     <p className="text-sm text-amber-300">Already recorded — scanned twice</p>
//                   ) : (
//                     <div className={`flex items-center gap-1.5 text-sm font-medium ${result.type === 'check_in' ? 'text-sky-300' : 'text-slate-300'}`}>
//                       {result.type === 'check_in' ? <CheckCircle2 size={16} /> : <LogOut size={16} />}
//                       {result.type === 'check_in' ? 'Checked in' : 'Checked out'}
//                       {' · '}
//                       {result.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col items-center gap-3 mt-4">
//           <CameraPicker
//             cameras={cameras.filter((c) => !VIRTUAL_CAMERA_REGEX.test(c.label))}
//             activeCameraId={activeCameraId}
//             onChange={handleCameraChange}
//           />
//           <p className="text-xs text-slate-500">{statusLine}</p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes scanline {
//           0%, 100% { top: 20%; opacity: 0; }
//           10% { opacity: 1; }
//           50% { top: 80%; opacity: 1; }
//           90% { opacity: 1; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.97); }
//           to { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// }


// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { CheckCircle2, LogOut, AlertCircle, QrCode, Camera, Check, ChevronDown } from 'lucide-react';
// import api from '../api/client';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const SCANNER_ELEMENT_ID = 'qr-reader';
// const RESULT_DISPLAY_MS = 2500;
// const REMEMBERED_CAMERA_KEY = 'kiosk_camera_id';
// // Virtual / software cameras that should never be auto-selected or remembered
// // for QR scanning — they apply processing (blur, auto-framing, background
// // replacement) that hurts decode reliability.
// const VIRTUAL_CAMERA_REGEX = /nvidia|obs|virtual|snap camera|droidcam|manycam/i;

// function playBeep() {
//   try {
//     const ctx = new (window.AudioContext || window.webkitAudioContext)();
//     const now = ctx.currentTime;
//     [880, 1175].forEach((freq, i) => {
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.frequency.value = freq;
//       osc.type = 'sine';
//       gain.gain.setValueAtTime(0.15, now + i * 0.12);
//       gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
//       osc.connect(gain).connect(ctx.destination);
//       osc.start(now + i * 0.12);
//       osc.stop(now + i * 0.12 + 0.15);
//     });
//   } catch {}
// }

// // Custom camera picker — pill button + dropdown with a checkmark on the active
// // camera, styled to match the dark kiosk theme instead of a plain <select>.
// function CameraPicker({ cameras, activeCameraId, onChange }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const active = cameras.find((c) => c.id === activeCameraId);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   if (cameras.length <= 1) return null;

//   return (
//     <div className="relative inline-block" ref={ref}>
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs rounded-full px-3 py-1.5 hover:bg-slate-800"
//       >
//         <Camera size={13} />
//         <span className="max-w-[160px] truncate">{active?.label || 'Select camera'}</span>
//         <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>

//       {open && (
//         <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-10">
//           {cameras.map((cam) => (
//             <button
//               key={cam.id}
//               onClick={() => {
//                 onChange(cam.id);
//                 setOpen(false);
//               }}
//               className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700"
//             >
//               <span className="w-4 shrink-0">
//                 {cam.id === activeCameraId && <Check size={13} className="text-sky-400" />}
//               </span>
//               <span className="truncate">{cam.label || cam.id}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ScanKiosk() {
//   const [result, setResult] = useState(null);
//   const [clockText, setClockText] = useState('');
//   const [cameras, setCameras] = useState([]);
//   const [activeCameraId, setActiveCameraId] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const scannerRef = useRef(null);
//   const busyRef = useRef(false);

//   useEffect(() => {
//     const tick = () => setClockText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
//     tick();
//     const clockInterval = setInterval(tick, 1000 * 15);
//     return () => clearInterval(clockInterval);
//   }, []);

//   useEffect(() => {
//     Html5Qrcode.getCameras()
//       .then((devices) => {
//         setCameras(devices);

//         // Prefer real hardware cameras over virtual ones (NVIDIA Broadcast,
//         // OBS Virtual Cam, etc). If only virtual cameras are available, fall
//         // back to the full list rather than showing no camera at all.
//         const realDevices = devices.filter((d) => !VIRTUAL_CAMERA_REGEX.test(d.label));
//         const pickFrom = realDevices.length > 0 ? realDevices : devices;

//         const remembered = localStorage.getItem(REMEMBERED_CAMERA_KEY);
//         const rememberedIsUsable = pickFrom.find((d) => d.id === remembered);

//         if (rememberedIsUsable) {
//           setActiveCameraId(remembered);
//           return;
//         }

//         setActiveCameraId(pickFrom[0]?.id || null);
//       })
//       .catch((err) => setCameraError(err?.message || 'Could not list cameras'));
//   }, []);

//   useEffect(() => {
//     if (!activeCameraId) return;

//     const container = document.getElementById(SCANNER_ELEMENT_ID);
//     if (container) container.innerHTML = '';

//     const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
//     scannerRef.current = scanner;

//     let cancelled = false;
//     const MAX_ATTEMPTS = 4;
//     const RETRY_DELAY_MS = 700;

//     // Some webcams (especially right after page load, or right after another
//     // app/driver was using them) throw a transient NotReadableError on the
//     // first getUserMedia call even though the device is fine. Retrying a
//     // couple of times with a short delay resolves it without the user having
//     // to manually switch cameras away and back.
//     function attemptStart(attempt) {
//       if (cancelled) return;

//       scanner
//         .start(
//           activeCameraId,
//           { fps: 10, qrbox: { width: 240, height: 240 } },
//           handleScanSuccess,
//           (err) => {
//             // Fires continuously while no QR code is detected in a frame —
//             // this is normal. Uncomment to debug scan misses:
//             // console.debug('scan miss:', err);
//           }
//         )
//         .then(() => {
//           if (!cancelled) {
//             setCameraError('');
//             setScanning(true);
//           }
//         })
//         .catch((err) => {
//           if (cancelled) return;

//           const isTransient = /NotReadableError|Could not start video source/i.test(
//             err?.message || String(err)
//           );

//           if (isTransient && attempt < MAX_ATTEMPTS) {
//             setTimeout(() => attemptStart(attempt + 1), RETRY_DELAY_MS);
//           } else {
//             setCameraError(err?.message || String(err));
//           }
//         });
//     }

//     attemptStart(1);

//     return () => {
//       cancelled = true;
//       scanner.stop().catch(() => {});
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeCameraId]);

//   function handleCameraChange(id) {
//     localStorage.setItem(REMEMBERED_CAMERA_KEY, id);
//     setScanning(false);
//     setActiveCameraId(id);
//   }

//   async function handleScanSuccess(decodedText) {
//     if (busyRef.current) return;
//     busyRef.current = true;

//     try {
//       const { data } = await api.post('/attendance/scan', {
//         qrToken: decodedText,
//         deviceLabel: 'Front Door Kiosk',
//       });

//       if (data.duplicate) {
//         setResult({ kind: 'duplicate', name: data.staff?.name, photoUrl: data.staff?.photoUrl });
//       } else {
//         playBeep();
//         setResult({
//           kind: 'success',
//           type: data.type,
//           name: data.staff?.name,
//           photoUrl: data.staff?.photoUrl,
//           time: new Date(data.scannedAt),
//         });
//       }
//     } catch (err) {
//       setResult({ kind: 'error', message: err.response?.data?.error || 'Scan failed — try again' });
//     }

//     setTimeout(() => {
//       setResult(null);
//       busyRef.current = false;
//     }, RESULT_DISPLAY_MS);
//   }

//   const activeCameraLabel = cameras.find((c) => c.id === activeCameraId)?.label;
//   const statusLine = cameraError
//     ? 'Camera unavailable'
//     : !scanning
//     ? 'Connecting to camera…'
//     : result
//     ? '\u00A0'
//     : `Waiting for scan${activeCameraLabel ? ` · ${activeCameraLabel}` : '…'}`;

//   return (
//     <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 text-white">
//       <div className="w-full max-w-sm">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
//               <QrCode size={16} />
//             </div>
//             <p className="font-semibold">StaffSync Check-in</p>
//           </div>
//           <p className="text-sm text-slate-400">{clockText}</p>
//         </div>

//         <p className="text-center font-medium mb-1">Scan QR Code</p>
//         <p className="text-center text-sm text-slate-400 mb-4">Position the QR code within the frame</p>

//         <div className="relative aspect-square rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl ring-1 ring-white/5">
//           <div
//             id={SCANNER_ELEMENT_ID}
//             className="w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:object-cover"
//           />

//           {/* Vignette — darkens everything outside the scan square */}
//           {scanning && !result && (
//             <div
//               className="absolute inset-0 pointer-events-none"
//               style={{
//                 boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.45)',
//                 WebkitMaskImage:
//                   'radial-gradient(circle at center, transparent 128px, black 129px)',
//               }}
//             />
//           )}

//           {/* Corner brackets, glowing cyan */}
//           {scanning && !result && (
//             <>
//               <div className="absolute top-10 left-10 w-10 h-10 border-l-4 border-t-4 border-cyan-400 rounded-tl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute top-10 right-10 w-10 h-10 border-r-4 border-t-4 border-cyan-400 rounded-tr-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 left-10 w-10 h-10 border-l-4 border-b-4 border-cyan-400 rounded-bl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 right-10 w-10 h-10 border-r-4 border-b-4 border-cyan-400 rounded-br-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute left-16 right-16 h-0.5 bg-cyan-400/90 shadow-[0_0_10px_3px_rgba(34,211,238,0.7)] animate-[scanline_2.2s_ease-in-out_infinite]" />
//             </>
//           )}

//           {!scanning && !cameraError && (
//             <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
//               Starting camera…
//             </div>
//           )}

//           {cameraError && (
//             <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3 px-6 text-center">
//               <AlertCircle size={40} className="text-red-400" />
//               <p className="font-medium">Camera problem</p>
//               <p className="text-xs text-slate-400 break-words">{cameraError}</p>
//             </div>
//           )}

//           {result && (
//             <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center gap-3 px-6 text-center animate-[fadeIn_0.2s_ease-out]">
//               {result.kind === 'error' ? (
//                 <>
//                   <AlertCircle size={40} className="text-red-400" />
//                   <p className="font-medium">{result.message}</p>
//                 </>
//               ) : (
//                 <>
//                   {result.photoUrl ? (
//                     <img
//                       src={`${API_ORIGIN}${result.photoUrl}`}
//                       alt={result.name}
//                       className="w-20 h-20 rounded-full object-cover ring-4 ring-white/10"
//                     />
//                   ) : (
//                     <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl font-semibold">
//                       {result.name?.[0] || '?'}
//                     </div>
//                   )}
//                   <p className="font-semibold text-lg">{result.name}</p>

//                   {result.kind === 'duplicate' ? (
//                     <p className="text-sm text-amber-300">Already recorded — scanned twice</p>
//                   ) : (
//                     <div className={`flex items-center gap-1.5 text-sm font-medium ${result.type === 'check_in' ? 'text-sky-300' : 'text-slate-300'}`}>
//                       {result.type === 'check_in' ? <CheckCircle2 size={16} /> : <LogOut size={16} />}
//                       {result.type === 'check_in' ? 'Checked in' : 'Checked out'}
//                       {' · '}
//                       {result.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col items-center gap-3 mt-4">
//           <CameraPicker
//             cameras={cameras.filter((c) => !VIRTUAL_CAMERA_REGEX.test(c.label))}
//             activeCameraId={activeCameraId}
//             onChange={handleCameraChange}
//           />
//           <p className="text-xs text-slate-500">{statusLine}</p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes scanline {
//           0%, 100% { top: 20%; opacity: 0; }
//           10% { opacity: 1; }
//           50% { top: 80%; opacity: 1; }
//           90% { opacity: 1; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.97); }
//           to { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// }


// import React, { useEffect, useRef, useState } from 'react';
// import { Html5Qrcode } from 'html5-qrcode';
// import { CheckCircle2, LogOut, AlertCircle, QrCode, Camera, Check, ChevronDown } from 'lucide-react';
// import api from '../api/client';

// const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const SCANNER_ELEMENT_ID = 'qr-reader';
// const RESULT_DISPLAY_MS = 2500;
// const REMEMBERED_CAMERA_KEY = 'kiosk_camera_id';
// // Virtual / software cameras that should never be auto-selected or remembered
// // for QR scanning — they apply processing (blur, auto-framing, background
// // replacement) that hurts decode reliability.
// const VIRTUAL_CAMERA_REGEX = /nvidia|obs|virtual|snap camera|droidcam|manycam/i;

// function playBeep() {
//   try {
//     const ctx = new (window.AudioContext || window.webkitAudioContext)();
//     const now = ctx.currentTime;
//     [880, 1175].forEach((freq, i) => {
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.frequency.value = freq;
//       osc.type = 'sine';
//       gain.gain.setValueAtTime(0.15, now + i * 0.12);
//       gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
//       osc.connect(gain).connect(ctx.destination);
//       osc.start(now + i * 0.12);
//       osc.stop(now + i * 0.12 + 0.15);
//     });
//   } catch {}
// }

// // Custom camera picker — pill button + dropdown with a checkmark on the active
// // camera, styled to match the dark kiosk theme instead of a plain <select>.
// function CameraPicker({ cameras, activeCameraId, onChange }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const active = cameras.find((c) => c.id === activeCameraId);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   if (cameras.length <= 1) return null;

//   return (
//     <div className="relative inline-block" ref={ref}>
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs rounded-full px-3 py-1.5 hover:bg-slate-800"
//       >
//         <Camera size={13} />
//         <span className="max-w-[160px] truncate">{active?.label || 'Select camera'}</span>
//         <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>

//       {open && (
//         <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-10">
//           {cameras.map((cam) => (
//             <button
//               key={cam.id}
//               onClick={() => {
//                 onChange(cam.id);
//                 setOpen(false);
//               }}
//               className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700"
//             >
//               <span className="w-4 shrink-0">
//                 {cam.id === activeCameraId && <Check size={13} className="text-sky-400" />}
//               </span>
//               <span className="truncate">{cam.label || cam.id}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ScanKiosk() {
//   const [result, setResult] = useState(null);
//   const [clockText, setClockText] = useState('');
//   const [cameras, setCameras] = useState([]);
//   const [activeCameraId, setActiveCameraId] = useState(null);
//   const [cameraError, setCameraError] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const scannerRef = useRef(null);
//   const busyRef = useRef(false);

//   useEffect(() => {
//     const tick = () => setClockText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
//     tick();
//     const clockInterval = setInterval(tick, 1000 * 15);
//     return () => clearInterval(clockInterval);
//   }, []);

//   useEffect(() => {
//     Html5Qrcode.getCameras()
//       .then((devices) => {
//         setCameras(devices);

//         // Prefer real hardware cameras over virtual ones (NVIDIA Broadcast,
//         // OBS Virtual Cam, etc). If only virtual cameras are available, fall
//         // back to the full list rather than showing no camera at all.
//         const realDevices = devices.filter((d) => !VIRTUAL_CAMERA_REGEX.test(d.label));
//         const pickFrom = realDevices.length > 0 ? realDevices : devices;

//         const remembered = localStorage.getItem(REMEMBERED_CAMERA_KEY);
//         const rememberedIsUsable = pickFrom.find((d) => d.id === remembered);

//         if (rememberedIsUsable) {
//           setActiveCameraId(remembered);
//           return;
//         }

//         setActiveCameraId(pickFrom[0]?.id || null);
//       })
//       .catch((err) => setCameraError(err?.message || 'Could not list cameras'));
//   }, []);

//   // Ensures we never call scanner.start() on a new camera before the
//   // previous scanner instance has FULLY finished stopping and releasing
//   // the hardware. Without this, a fast effect re-run (e.g. React 18
//   // StrictMode's intentional double-invoke in development, or quick camera
//   // switches) can leave an orphaned MediaStream holding the real webcam,
//   // causing NotReadableError until the user manually switches away and back.
//   const stopLockRef = useRef(Promise.resolve());

//   useEffect(() => {
//     if (!activeCameraId) return;

//     let cancelled = false;
//     const MAX_ATTEMPTS = 4;
//     const RETRY_DELAY_MS = 700;

//     function delay(ms) {
//       return new Promise((resolve) => setTimeout(resolve, ms));
//     }

//     async function attemptStart(attempt) {
//       if (cancelled) return;

//       const container = document.getElementById(SCANNER_ELEMENT_ID);
//       if (container) container.innerHTML = '';

//       const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
//       scannerRef.current = scanner;

//       try {
//         await scanner.start(
//           activeCameraId,
//           { fps: 10, qrbox: { width: 240, height: 240 } },
//           handleScanSuccess,
//           (err) => {
//             // Fires continuously while no QR code is detected in a frame —
//             // this is normal. Uncomment to debug scan misses:
//             // console.debug('scan miss:', err);
//           }
//         );
//         if (!cancelled) {
//           setCameraError('');
//           setScanning(true);
//         }
//       } catch (err) {
//         if (cancelled) return;

//         const isTransient = /NotReadableError|Could not start video source/i.test(
//           err?.message || String(err)
//         );

//         if (isTransient && attempt < MAX_ATTEMPTS) {
//           await delay(RETRY_DELAY_MS);
//           if (!cancelled) await attemptStart(attempt + 1);
//         } else {
//           setCameraError(err?.message || String(err));
//         }
//       }
//     }

//     // Chain onto the previous camera's stop — guarantees the old hardware
//     // handle is actually released before we ever try to open a new one.
//     stopLockRef.current = stopLockRef.current.then(() => {
//       if (cancelled) return;
//       return attemptStart(1);
//     });

//     return () => {
//       cancelled = true;
//       const scannerToStop = scannerRef.current;
//       stopLockRef.current = stopLockRef.current
//         .catch(() => {})
//         .then(() => (scannerToStop ? scannerToStop.stop().catch(() => {}) : undefined));
//     };
//   }, [activeCameraId]);

//   function handleCameraChange(id) {
//     localStorage.setItem(REMEMBERED_CAMERA_KEY, id);
//     setScanning(false);
//     setActiveCameraId(id);
//   }

//   async function handleScanSuccess(decodedText) {
//     if (busyRef.current) return;
//     busyRef.current = true;

//     try {
//       const { data } = await api.post('/attendance/scan', {
//         qrToken: decodedText,
//         deviceLabel: 'Front Door Kiosk',
//       });

//       if (data.duplicate) {
//         setResult({ kind: 'duplicate', name: data.staff?.name, photoUrl: data.staff?.photoUrl });
//       } else {
//         playBeep();
//         setResult({
//           kind: 'success',
//           type: data.type,
//           name: data.staff?.name,
//           photoUrl: data.staff?.photoUrl,
//           time: new Date(data.scannedAt),
//         });
//       }
//     } catch (err) {
//       setResult({ kind: 'error', message: err.response?.data?.error || 'Scan failed — try again' });
//     }

//     setTimeout(() => {
//       setResult(null);
//       busyRef.current = false;
//     }, RESULT_DISPLAY_MS);
//   }

//   const activeCameraLabel = cameras.find((c) => c.id === activeCameraId)?.label;
//   const statusLine = cameraError
//     ? 'Camera unavailable'
//     : !scanning
//     ? 'Connecting to camera…'
//     : result
//     ? '\u00A0'
//     : `Waiting for scan${activeCameraLabel ? ` · ${activeCameraLabel}` : '…'}`;

//   return (
//     <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 text-white">
//       <div className="w-full max-w-sm">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
//               <QrCode size={16} />
//             </div>
//             <p className="font-semibold">StaffSync Check-in</p>
//           </div>
//           <p className="text-sm text-slate-400">{clockText}</p>
//         </div>

//         <p className="text-center font-medium mb-1">Scan QR Code</p>
//         <p className="text-center text-sm text-slate-400 mb-4">Position the QR code within the frame</p>

//         <div className="relative aspect-square rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl ring-1 ring-white/5">
//           <div
//             id={SCANNER_ELEMENT_ID}
//             className="w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:object-cover"
//           />

//           {/* Vignette — darkens everything outside the scan square */}
//           {scanning && !result && (
//             <div
//               className="absolute inset-0 pointer-events-none"
//               style={{
//                 boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.45)',
//                 WebkitMaskImage:
//                   'radial-gradient(circle at center, transparent 128px, black 129px)',
//               }}
//             />
//           )}

//           {/* Corner brackets, glowing cyan */}
//           {scanning && !result && (
//             <>
//               <div className="absolute top-10 left-10 w-10 h-10 border-l-4 border-t-4 border-cyan-400 rounded-tl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute top-10 right-10 w-10 h-10 border-r-4 border-t-4 border-cyan-400 rounded-tr-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 left-10 w-10 h-10 border-l-4 border-b-4 border-cyan-400 rounded-bl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute bottom-10 right-10 w-10 h-10 border-r-4 border-b-4 border-cyan-400 rounded-br-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
//               <div className="absolute left-16 right-16 h-0.5 bg-cyan-400/90 shadow-[0_0_10px_3px_rgba(34,211,238,0.7)] animate-[scanline_2.2s_ease-in-out_infinite]" />
//             </>
//           )}

//           {!scanning && !cameraError && (
//             <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
//               Starting camera…
//             </div>
//           )}

//           {cameraError && (
//             <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3 px-6 text-center">
//               <AlertCircle size={40} className="text-red-400" />
//               <p className="font-medium">Camera problem</p>
//               <p className="text-xs text-slate-400 break-words">{cameraError}</p>
//             </div>
//           )}

//           {result && (
//             <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center gap-3 px-6 text-center animate-[fadeIn_0.2s_ease-out]">
//               {result.kind === 'error' ? (
//                 <>
//                   <AlertCircle size={40} className="text-red-400" />
//                   <p className="font-medium">{result.message}</p>
//                 </>
//               ) : (
//                 <>
//                   {result.photoUrl ? (
//                     <img
//                       src={`${API_ORIGIN}${result.photoUrl}`}
//                       alt={result.name}
//                       className="w-20 h-20 rounded-full object-cover ring-4 ring-white/10"
//                     />
//                   ) : (
//                     <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl font-semibold">
//                       {result.name?.[0] || '?'}
//                     </div>
//                   )}
//                   <p className="font-semibold text-lg">{result.name}</p>

//                   {result.kind === 'duplicate' ? (
//                     <p className="text-sm text-amber-300">Already recorded — scanned twice</p>
//                   ) : (
//                     <div className={`flex items-center gap-1.5 text-sm font-medium ${result.type === 'check_in' ? 'text-sky-300' : 'text-slate-300'}`}>
//                       {result.type === 'check_in' ? <CheckCircle2 size={16} /> : <LogOut size={16} />}
//                       {result.type === 'check_in' ? 'Checked in' : 'Checked out'}
//                       {' · '}
//                       {result.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col items-center gap-3 mt-4">
//           <CameraPicker
//             cameras={cameras.filter((c) => !VIRTUAL_CAMERA_REGEX.test(c.label))}
//             activeCameraId={activeCameraId}
//             onChange={handleCameraChange}
//           />
//           <p className="text-xs text-slate-500">{statusLine}</p>
//         </div>
//       </div>

//       <style>{`
//         @keyframes scanline {
//           0%, 100% { top: 20%; opacity: 0; }
//           10% { opacity: 1; }
//           50% { top: 80%; opacity: 1; }
//           90% { opacity: 1; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.97); }
//           to { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle2, LogOut, AlertCircle, QrCode, Camera, Check, ChevronDown } from 'lucide-react';
import api from '../api/client';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const SCANNER_ELEMENT_ID = 'qr-reader';
const RESULT_DISPLAY_MS = 2500;
const REMEMBERED_CAMERA_KEY = 'kiosk_camera_id';
// Virtual / software cameras that should never be auto-selected or remembered
// for QR scanning — they apply processing (blur, auto-framing, background
// replacement) that hurts decode reliability.
const VIRTUAL_CAMERA_REGEX = /nvidia|obs|virtual|snap camera|droidcam|manycam/i;

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    [880, 1175].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.15);
    });
  } catch {}
}

// Custom camera picker — pill button + dropdown with a checkmark on the active
// camera, styled to match the dark kiosk theme instead of a plain <select>.
function CameraPicker({ cameras, activeCameraId, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = cameras.find((c) => c.id === activeCameraId);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (cameras.length <= 1) return null;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs rounded-full px-3 py-1.5 hover:bg-slate-800"
      >
        <Camera size={13} />
        <span className="max-w-[160px] truncate">{active?.label || 'Select camera'}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-10">
          {cameras.map((cam) => (
            <button
              key={cam.id}
              onClick={() => {
                onChange(cam.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700"
            >
              <span className="w-4 shrink-0">
                {cam.id === activeCameraId && <Check size={13} className="text-sky-400" />}
              </span>
              <span className="truncate">{cam.label || cam.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScanKiosk() {
  const [result, setResult] = useState(null);
  const [clockText, setClockText] = useState('');
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const tick = () => setClockText(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const clockInterval = setInterval(tick, 1000 * 15);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    // Fix 4: pre-warm camera permission/access with a throwaway getUserMedia
    // call, then immediately release it. This (a) ensures device labels are
    // populated before enumeration, and (b) can clear a lingering soft-lock
    // left over from a previous session, so the *real* start() call below
    // has a clean camera to open instead of racing a half-released one.
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch(() => {
        // Ignore — if this fails (e.g. permission not yet granted), the
        // normal getCameras()/start() flow below will still surface any
        // real error to the user.
      })
      .finally(() => {
        Html5Qrcode.getCameras()
          .then((devices) => {
            setCameras(devices);

            // Fix 1: prefer devices whose label clearly identifies them as a
            // physical webcam, before falling back to "anything non-virtual".
            const isVirtual = (d) => VIRTUAL_CAMERA_REGEX.test(d.label);
            const looksLikeRealWebcam = (d) => /webcam|usb|integrated|camera/i.test(d.label);

            const preferredWebcam = devices.find((d) => !isVirtual(d) && looksLikeRealWebcam(d));
            const anyNonVirtual = devices.find((d) => !isVirtual(d));
            const pickFrom = preferredWebcam
              ? [preferredWebcam]
              : anyNonVirtual
              ? [anyNonVirtual]
              : devices;

            const remembered = localStorage.getItem(REMEMBERED_CAMERA_KEY);
            const rememberedIsUsable = devices.find(
              (d) => d.id === remembered && !isVirtual(d)
            );

            if (rememberedIsUsable) {
              setActiveCameraId(remembered);
              return;
            }

            setActiveCameraId(pickFrom[0]?.id || devices[0]?.id || null);
          })
          .catch((err) => setCameraError(err?.message || 'Could not list cameras'));
      });
  }, []);

  // Ensures we never call scanner.start() on a new camera before the
  // previous scanner instance has FULLY finished stopping and releasing
  // the hardware. Without this, a fast effect re-run (e.g. React 18
  // StrictMode's intentional double-invoke in development, or quick camera
  // switches) can leave an orphaned MediaStream holding the real webcam,
  // causing NotReadableError until the user manually switches away and back.
  const stopLockRef = useRef(Promise.resolve());

  useEffect(() => {
    if (!activeCameraId) return;

    let cancelled = false;
    const MAX_ATTEMPTS = 4;
    const RETRY_DELAY_MS = 700;

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function attemptStart(attempt) {
      if (cancelled) return;

      const container = document.getElementById(SCANNER_ELEMENT_ID);
      if (container) container.innerHTML = '';

      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          activeCameraId,
          { fps: 10, qrbox: { width: 240, height: 240 } },
          handleScanSuccess,
          (err) => {
            // Fires continuously while no QR code is detected in a frame —
            // this is normal. Uncomment to debug scan misses:
            // console.debug('scan miss:', err);
          }
        );
        if (!cancelled) {
          setCameraError('');
          setScanning(true);
        }
      } catch (err) {
        if (cancelled) return;

        const isTransient = /NotReadableError|Could not start video source/i.test(
          err?.message || String(err)
        );

        if (isTransient && attempt < MAX_ATTEMPTS) {
          await delay(RETRY_DELAY_MS);
          if (!cancelled) await attemptStart(attempt + 1);
        } else {
          setCameraError(err?.message || String(err));
        }
      }
    }

    // Chain onto the previous camera's stop — guarantees the old hardware
    // handle is actually released before we ever try to open a new one.
    // Fix 2: also give the browser a brief moment (500ms) before the very
    // first start attempt, since immediately calling start() right after
    // permission/enumeration can race the driver on some webcams.
    stopLockRef.current = stopLockRef.current.then(async () => {
      if (cancelled) return;
      await delay(500);
      if (cancelled) return;
      return attemptStart(1);
    });

    return () => {
      cancelled = true;
      const scannerToStop = scannerRef.current;
      stopLockRef.current = stopLockRef.current
        .catch(() => {})
        .then(() => (scannerToStop ? scannerToStop.stop().catch(() => {}) : undefined));
    };
  }, [activeCameraId]);

  function handleCameraChange(id) {
    localStorage.setItem(REMEMBERED_CAMERA_KEY, id);
    setScanning(false);
    setActiveCameraId(id);
  }

  async function handleScanSuccess(decodedText) {
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      const { data } = await api.post('/attendance/scan', {
        qrToken: decodedText,
        deviceLabel: 'Front Door Kiosk',
      });

      if (data.duplicate) {
        setResult({ kind: 'duplicate', name: data.staff?.name, photoUrl: data.staff?.photoUrl });
      } else {
        playBeep();
        setResult({
          kind: 'success',
          type: data.type,
          name: data.staff?.name,
          photoUrl: data.staff?.photoUrl,
          time: new Date(data.scannedAt),
        });
      }
    } catch (err) {
      setResult({ kind: 'error', message: err.response?.data?.error || 'Scan failed — try again' });
    }

    setTimeout(() => {
      setResult(null);
      busyRef.current = false;
    }, RESULT_DISPLAY_MS);
  }

  const activeCameraLabel = cameras.find((c) => c.id === activeCameraId)?.label;
  const statusLine = cameraError
    ? 'Camera unavailable'
    : !scanning
    ? 'Connecting to camera…'
    : result
    ? '\u00A0'
    : `Waiting for scan${activeCameraLabel ? ` · ${activeCameraLabel}` : '…'}`;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-8 text-white">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
              <QrCode size={16} />
            </div>
            <p className="font-semibold">StaffSync Check-in</p>
          </div>
          <p className="text-sm text-slate-400">{clockText}</p>
        </div>

        <p className="text-center font-medium mb-1">Scan QR Code</p>
        <p className="text-center text-sm text-slate-400 mb-4">Position the QR code within the frame</p>

        <div className="relative aspect-square rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl ring-1 ring-white/5">
          <div
            id={SCANNER_ELEMENT_ID}
            className="w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:object-cover"
          />

          {/* Vignette — darkens everything outside the scan square */}
          {scanning && !result && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.45)',
                WebkitMaskImage:
                  'radial-gradient(circle at center, transparent 128px, black 129px)',
              }}
            />
          )}

          {/* Corner brackets, glowing cyan */}
          {scanning && !result && (
            <>
              <div className="absolute top-10 left-10 w-10 h-10 border-l-4 border-t-4 border-cyan-400 rounded-tl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
              <div className="absolute top-10 right-10 w-10 h-10 border-r-4 border-t-4 border-cyan-400 rounded-tr-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
              <div className="absolute bottom-10 left-10 w-10 h-10 border-l-4 border-b-4 border-cyan-400 rounded-bl-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
              <div className="absolute bottom-10 right-10 w-10 h-10 border-r-4 border-b-4 border-cyan-400 rounded-br-xl shadow-[0_0_15px_rgba(34,211,238,.9)]" />
              <div className="absolute left-16 right-16 h-0.5 bg-cyan-400/90 shadow-[0_0_10px_3px_rgba(34,211,238,0.7)] animate-[scanline_2.2s_ease-in-out_infinite]" />
            </>
          )}

          {!scanning && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
              Starting camera…
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <AlertCircle size={40} className="text-red-400" />
              <p className="font-medium">Camera problem</p>
              <p className="text-xs text-slate-400 break-words">{cameraError}</p>
            </div>
          )}

          {result && (
            <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center gap-3 px-6 text-center animate-[fadeIn_0.2s_ease-out]">
              {result.kind === 'error' ? (
                <>
                  <AlertCircle size={40} className="text-red-400" />
                  <p className="font-medium">{result.message}</p>
                </>
              ) : (
                <>
                  {result.photoUrl ? (
                    <img
                      src={`${API_ORIGIN}${result.photoUrl}`}
                      alt={result.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center text-2xl font-semibold">
                      {result.name?.[0] || '?'}
                    </div>
                  )}
                  <p className="font-semibold text-lg">{result.name}</p>

                  {result.kind === 'duplicate' ? (
                    <p className="text-sm text-amber-300">Already recorded — scanned twice</p>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${result.type === 'check_in' ? 'text-sky-300' : 'text-slate-300'}`}>
                      {result.type === 'check_in' ? <CheckCircle2 size={16} /> : <LogOut size={16} />}
                      {result.type === 'check_in' ? 'Checked in' : 'Checked out'}
                      {' · '}
                      {result.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 mt-4">
          <CameraPicker
            cameras={cameras.filter((c) => !VIRTUAL_CAMERA_REGEX.test(c.label))}
            activeCameraId={activeCameraId}
            onChange={handleCameraChange}
          />
          <p className="text-xs text-slate-500">{statusLine}</p>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0%, 100% { top: 20%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 80%; opacity: 1; }
          90% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
