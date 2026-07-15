

// import React from 'react';
// import { ClipboardCheck } from 'lucide-react';

// export default function SplashScreen() {
//   return (
//     <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#0D2E2D]">
//       <div
//         className="absolute inset-0 blur-2xl scale-110 opacity-70"
//         style={{
//           background:
//             'radial-gradient(circle at 20% 20%, #FF6452 0%, transparent 40%), radial-gradient(circle at 80% 30%, #14403F 0%, transparent 40%), radial-gradient(circle at 50% 80%, #1C5B57 0%, transparent 50%)',
//         }}
//       />
//       <div className="absolute inset-0 bg-[#0D2E2D]/40" />

//       <div className="relative z-10 flex flex-col items-center px-6 text-center">
//         <div
//           className="w-20 h-20 rounded-3xl bg-[#FF6452] flex items-center justify-center shadow-2xl shadow-black/30 mb-5"
//           style={{ animation: 'popIn 0.5s ease-out' }}
//         >
//           <ClipboardCheck size={36} className="text-[#FDF8F0]" />
//         </div>

//         <p className="text-[#FDF8F0] text-2xl font-bold tracking-tight mb-1">StaffSync</p>
//         <p className="text-[#FDF8F0]/60 text-sm mb-10">Check in. Check out. Simple.</p>

//         <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
//           <div
//             className="h-full bg-[#FF6452] rounded-full"
//             style={{ animation: 'loadBar 1.4s ease-in-out forwards' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { ClipboardCheck } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#785BFF] via-[#5F74FF] to-[#1D91FF]">
      <div className="absolute -right-16 top-12 h-64 w-64 rounded-full bg-white/10" />
      <div className="absolute right-8 top-40 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-2xl shadow-black/20"
          style={{ animation: 'popIn 0.5s ease-out' }}
        >
          <ClipboardCheck size={36} className="text-[#7158F6]" />
        </div>

        <p className="mb-1 text-2xl font-black tracking-tight text-white">StaffSync</p>
        <p className="mb-10 text-sm text-white/70">Check in. Check out. Simple.</p>

        <div className="h-1 w-40 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{ animation: 'loadBar 1.4s ease-in-out forwards' }}
          />
        </div>
      </div>
    </div>
  );
}
