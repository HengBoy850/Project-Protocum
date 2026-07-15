
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Clock, ClipboardCheck } from 'lucide-react';

// export default function Pending() {
//   return (
//     <div className="min-h-screen bg-[#14403F] flex items-center justify-center px-4">
//       <div className="w-full max-w-sm bg-[#FDF8F0] rounded-3xl p-8 text-center shadow-2xl shadow-black/20">
//         <div className="flex items-center justify-center gap-2 mb-6">
//           <div className="w-9 h-9 rounded-xl bg-[#FF6452] flex items-center justify-center shadow-md shadow-[#FF6452]/30">
//             <ClipboardCheck size={17} className="text-[#FDF8F0]" />
//           </div>
//           <p className="text-lg font-bold text-[#1C1C1A]">StaffSync</p>
//         </div>

//         <div className="w-14 h-14 rounded-2xl bg-[#F5EFE3] flex items-center justify-center mx-auto mb-4">
//           <Clock size={26} className="text-[#FF6452]" />
//         </div>
//         <p className="font-semibold text-lg text-[#1C1C1A] mb-2">Request submitted</p>
//         <p className="text-sm text-[#6B6558] mb-6 leading-relaxed">
//           Your manager needs to confirm your details before you can sign in.
//           You'll be able to log in and see your QR code once approved.
//         </p>
//         <Link
//           to="/login"
//           className="block w-full bg-[#FF6452] hover:bg-[#F04B38] text-[#FDF8F0] rounded-xl py-2.5 text-sm font-semibold transition-colors shadow-md shadow-[#FF6452]/25"
//         >
//           Go to sign in
//         </Link>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ClipboardCheck } from 'lucide-react';

export default function Pending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#785BFF] via-[#5F74FF] to-[#1D91FF] px-4">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-2xl shadow-black/20">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7158F6] shadow-md shadow-[#7158F6]/30">
            <ClipboardCheck size={17} className="text-white" />
          </div>
          <p className="text-lg font-black text-[#20243F]">StaffSync</p>
        </div>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EDFF]">
          <Clock size={26} className="text-[#7158F6]" />
        </div>
        <p className="mb-2 text-lg font-black text-[#20243F]">Request submitted</p>
        <p className="mb-6 text-sm leading-relaxed text-[#858BA3]">
          Your manager needs to confirm your details before you can sign in.
          You'll be able to log in and see your QR code once approved.
        </p>
        <Link
          to="/login"
          className="block w-full rounded-2xl bg-[#7158F6] py-3 text-sm font-bold text-white shadow-lg shadow-[#7158F6]/25 transition hover:bg-[#6047E8]"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
